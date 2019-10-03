const Peripheral = require("./Peripheral");
const PortInputFormatSetup = require("../messages/PortInputFormatSetup");
const { toHexString } = require("../helpers");

class TiltSensor extends Peripheral {
  constructor(ioType, portId, options = undefined) {
    super(ioType, portId, options);
    this.displayName = "TiltSensor";
    this.emitAs = "tilt";
    this.lastValue = null;
    this.mode = TiltSensor.MODE_2AXIS_ANGLE;
  }

  /**
   * Creates a message that starts subscribing to updates.
   */
  subscribe() {
    return PortInputFormatSetup.build(this.portId, { mode: this.mode });
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
        this.lastValue = {
          roll,
          pitch
        };
        break;
      }
      case TiltSensor.MODE_2AXIS_SIMPLE: {
        console.log("TiltSensor.MODE_2AXIS_SIMPLE is TODO");
        break;
      }
      case TiltSensor.MODE_3AXIS_SIMPLE: {
        console.log("TiltSensor.MODE_3AXIS_SIMPLE is TODO");
        break;
      }
      case TiltSensor.MODE_IMPACT_COUNT: {
        console.log("TiltSensor.MODE_IMPACT_COUNT is TODO");
        break;
      }
      case TiltSensor.MODE_3AXIS_ACCEL: {
        console.log("TiltSensor.MODE_3AXIS_ACCEL is TODO");
        break;
      }
      case TiltSensor.MODE_ORIENT_CF: {
        console.log("TiltSensor.MODE_ORIENT_CF is TODO");
        break;
      }
      case TiltSensor.MODE_IMPACT_CF: {
        console.log("TiltSensor.MODE_IMPACT_CF is TODO");
        break;
      }
      case TiltSensor.MODE_CALIBRATION: {
        console.log("TiltSensor.MODE_CALIBRATION is TODO");
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
