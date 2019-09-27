const Peripheral = require("./Peripheral");
const PortInputFormatSetup = require("../messages/PortInputFormatSetup");

class Current extends Peripheral {
  constructor(ioType, portId, options = undefined) {
    super(ioType, portId, options);
    this.displayName = "Current";
    this.lastValue = null;
    this.mode = Current.MODE_ONE;
  }

  /**
   * Creates a message that starts subscribing to updates.
   */
  subscribe() {
    return PortInputFormatSetup.build(this.portId, { mode: this.mode });
  }

  /**
   * Receives and processes message with value from sensor.
   *
   * @param {PortValueSingleMessage} msg
   */
  receiveValue(msg) {
    // Formula thanks to https://github.com/undera/pylgbst
    const milliampers = (2444 * msg.value) / 4095.0;
    this.lastValue = milliampers;
  }

  toString() {
    return `${this.displayName}(lastValue=${this.lastValue} milliampere)`;
  }
}

// Don't know what else can this be?
Current.MODE_ONE = 0x00;

module.exports = Current;
