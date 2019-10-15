const { EventEmitter } = require("events");
const noble = require("noble");

const Hub = require("./Hub");

const NOBLE_POWERED_ON = "poweredOn";

const DEFAULT_OPTIONS = {
  logger: {}
};

module.exports = class Boost extends EventEmitter {
  /**
   * Boost is scans for Boost devices like your movehub.
   *
   * @param {string} hubAddressOrUuid The UUID or MAC address of the movehub to connect to.
   * @param {Object} [options] Some options.
   * @param {Object} [options.logger] Logger implementation when logging is desired.
   */
  constructor(hubAddressOrUuid, options = DEFAULT_OPTIONS) {
    super();
    this.hubAddressOrUuid = hubAddressOrUuid;
    this.isScanning = false;
    this.logger = options.logger || {};

    this.initNoble();
  }

  /**
   * Initializes noble event handles.
   * @private
   */
  initNoble() {
    noble.on("stateChange", state => {
      if (state === "poweredOn") {
        if (this.isScanning) {
          this.startScanning();
        }
      } else {
        this.stopScanning();
      }
    });

    noble.on("discover", peripheral => {
      this.onDiscover(peripheral);
    });
  }

  /**
   * Starts scanning for peripherals.
   */
  startScanning() {
    this.isScanning = true;
    if (noble.state === NOBLE_POWERED_ON) {
      this._log("debug", "start scanning …");
      noble.startScanning();
    }
  }

  /**
   * Stops scanning for peripherals.
   */
  stopScanning() {
    this.isScanning = false;
    this._log("debug", "stop scanning");
    noble.stopScanning();
  }

  /**
   * Called when noble is discovering a matching BLE Peripheral.
   *
   * @param {Object} peripheral Peripheral data found by noble.
   */
  onDiscover(peripheral) {
    // this._log('debug', peripheral)
    this._log(
      "debug",
      "Discovered",
      peripheral.advertisement.localName,
      "with address",
      peripheral.address,
      peripheral.addressType,
      `(${peripheral.uuid}).`
    );
    if (
      this.hubAddressOrUuid === peripheral.address ||
      this.hubAddressOrUuid === peripheral.uuid
    ) {
      this.createHub(peripheral);
    } else {
      this._log("debug", "Not this one.");
    }
  }

  /**
   * Creates a Hub instance from found peripheral.
   *
   * @private
   * @param {Object} peripheral
   */
  createHub(peripheral) {
    this.hub = new Hub(peripheral, { logger: this.logger });

    this.hub.on("error", err => {
      this._log("error", "Hub produces error:", err);
      this.emit("error", err);
    });

    this.hub.on("connect", err => {
      if (err) {
        this._log("error", "Failed to connect to hub.", err);
        return;
      }

      this._log("debug", "Connected to hub.");
      this.stopScanning();

      /**
       * @event Boost#hubConnected
       * @param hub {Hub} The hub that just connected.
       */
      this.emit("hubConnected", this.hub);
    });

    this.hub.on("disconnect", () => {
      this._log("debug", `Disconnected from hub ${this.hub.uuid}.`);

      console.log("searching for new hub");
      this.startScanning();
    });
  }

  _log(type, ...message) {
    this.logger[type] &&
      this.logger[type]("[Boost]", new Date().toISOString(), ...message);
  }
};
