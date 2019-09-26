const Peripheral = require("./Peripheral");
const PortOutput = require("../messages/PortOutput");

class Motor extends Peripheral {
  constructor(ioType, portId, options = undefined) {
    super(ioType, portId, options);
    this.displayName = "Motor";
    this.lastValue = null;
    this.mode = Motor.MODE_2AXIS_ANGLE;
  }

  /**
   * Just starts/stops the motor.
   * Sends message as defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#output-sub-command-startpower-power
   * FIXME: 0 gives a piezo sound, so I guess that is not totally correct
   *
   * @param {number} dutyCycle [-100..-1] Percentage CCW, [1..100] Percentage CW, [0] to stop
   */
  start(dutyCycle) {
    return PortOutput.build(
      this.portId,
      PortOutput.SC_FLAGS.EXECUTE_IMMEDIATE,
      PortOutput.SUB_CMD_WRITE_DIRECT_MODE_DATA,

      [Motor.SUB_CMD_START_POWER, dutyCycle]
    );
  }

  /**
   * Creates stops message for motor.
   */
  stop() {
    return this.start(0);
  }

  /**
   * Receives and processes message with value from sensor.
   * @param {PortValueSingleMessage} msg
   */
  receiveValue(_msg) {
    this._log("info", `.receiveValue not implemetned`);
  }
}

Motor.SUB_CMD_START_POWER = 0x01;

module.exports = Motor;
