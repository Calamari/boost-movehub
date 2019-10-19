const { EventEmitter } = require("events");

const MessageFactory = require("./MessageFactory");
const MovehubPorts = require("./MovehubPorts");
const PortOutputCommandFeedbackMessage = require("./messages/PortOutputCommandFeedbackMessage");
const HubAttachedMessage = require("./messages/HubAttachedMessage");
const PortInputFormat = require("./messages/PortInputFormat");
const PortValueSingleMessage = require("./messages/PortValueSingleMessage");
const UnknownMessage = require("./messages/UnknownMessage");
const HubAction = require("./messages/HubAction");
const HubAlert = require("./messages/HubAlert");

const { toHexString } = require("./helpers");

const DEFAULT_OPTIONS = {
  logger: {},
  neededDevices: [],
  reconnect: true
};

const LEGO_CHARACTERISTIC = "000016241212efde1623785feabcd123";

// TODO: Add different Error classes for different error cases
/**
 * Movehub implementation that handles all the sending and receiving of messages
 * between us and the Movehub device.
 */
module.exports = class Hub extends EventEmitter {
  /**
   * @param {Object} peripheral The Movehub data received by `noble`.
   * @param {Object} [options] Some options
   * @param {boolean} [options.reconnect=true] Set to true if we should try reconnect if connection gets lost.
   * @param {number[]} [options.neededDevices=[]] PortIds that have to register themselves, bevore the `hubConnected` event is triggered.
   * @param {Object} [options.logger={}] Logging Interface. Object containing methods like `error`, `info`, `log`, `silly` or `warn`.
   */
  constructor(peripheral, options = DEFAULT_OPTIONS) {
    super();
    this.peripheral = peripheral;
    this.logger = options.logger || {};
    this.doReconnection = options.reconnect;
    this.neededDevices = options.neededDevices;
    this.ports = new MovehubPorts({ logger: this.logger });

    this.connect();
  }

  /**
   * MAC Address of connected Movehub.
   */
  get address() {
    return this.peripheral.address;
  }

  /**
   * UUID of connected Movehub.
   */
  get uuid() {
    return this.peripheral.uuid;
  }

  /**
   * Tries connecting to initialized Movehub.
   */
  connect() {
    this._log("debug", `Trying to connect to peripheral #${this.uuid}.`);
    this.peripheral.connect(err => {
      if (err) {
        this._log("error", "Could not connect to peripheral.");
        /**
         * Fires when an error is received when connecting to the Movehub.
         * @event Hub#error
         * @param {Error} error
         */
        this.emit("error", err);
        return;
      }
      this._log("debug", `Peripheral #${this.uuid} connected.`);
      this._startIntervalForRssi();
      this._handleDisconnection();
      this._doServiceDiscovery();
    });
  }

  /**
   * Sends disconnection signal and disconnects from Movehub.
   */
  disconnect() {
    this.sendMessage(HubAction.build(HubAction.DISCONNECT));
  }

  /**
   * Sends SwitchOff signal to Movehub.
   */
  switchOff() {
    this.sendMessage(HubAction.build(HubAction.SWITCH_OFF_HUB));
  }

  /**
   * Sends signal to immediately shut down Movehub.
   */
  immediateShutdown() {
    this.sendMessage(HubAction.build(HubAction.IMMEDIATE_SHUTDOWN));
  }

  /**
   * Sends given device message to connected Movehub.
   *
   * @param {DeviceMessage} msg Message to send.
   * @param {function} callback
   */
  sendMessage(msg, callback = null) {
    this._log("debug", "Sending message", msg.toString(), msg.data);
    this.characteristic.write(msg.data, false, (...args) => {
      this._log("silly", "Callback from write", args);
      callback && callback(...args);
    });
  }

  /**
   * This subscribes to all or specific Hub Alerts.
   *
   * @param {number[]} [filter] List of HubAlert to subscribe to. Default are all.
   */
  activateAlerts(filter = null) {
    if (filter === null) {
      filter = [
        (HubAlert.LOW_VOLTAGE = 0x01),
        (HubAlert.HIGH_CURRANT = 0x02),
        (HubAlert.LOG_SIGNAL_STRGENTH = 0x03),
        (HubAlert.OVER_POWER_CONDITION = 0x04)
      ];
    }
    filter.forEach(alertType => {
      this.sendMessage(HubAlert.build(alertType, HubAlert.OP_ENABLE_UPDATES));
    });
  }

  /**
   * This unsubscribes from all or specifc Hub Alerts.
   *
   * @param {number[]} [filter] List of HubAlert to subscribe to. Default are all.
   */
  deactivateAlerts(filter = null) {
    if (filter === null) {
      filter = [
        (HubAlert.LOW_VOLTAGE = 0x01),
        (HubAlert.HIGH_CURRANT = 0x02),
        (HubAlert.LOG_SIGNAL_STRGENTH = 0x03),
        (HubAlert.OVER_POWER_CONDITION = 0x04)
      ];
    }
    filter.forEach(alertType => {
      this.sendMessage(HubAlert.build(alertType, HubAlert.OP_DISABLE_UPDATES));
    });
  }

  _handleDisconnection() {
    this.peripheral.on("disconnect", () => {
      this._log("debug", `Peripheral #${this.uuid} disconnected.`);
      /**
       * Fires when a Movehub gets disconnected.
       * @event Hub#disconnect
       */
      this.emit("disconnect");
      if (this.noReconnect) {
        this.noReconnect = false;
      } else {
        this.reconnectInterval = setInterval(() => {
          if (this.peripheral.state === "disconnected") {
            this.connect();
          }
        }, 1000);
      }
    });
  }

  _startIntervalForRssi() {
    setInterval(() => {
      this.peripheral.updateRssi();
    }, 1000);

    this.peripheral.on("rssiUpdate", rssi => {
      if (this.rssi !== rssi) {
        /**
         * Fires when new RSSI value is received from BLE device.
         * @event Hub#rssi
         * @param {number} rssi The received RSSI value.
         */
        this.emit("rssi", rssi);
        this.rssi = rssi;
      }
    });
  }

  _doServiceDiscovery() {
    this.peripheral.discoverAllServicesAndCharacteristics(
      (err, services, characteristics) => {
        if (err) {
          this._log(
            "error",
            "Error in services and characteristics discovery.",
            err
          );
          this.emit("error", err);
        }

        services.forEach(service => {
          this._log("info", "Service found.", service.uuid);
        });

        characteristics.forEach(c => {
          this._log("info", "Characteristic found.", c.uuid, c);

          if (c.uuid === LEGO_CHARACTERISTIC) {
            this.characteristic = c;

            c.on("data", data =>
              this._receiveMessage(MessageFactory.create(data))
            );
            c.subscribe((err, data) => {
              if (err) {
                this._log("error", "Error in characteristic:", err);
                this.emit("error", err);
              } else {
                this._log("debug", "Received from characteristic:", data);
              }
            });
          }
        });
      }
    );
  }

  /**
   * Called when a Movehub sends a message.
   *
   * @param {DeviceMessage} msg
   */
  _receiveMessage(msg) {
    this._log("debug", "Parse data:", msg && msg.data);

    // TODO: Add timeout for not registering all needed devices in time.
    if (msg instanceof HubAttachedMessage) {
      this._log(
        "debug",
        "Message:",
        msg.portId,
        msg.eventType,
        msg.ioType,
        msg.ioMembers
      );
      this.ports.registerFromMessage(msg);
      this._registerEmitterOnPort(msg.portId);
      if (
        !this.connected &&
        this.ports.builtInDevicesRegistered &&
        this._allNeededDevicesRegistered
      ) {
        /**
         * Fires when a connection to the Move Hub is established.
         * @event Hub#connect
         */
        this.emit("connect");
        this.connected = true;
      }
    } else if (msg instanceof PortInputFormat) {
      this._log("debug", `Got answer for setup on ${toHexString(msg.portId)}`);
      const peripheral = this.ports.get(msg.portId);
      if (peripheral) {
        if (peripheral.receiveSubscriptionAck) {
          peripheral.receiveSubscriptionAck(msg);
        } else {
          this._log(
            "warn",
            `Undefined method .receiveSubscriptionAck for peripheral ${peripheral}`
          );
        }
      } else {
        this._log(
          "warn",
          `Received message for unregistered port ${msg.portId}`,
          msg.toString()
        );
      }
    } else if (msg instanceof PortValueSingleMessage) {
      // this._log("debug", `Got value: ${msg.toString()}`);
      const peripheral = this.ports.get(msg.portId);
      if (peripheral) {
        if (peripheral.receiveValue) {
          peripheral.receiveValue(msg);
        } else {
          this._log(
            "warn",
            `Undefined method .receiveValue for peripheral ${peripheral}`
          );
        }
      } else {
        this._log(
          "warn",
          `Received message for unregistered port ${msg.portId}`,
          msg.toString()
        );
      }
    } else if (msg instanceof HubAlert) {
      this._log("info", "Got Alert:", msg.alertTypeToString());
      /**
       * Fires on received Hub Alert.
       * @event Hub#hubAlert
       * @param value {string} String representation of HubAlert that happened.
       */
      this.emit("hubAlert", msg.alertTypeToString());
    } else if (msg instanceof PortOutputCommandFeedbackMessage) {
      this._log("info", "Got feedback:", msg.toString());
      const data = msg.valuesForPorts;
      Object.keys(data).forEach(portId => {
        const peripheral = this.ports.get(portId);
        if (peripheral.receiveCommandFeedback) {
          peripheral.receiveCommandFeedback(data[portId]);
        } else {
          this._log(
            "warn",
            `Undefined method .receiveCommandFeedback for peripheral ${peripheral}`
          );
        }
      });
    } else if (msg instanceof UnknownMessage) {
      this._log("warn", `Unknown message ${msg.toString()}`);
    } else {
      this._log("debug", `Unprocessed message ${msg.toString()}`);
    }
  }

  _registerEmitterOnPort(portId) {
    const peripheral = this.ports.get(portId);
    if (peripheral.emitAs) {
      peripheral.on("value", value => this.emit(peripheral.emitAs, value));
    }
  }

  get _allNeededDevicesRegistered() {
    return this.ports.containsAll(this.neededDevices);
  }

  _log(type, ...message) {
    this.logger[type] &&
      this.logger[type]("[Hub]", new Date().toISOString(), ...message);
  }
};
