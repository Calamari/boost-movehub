const Peripheral = require("./Peripheral");
const PortInputFormatSetup = require("../messages/PortInputFormatSetup");
const PortOutput = require("../messages/PortOutput");
const PortOutputCommandFeedbackMessage = require("../messages/PortOutputCommandFeedbackMessage");
const { int16ToArray, int32ToArray } = require("../helpers");

class Motor extends Peripheral {
  constructor(ioType, portId, options = undefined) {
    super(ioType, portId, options);
    this.displayName = "Motor";
    this.status = Motor.STOPPED;
    this.mode = Motor.MODE_MOTOR;
  }

  /**
   * Just starts/stops the motor.
   * Sends message as defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#output-sub-command-startpower-power
   * FIXME: 0 gives a piezo sound, so I guess that is not totally correct
   *
   * @param {number} dutyCycle [-100..-1] Percentage CCW, [1..100] Percentage CW, [0] to stop
   */
  startPower(dutyCycle) {
    if (this.isVirtualDevice) {
      throw new Error("Virtual Device cannot start Power on only one motor.");
    }
    return PortOutput.buildWriteDirectModeData(
      this.portId,
      PortOutput.SC_FLAGS.EXECUTE_IMMEDIATE,
      Motor.SUB_CMD_START_POWER,
      [dutyCycle]
    );
  }

  /**
   * Just starts/stops the motor.
   * Sends message as defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#output-sub-command-startspeed-speed-maxpower-useprofile-0x07
   * FIXME: 0 gives a piezo sound, so I guess that is not totally correct
   *
   * @param {number} dutyCycle [-100..-1] Percentage CCW, [1..100] Percentage CW, [0] to stop
   * @param {number} [maxSpeed] [0..100]%
   * @param {number} useProfile Bitlist containing profiles to use (Select from `Motor.PROFILE_*`, defaults to `Motor.PROFILE_ACCELERATION | Motor.PROFILE_DEACCELERATION`)
   */
  startSpeed(
    dutyCycle,
    maxSpeed = 100,
    useProfile = Motor.PROFILE_ACCELERATION | Motor.PROFILE_DEACCELERATION
  ) {
    if (this.isVirtualDevice) {
      throw new Error("Virtual Device cannot start Power on only one motor.");
    }
    return PortOutput.build(
      this.portId,
      PortOutput.SC_FLAGS.EXECUTE_IMMEDIATE,
      Motor.SUB_CMD_START_SPEED,
      [dutyCycle, maxSpeed, useProfile]
    );
  }

  /**
   * Starts the motor for given amount of time.
   * Sends message as defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#output-sub-command-startspeedfortime-time-speed-maxpower-endstate-useprofile-0x09
   *
   * @param {number} time [0..2^15] milliseconds
   * @param {number} dutyCycle [-100..-1] Percentage CCW, [1..100] Percentage CW, [0] to stop
   * @param {number} maxSpeed [0..100]%
   * @param {number} endState One of `Motor.END_STATE_*`
   * @param {number} useProfile Bitlist containing profiles to use (Select from `Motor.PROFILE_*`, defaults to `Motor.PROFILE_ACCELERATION | Motor.PROFILE_DEACCELERATION`)
   */
  startSpeedForTime(
    time,
    dutyCycle,
    maxSpeed = 100,
    endState = Motor.END_STATE_FLOAT,
    useProfile = Motor.PROFILE_ACCELERATION | Motor.PROFILE_DEACCELERATION
  ) {
    if (this.isVirtualDevice) {
      throw new Error("Virtual Device cannot start Power on only one motor.");
    }
    return PortOutput.build(
      this.portId,
      PortOutput.SC_FLAGS.EXECUTE_IMMEDIATE,
      Motor.SUB_CMD_START_SPEED_FOR_TIME,
      [...int16ToArray(time), dutyCycle, maxSpeed, endState, useProfile]
    );
  }

