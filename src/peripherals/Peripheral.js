const { EventEmitter } = require("events");

const DEFAULT_OPTIONS = {
  logger: {}
};

class Peripheral extends EventEmitter {
  /**
   * @param {Number} ioType Peripheral Device Type ID (One of `Peripheral.DEV_*`)
   * @param {Number} portId Port ID this peripheral is connected to
   * @param {object} [options.ioMembers] If this has severeal members, it is a virtual device
   * @param {object} [options.logger]
   */
  constructor(ioType, portId, options = DEFAULT_OPTIONS) {
    super();
    this.displayName = "Peripheral";
    this.ioType = ioType;
    this.portId = portId;
    this.logger = options.logger || {};
    this.isVirtualDevice = !!options.ioMembers;
  }

  _log(type, ...message) {
    this.logger[type] &&
      this.logger[type](`"[${this.displayName}]"`, ...message);
  }
}

/**
 * Defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#io-type-id
 */
Peripheral.DEV_MOTOR = 0x0001; // 1
Peripheral.DEV_SYSTEM_TRAIN_MOTOR = 0x0002; // 2
Peripheral.DEV_BUTTON = 0x0005; // 5
Peripheral.DEV_LED_LIGHT = 0x0008; // 8
Peripheral.DEV_VOLTAGE = 0x0014; // 20
Peripheral.DEV_CURRENT = 0x0015; // 21
Peripheral.DEV_PIEZO_SOUND = 0x0016; // 22
Peripheral.DEV_RGB_LIGHT = 0x0017; // 23
Peripheral.DEV_TILT_EXTERNAL = 0x0022; // 34
Peripheral.DEV_MOTION_SENSOR = 0x0023; // 35
Peripheral.DEV_VISION_SENSOR = 0x0025; // 37
Peripheral.DEV_MOTOR_EXTERNAL_TACHO = 0x0026; // 38
Peripheral.DEV_MOTOR_INTERNAL_TACHO = 0x0027; // 39
Peripheral.DEV_TILT_INTERNAL = 0x0028; // 40

module.exports = Peripheral;
