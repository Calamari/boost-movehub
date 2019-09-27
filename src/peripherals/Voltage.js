const Peripheral = require("./Peripheral");
const PortInputFormatSetup = require("../messages/PortInputFormatSetup");

class Voltage extends Peripheral {
  constructor(ioType, portId, options = undefined) {
    super(ioType, portId, options);
    this.displayName = "Voltage";
    this.lastValue = null;
    this.mode = Voltage.MODE_ONE;
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
    const volts = (9600.0 * msg.value) / 3893.0 / 1000.0;
    this.lastValue = volts;
  }

  toString() {
    return `${this.displayName}(lastValue=${this.lastValue} volt)`;
  }
}

// Don't know what else can this be?
Voltage.MODE_ONE = 0x00;

module.exports = Voltage;