  /**
   * Turns the motor for given number of degrees
   * Sends message as defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#output-sub-command-startspeedfordegrees-degrees-speed-maxpower-endstate-useprofile-0x0b
   *
   * @param {number} degrees [0..2^31] milliseconds
   * @param {number} dutyCycle [-100..-1] Percentage CCW, [1..100] Percentage CW, [0] to stop
   * @param {number} maxSpeed [0..100]%
   * @param {number} endState One of `Motor.END_STATE_*`
   * @param {number} useProfile Bitlist containing profiles to use (Select from `Motor.PROFILE_*`, defaults to `Motor.PROFILE_ACCELERATION | Motor.PROFILE_DEACCELERATION`)
   */
  startSpeedForDegrees(
    degrees,
    dutyCycle,
    maxSpeed = 100,
    endState = Motor.END_STATE_BREAK,
    useProfile = Motor.PROFILE_ACCELERATION | Motor.PROFILE_DEACCELERATION
  ) {
    if (this.isVirtualDevice) {
      throw new Error("Virtual Device cannot start Power on only one motor.");
    }
    if (degrees < 0) {
      degrees = -degrees;
      dutyCycle = -dutyCycle;
    }
    return PortOutput.build(
      this.portId,
      PortOutput.SC_FLAGS.EXECUTE_IMMEDIATE,
      Motor.SUB_CMD_START_SPEED_FOR_DEGREES,
      [...int32ToArray(degrees), dutyCycle, maxSpeed, endState, useProfile]
    );
  }

  /**
   * Creates stops message for motor.
   */
  stop() {
    return this.startSpeed(0, 0);
  }

  /**
   * Just starts/stops the motor.
   * Sends message as defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#output-sub-command-startspeed-speed-maxpower-useprofile-0x07
   * FIXME: 0 gives a piezo sound, so I guess that is not totally correct
   *
   * @param {number} dutyCycleL [-100..-1] Percentage CCW, [1..100] Percentage CW, [0] to stop for primary motor
   * @param {number} dutyCycleR [-100..-1] Percentage CCW, [1..100] Percentage CW, [0] to stop for secondary motor
   * @param {number} maxSpeed [0..100]%
   * @param {number} useProfile Bitlist containing profiles to use (Select from `Motor.PROFILE_*`, defaults to `Motor.PROFILE_ACCELERATION | Motor.PROFILE_DEACCELERATION`)
   */
  combinedStartSpeed(
    dutyCycleL,
    dutyCycleR,
    maxSpeed = 100,
    useProfile = Motor.PROFILE_ACCELERATION | Motor.PROFILE_DEACCELERATION
  ) {
    if (!this.isVirtualDevice) {
      throw new Error("Non-virtual Device cannot start Power on two motors.");
    }
    return PortOutput.build(
      this.portId,
      PortOutput.SC_FLAGS.EXECUTE_IMMEDIATE,
      Motor.SUB_CMD_START_SPEED_COMBINED,
      [dutyCycleL, dutyCycleR, maxSpeed, useProfile]
    );
  }

  /**
   * Just starts/stops two motor in synchronized mode.
   * Sends message as defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#output-sub-command-startpower-power
   *
   * TODO: This does not work yet
   *
   * @param {number} dutyCycleL [-100..-1] Percentage CCW, [1..100] Percentage CW, [0] to stop of primary motor
   * @param {number} dutyCycleR [-100..-1] Percentage CCW, [1..100] Percentage CW, [0] to stop of secondary motor
   */
  combinedStartPower(dutyCycleL, dutyCycleR) {
    if (!this.isVirtualDevice) {
      throw new Error("Non-virtual Device cannot start Power on two motors.");
    }
    return PortOutput.buildWriteDirectModeData(
      this.portId,
      PortOutput.SC_FLAGS.EXECUTE_IMMEDIATE |
        PortOutput.SC_FLAGS.COMMAND_FEEDBACK,
      Motor.SUB_CMD_START_POWER_COMBINED,
      [dutyCycleL, dutyCycleR]
    );
  }

  /**
   * Starts two motors for given amount of time.
   * Sends message as defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#output-sub-command-startspeedfortime-time-speed-maxpower-endstate-useprofile-0x0a
   *
   * TODO: Does not work yet
   *
   * @param {number} time [0..2^15] milliseconds
   * @param {number} dutyCycleL [-100..-1] Percentage CCW, [1..100] Percentage CW, [0] to stop
   * @param {number} dutyCycleR [-100..-1] Percentage CCW, [1..100] Percentage CW, [0] to stop
   * @param {number} maxSpeed [0..100]%
   * @param {number} endState One of `Motor.END_STATE_*`
   * @param {number} useProfile Bitlist containing profiles to use (Select from `Motor.PROFILE_*`, defaults to `Motor.PROFILE_ACCELERATION | Motor.PROFILE_DEACCELERATION`)
   */
  combinedStartSpeedForTime(
    time,
    dutyCycleL,
    dutyCycleR,
    maxSpeed = 100,
    endState = Motor.END_STATE_FLOAT,
    useProfile = Motor.PROFILE_ACCELERATION | Motor.PROFILE_DEACCELERATION
  ) {
    if (!this.isVirtualDevice) {
      throw new Error("Non-virtual Device cannot start Power on two motors.");
    }
    return PortOutput.build(
      this.portId,
      PortOutput.SC_FLAGS.EXECUTE_IMMEDIATE,
      Motor.SUB_CMD_START_SPEED_FOR_TIME_COMBINED,
      [
        ...int16ToArray(time),
        dutyCycleL,
        dutyCycleR,
        maxSpeed,
        endState,
        useProfile
      ]
    );
  }

