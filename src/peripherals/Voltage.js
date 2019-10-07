const Peripheral = require("./Peripheral");
const PortInputFormatSetup = require("../messages/PortInputFormatSetup");

class VoltageSensor extends Peripheral {
  constructor(ioType, portId, options = undefined) {
    super(ioType, portId, options);
    this.displayName = "VoltageSensor";
    this.emitAs = "voltage";
    this.lastValue = null;
  }

  /**
   * Creates a message that starts subscribing to updates.
   *
   * @param {number} [mode] Mode in which updates should come in (One of `VoltageSensor.MODE_*`)
   */
  subscribe(mode = VoltageSensor.MODE_ONE) {
    this.mode = mode;
    return PortInputFormatSetup.build(this.portId, { mode });
  }

  /**
   * Disable from all updates from hub
   */
  unsubscribe() {
    return PortInputFormatSetup.build(this.portId, {
      notificationEnabled: PortInputFormatSetup.DISABLE_NOTIFICATONS
    });
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
VoltageSensor.MODE_ONE = 0x00;

module.exports = VoltageSensor;
