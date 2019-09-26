const Peripheral = require("./Peripheral");
const PortOutput = require("../messages/PortOutput");
const { int32ToArray } = require("../helpers");

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
  startPower(dutyCycle) {
    return PortOutput.buildWriteDirectModeData(
      this.portId,
      PortOutput.SC_FLAGS.EXECUTE_IMMEDIATE,

      [Motor.SUB_CMD_START_POWER, dutyCycle]
    );
  }

  /**
   * Creates stops message for motor.
   */
  stop() {
    return this.startPower(0);
  }

  /**
   *
   * Sends message as defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#output-sub-command-startspeedfordegrees-degrees-speedl-speedr-maxpower-endstate-useprofile-0x0c
   *
   * @param {number} degrees [-10000000..10000000] Degrees to turn
   * @param {number} speed [0..100]
   * @param {number} maxPower [0..100]
   * @param {number} endState One of `Motor.END_STATE_*`
   * @param {number} useProfile Bitlist containing profiles to use (Select from `Motor.PROFILE_*`)
   */
  startSpeedForDegrees(
    degrees,
    speed,
    maxPower,
    endState = Motor.END_STATE_FLOAT,
    useProfile = Motor.PROFILE_DO_NOT_USE
  ) {
    if (degrees < 0) {
      degrees = -degrees;
      speed = -speed;
    }
    return PortOutput.build(
      this.portId,

      [
        Motor.SUB_CMD_START_POWER_FOR_DEGREES,
        ...int32ToArray(degrees),
        speed,
        maxPower,
        endState,
        useProfile
      ]
    );
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
Motor.SUB_CMD_START_POWER_FOR_DEGREES = 0x0b;

Motor.END_STATE_FLOAT = 0;
Motor.END_STATE_HOLD = 126;
Motor.END_STATE_BREAK = 127;

Motor.PROFILE_DO_NOT_USE = 0;
Motor.PROFILE_ACCELERATION = 0b01;
Motor.PROFILE_DEACCELERATION = 0b10;

module.exports = Motor;