  /**
   * Turns two motors in sync for given number of degrees
   * Sends message as defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#output-sub-command-startspeedfordegrees-degrees-speedl-speedr-maxpower-endstate-useprofile-0x0c
   *
   * @param {number} degrees [0..2^31] milliseconds
   * @param {number} dutyCycleL [-100..-1] Percentage CCW, [1..100] Percentage CW, [0] to stop
   * @param {number} dutyCycleR [-100..-1] Percentage CCW, [1..100] Percentage CW, [0] to stop
   * @param {number} maxSpeed [0..100]%
   * @param {number} endState One of `Motor.END_STATE_*`
   * @param {number} useProfile Bitlist containing profiles to use (Select from `Motor.PROFILE_*`, defaults to `Motor.PROFILE_ACCELERATION | Motor.PROFILE_DEACCELERATION`)
   */
  combinedStartSpeedForDegrees(
    degrees,
    dutyCycleL,
    dutyCycleR,
    maxSpeed = 100,
    endState = Motor.END_STATE_BREAK,
    useProfile = Motor.PROFILE_ACCELERATION | Motor.PROFILE_DEACCELERATION
  ) {
    if (!this.isVirtualDevice) {
      throw new Error("Non-virtual Device cannot start Power on two motors.");
    }
    if (degrees < 0) {
      degrees = -degrees;
      dutyCycleL = -dutyCycleL;
      dutyCycleR = -dutyCycleR;
    }
    return PortOutput.build(
      this.portId,
      PortOutput.SC_FLAGS.EXECUTE_IMMEDIATE,
      Motor.SUB_CMD_START_SPEED_FOR_DEGREES_COMBINED,
      [
        ...int32ToArray(degrees),
        dutyCycleL,
        dutyCycleR,
        maxSpeed,
        endState,
        useProfile
      ]
    );
  }

  /**
   * Creates stops message for motor.
   */
  combinedStop() {
    return this.combinedStartSpeed(0, 0);
  }

  /**
   * Receives and processes message with value from sensor.
   * @param {PortValueSingleMessage} msg
   */
  receiveValue(_msg) {
    this._log("info", `.receiveValue not implemetned`);
  }

  /**
   * Called with feedback from Hub.
   *
   * @param {number} value One of `PortOutputCommandFeedbackMessage.ACTION_*`
   */
  receiveFeedback(value) {
    this._log("debug", "Motor feedback", value);
    if (value === PortOutputCommandFeedbackMessage.ACTION_START) {
      this.status = Motor.RUNNING;
      /**
       * Fires when Motor starts running.
       * @event Motor#start
       */
      this.emit("start");
    } else if (value === PortOutputCommandFeedbackMessage.ACTION_STOP) {
      this.status = Motor.STOPPED;
      /**
       * Fires when Motor finished running.
       * @event Motor#stop
       */
      this.emit("stop");
    }
  }

  /**
   * Creates a message that starts subscribing to updates.
   */
  subscribe() {
    return PortInputFormatSetup.build(this.portId, { mode: this.mode });
  }
}

Motor.SUB_CMD_START_POWER = 0x01;
Motor.SUB_CMD_START_POWER_COMBINED = 0x02;
Motor.SUB_CMD_START_SPEED = 0x07;
Motor.SUB_CMD_START_SPEED_COMBINED = 0x08;
Motor.SUB_CMD_START_SPEED_FOR_TIME = 0x09;
Motor.SUB_CMD_START_SPEED_FOR_TIME_COMBINED = 0x0a;
Motor.SUB_CMD_START_SPEED_FOR_DEGREES = 0x0b;
Motor.SUB_CMD_START_SPEED_FOR_DEGREES_COMBINED = 0x0c;

Motor.END_STATE_FLOAT = 0;
Motor.END_STATE_HOLD = 126;
Motor.END_STATE_BREAK = 127;

Motor.PROFILE_DO_NOT_USE = 0;
Motor.PROFILE_ACCELERATION = 0b01;
Motor.PROFILE_DEACCELERATION = 0b10;

Motor.RUNNING = "running";
Motor.STOPPED = "stopped";

Motor.MODE_MOTOR = 2;

module.exports = Motor;
