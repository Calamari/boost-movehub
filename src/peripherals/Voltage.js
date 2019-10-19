const Peripheral = require("./Peripheral");

/**
 * This handles the communication with the internal voltage sensor of Movehub.
 * The values it produces are in volts.
 */
class VoltageSensor extends Peripheral {
  /**
   * @param {Number} ioType Peripheral Device Type ID (Should be `Peripheral.DEV_VOLTAGE`)
   * @param {Number} portId Port ID this peripheral is connected to
   * @param {object} [options.ioMembers] If this has severeal members, it is a virtual device
   * @param {object} [options.logger]
   */
  constructor(ioType, portId, options = undefined) {
    super(ioType, portId, options);
    this.displayName = "VoltageSensor";
    this.emitAs = "voltage";
    this.defaultMode = VoltageSensor.MODE_ONE;
  }

  /**
   * Receives and processes message with value from sensor.
   *
   * @param {PortValueSingleMessage} msg
   */
  receiveValue(msg) {
    // Formula thanks to https://github.com/undera/pylgbst
    const volts = (9600.0 * msg.value) / 3893.0 / 1000.0;
    this.setValue(volts);
  }

  toString() {
    return `${this.displayName}(lastValue=${this.lastValue} volt)`;
  }
}

// Don't know what else can this be?
VoltageSensor.MODE_ONE = 0x00;

module.exports = VoltageSensor;
