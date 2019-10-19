const Peripheral = require("./Peripheral");
const { toHexString } = require("../helpers");

/**
 * This handles the communication with the internal tilt sensor of Movehub.
 * There seem to be different modes implemented in the device. We just made
 * the one available that simply gets us the `roll` and `pitch` values.
 */
class TiltSensor extends Peripheral {
  /**
   * @param {Number} ioType Peripheral Device Type ID (Should be `Peripheral.DEV_TILT_SENSOR`)
   * @param {Number} portId Port ID this peripheral is connected to
   * @param {object} [options.ioMembers] If this has severeal members, it is a virtual device
   * @param {object} [options.logger]
   */
  constructor(ioType, portId, options = undefined) {
    super(ioType, portId, options);
    this.displayName = "TiltSensor";
    this.emitAs = "tilt";
    this.defaultMode = TiltSensor.MODE_2AXIS_ANGLE;
  }

  /**
   * Receives nd processes message with value from sensor.
   *
   * @param {PortValueSingleMessage} msg
   */
  receiveValue(msg) {
    switch (this.mode) {
      case TiltSensor.MODE_2AXIS_ANGLE: {
        const roll = msg.payload[0];
        const pitch = msg.payload[1];
        this.setValue({
          roll,
          pitch
        });
        break;
      }
      case TiltSensor.MODE_2AXIS_SIMPLE: {
        this._log("warn", "TiltSensor.MODE_2AXIS_SIMPLE is TODO");
        break;
      }
      case TiltSensor.MODE_3AXIS_SIMPLE: {
        this._log("warn", "TiltSensor.MODE_3AXIS_SIMPLE is TODO");
        break;
      }
      case TiltSensor.MODE_IMPACT_COUNT: {
        this._log("warn", "TiltSensor.MODE_IMPACT_COUNT is TODO");
        break;
      }
      case TiltSensor.MODE_3AXIS_ACCEL: {
        this._log("warn", "TiltSensor.MODE_3AXIS_ACCEL is TODO");
        break;
      }
      case TiltSensor.MODE_ORIENT_CF: {
        this._log("warn", "TiltSensor.MODE_ORIENT_CF is TODO");
        break;
      }
      case TiltSensor.MODE_IMPACT_CF: {
        this._log("warn", "TiltSensor.MODE_IMPACT_CF is TODO");
        break;
      }
      case TiltSensor.MODE_CALIBRATION: {
        this._log("warn", "TiltSensor.MODE_CALIBRATION is TODO");
        break;
      }
      default:
        this._log(
          "warn",
          `Received message while being in an unexpected mode=${toHexString(
            this.mode
          )}`
        );
      // TODO: add real logger and log a warning here of unexpected mode
    }
  }
}

// Greatly inspired by https://github.com/undera/pylgbst/blob/master/pylgbst/peripherals.py
TiltSensor.MODE_2AXIS_ANGLE = 0x00;
TiltSensor.MODE_2AXIS_SIMPLE = 0x01;
TiltSensor.MODE_3AXIS_SIMPLE = 0x02;
TiltSensor.MODE_IMPACT_COUNT = 0x03;
TiltSensor.MODE_3AXIS_ACCEL = 0x04;
TiltSensor.MODE_ORIENT_CF = 0x05;
TiltSensor.MODE_IMPACT_CF = 0x06;
TiltSensor.MODE_CALIBRATION = 0x07;

module.exports = TiltSensor;
