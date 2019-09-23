const Peripheral = require("./peripherals/Peripheral");
const TiltSensor = require("./peripherals/TiltSensor");
const UnknownPeripheral = require("./peripherals/UnknownPeripheral");

module.exports = {
  mapping: {
    [Peripheral.DEV_TILT_INTERNAL]: TiltSensor
  },

  /**
   * Creates an instance of a Peripheral implementation
   *
   * @param {Number} ioType
   * @returns {Peripheral | UnknownPeripheral} Returns an instance of DeviceMessage subclass, or null if message type is unknown to us
   */
  create(ioType) {
    if (this.mapping[ioType]) {
      const PeripheralClass = this.mapping[ioType];
      return new PeripheralClass(ioType);
    }
    return new UnknownPeripheral(ioType);
  }
};
