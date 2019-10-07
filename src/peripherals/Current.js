const Peripheral = require("./Peripheral");
const PortInputFormatSetup = require("../messages/PortInputFormatSetup");

class CurrentSensor extends Peripheral {
  constructor(ioType, portId, options = undefined) {
    super(ioType, portId, options);
    this.displayName = "CurrentSensor";
    this.emitAs = "current";
    this.lastValue = null;
  }

  /**
   * Creates a message that starts subscribing to updates.
   *
   * @param {number} [mode] Mode in which updates should come in (One of `CurrentSensor.MODE_*`)
   */
  subscribe(mode = CurrentSensor.MODE_ONE) {
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
    const milliampers = (2444 * msg.value) / 4095.0;
    this.lastValue = milliampers;
  }

  toString() {
    return `${this.displayName}(lastValue=${this.lastValue} milliampere)`;
  }
}

// Don't know what else can this be?
CurrentSensor.MODE_ONE = 0x00;

module.exports = CurrentSensor;
