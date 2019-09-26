const Motor = require("./peripherals/Motor");
const RgbLed = require("./peripherals/RgbLed");
const Peripheral = require("./peripherals/Peripheral");
const TiltSensor = require("./peripherals/TiltSensor");
const UnknownPeripheral = require("./peripherals/UnknownPeripheral");

module.exports = {
  mapping: {
    [Peripheral.DEV_TILT_INTERNAL]: TiltSensor,
    [Peripheral.DEV_RGB_LIGHT]: RgbLed,
    [Peripheral.DEV_MOTOR_EXTERNAL_TACHO]: Motor,
    [Peripheral.DEV_MOTOR_INTERNAL_TACHO]: Motor
  },

  /**
   * Creates an instance of a Peripheral implementation
   *
   * @param {Number} ioType
   * @param {Number} portId
   * @param {object} [options.ioMembers] If this has severeal members, it is a virtual device
   * @param {object} [options.logger]
   * @returns {Peripheral | UnknownPeripheral} Returns an instance of DeviceMessage subclass, or null if message type is unknown to us
   */
  create(ioType, portId, options) {
    if (this.mapping[ioType]) {
      const PeripheralClass = this.mapping[ioType];
      return new PeripheralClass(ioType, portId, options);
    }
    return new UnknownPeripheral(ioType, portId, options);
  }
};
