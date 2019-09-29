const { EventEmitter } = require("events");

const MessageFactory = require("./MessageFactory");
const MovehubPorts = require("./MovehubPorts");
const PortOutputCommandFeedbackMessage = require("./messages/PortOutputCommandFeedbackMessage");
const HubAttachedMessage = require("./messages/HubAttachedMessage");
const PortValueSingleMessage = require("./messages/PortValueSingleMessage");
const UnknownMessage = require("./messages/UnknownMessage");
const HubAction = require("./messages/HubAction");
const HubAlert = require("./messages/HubAlert");

const Motor = require("./peripherals/Motor");

const DEFAULT_OPTIONS = {
  logger: {},
  neededDevices: [],
  reconnect: true
};

const LEGO_CHARACTERISTIC = "000016241212efde1623785feabcd123";

// TODO: Add different Error classes for different error cases
module.exports = class Hub extends EventEmitter {
  constructor(peripheral, options = DEFAULT_OPTIONS) {
    super();
    this.peripheral = peripheral;
    this.logger = options.logger || {};
    this.doReconnection = options.reconnect;
    this.neededDevices = options.neededDevices;
    this.ports = new MovehubPorts();

    this.connect();
  }

  get address() {
    return this.peripheral.address;
  }

  get uuid() {
    return this.peripheral.uuid;
  }

  connect() {
    this._log("debug", `Trying to connect to peripheral #${this.uuid}.`);
    this.peripheral.connect(err => {
      if (err) {
        this._log("error", "Could not connect to peripheral.");
        /**
         * @event Hub#error
         * @param error {Error}
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

  subscribeToAllPorts() {
    this._log("debug", `Subscribing to all ports.`);
    // this.sendMessage(this.ports.get(MovehubPorts.PORT_TILT).subscribe());
    this.sendMessage(this.ports.get(MovehubPorts.PORT_VOLTAGE).subscribe());
    this.sendMessage(this.ports.get(MovehubPorts.PORT_CURRENT).subscribe());
    // this.ports
    //   .get(MovehubPorts.PORT_TILT)
    //   .on("data", data => this.emit("tilt", data));
    // this.sendMessage(PortInputFormatSetup.build(MovehubPorts.PORT_CURRENT));
    // this.sendMessage(PortInputFormatSetup.build(MovehubPorts.PORT_VOLTAGE));
    // this.ports.get(MovehubPorts.PORT_TILT).subscribe(data => {
    //   console.log("TILT:", data);
    // });
  }

  disconnect() {
    this.sendMessage(HubAction.build(HubAction.DISCONNECT));
  }

  switchOff() {
    this.sendMessage(HubAction.build(HubAction.SWITCH_OFF_HUB));
  }

  immediateShutdown() {
    this.sendMessage(HubAction.build(HubAction.IMMEDIATE_SHUTDOWN));
  }

  /**
   * Sends message to activate/deactivate main LED with given color.
   *
   * @param {number} color
   */
  led(color) {
    this.sendMessage(this.ports.get(MovehubPorts.PORT_LED).setColor(color));
  }

  /**
   * TODO
   * @param  {...any} rgb
   */
  ledRGB(...rgb) {
    this.sendMessage(this.ports.get(MovehubPorts.PORT_LED).setRgbColor(...rgb));
  }

  /**
   * Sends message to start a Motor on Port D.
   *
   * @param {number} dutyCycle
   */
  startMotorD(dutyCycle) {
    this.sendMessage(this.ports.get(MovehubPorts.PORT_D).startPower(dutyCycle));
  }

  /**
   * Sends message to stop a Motor on Port D.
   */
  stopMotorD() {
    this.sendMessage(this.ports.get(MovehubPorts.PORT_D).stop());
  }

  turnMotorAB(degrees, speedL = 100, speedR = 100, maxPower = 100) {
    this.sendMessage(
      this.ports
        .get(MovehubPorts.PORT_AB)
        .combinedStartSpeedForDegrees(
          degrees,
          speedL,
          speedR,
          maxPower,
          Motor.END_STATE_BREAK,
          Motor.PROFILE_ACCELERATION | Motor.PROFILE_DEACCELERATION
        )
    );
  }

  turnMotorD(degrees, speed = 100, maxPower = 100) {
    this.sendMessage(
      this.ports
        .get(MovehubPorts.PORT_D)
        .startSpeedForDegrees(
          degrees,
          speed,
          maxPower,
          Motor.END_STATE_BREAK,
          Motor.PROFILE_ACCELERATION | Motor.PROFILE_DEACCELERATION
        )
    );
  }

  sendMessage(msg, callback = null) {
    this._log("debug", "Sending message", msg.toString(), msg.data);
    this.characteristic.write(msg.data, true, (...args) => {
      this._log("silly", "Callback from write", args);
      callback && callback(...args);
    });
  }

  /**
   * This subscribes to all or specific Hub Alerts.
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
      this.sendMessage(HubAlert.build(alertType, HubAlert.OP_DISABLE_UPDATES));
    });
  }

  _handleDisconnection() {
    this.peripheral.on("disconnect", () => {
      this._log("debug", `Peripheral #${this.uuid} disconnected.`);
      /**
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
         * @event Hub#rssi
         * @param rssi {number}
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
      if (
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
    } else if (msg instanceof PortValueSingleMessage) {
      this._log("debug", `Got value: ${msg.toString()}`);
      const peripheral = this.ports.get(msg.portId);
      if (peripheral) {
        if (peripheral.receiveValue) {
          peripheral.receiveValue(msg);
          this.emit("tilt", peripheral.lastValue);
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
      // this.parseSensor(data);
    } else if (msg instanceof HubAlert) {
      this._log("info", "Got Alert:", msg.alertTypeToString());
      /**
       * Fires on received Hub Alert.
       * @event Hub#hubAlert
       */
      this.emit("hubAlert", msg.alertTypeToString());
    } else if (msg instanceof PortOutputCommandFeedbackMessage) {
      this._log("info", "Got feedback:", msg.toString());
      const data = msg.valuesForPorts;
      Object.keys(data).forEach(portId => {
        const peripheral = this.ports.get(portId);
        if (peripheral.receiveFeedback) {
          peripheral.receiveFeedback(data[portId]);
        }
      });
    } else if (msg instanceof UnknownMessage) {
      this._log("warn", `Unknown message ${msg.toString()}`);
    } else {
      this._log("debug", `Unprocessed message ${msg.toString()}`);
    }
  }

  get _allNeededDevicesRegistered() {
    return this.ports.containsAll(this.neededDevices);
  }

  _log(type, ...message) {
    this.logger[type] && this.logger[type]("[Hub]", ...message);
  }
};
