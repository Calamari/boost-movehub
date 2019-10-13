const Peripheral = require("./Peripheral");

class VoltageSensor extends Peripheral {
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
