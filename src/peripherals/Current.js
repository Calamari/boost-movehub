const Peripheral = require("./Peripheral");

/**
 * This handles the communication with the internal current sensor of Movehub.
 * The values it produces are in milliamperes.
 */
class CurrentSensor extends Peripheral {
  /**
   * @param {Number} ioType Peripheral Device Type ID (Should be `Peripheral.DEV_CURRENT`)
   * @param {Number} portId Port ID this peripheral is connected to
   * @param {object} [options.ioMembers] If this has severeal members, it is a virtual device
   * @param {object} [options.logger]
   */
  constructor(ioType, portId, options = undefined) {
    super(ioType, portId, options);
    this.displayName = "CurrentSensor";
    this.emitAs = "current";
    this.defaultMode = CurrentSensor.MODE_ONE;
  }

  /**
   * Receives and processes message with value from sensor.
   *
   * @param {PortValueSingleMessage} msg
   */
  receiveValue(msg) {
    // Formula thanks to https://github.com/undera/pylgbst
    const milliampers = (2444 * msg.value) / 4095.0;
    this.setValue(this.lastValue);
  }

  toString() {
    return `${this.displayName}(lastValue=${this.lastValue} milliampere)`;
  }
}

// Don't know what else can this be?
CurrentSensor.MODE_ONE = 0x00;

module.exports = CurrentSensor;
