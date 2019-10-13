const Peripheral = require("./Peripheral");

class CurrentSensor extends Peripheral {
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
