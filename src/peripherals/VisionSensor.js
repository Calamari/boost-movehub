const Peripheral = require("./Peripheral");
const PortInputFormatSetup = require("../messages/PortInputFormatSetup");
const { toHexString } = require("../helpers");

class VisionSensor extends Peripheral {
  constructor(ioType, portId, options = undefined) {
    super(ioType, portId, options);
    this.displayName = "VisionSensor";
    this.emitAs = "vision";
    this.lastValue = {};
  }

  /**
   * Creates a message that starts subscribing to updates.
   */
  subscribe(mode = VisionSensor.MODE_COLOR_DISTANCE_FLOAT) {
    this.mode = mode;
    return PortInputFormatSetup.build(this.portId, { mode: this.mode });
  }

  /**
   * Receives and processes message with value from sensor.
   *
   * @param {PortValueSingleMessage} msg
   */
  receiveValue(msg) {
    switch (this.mode) {
      case VisionSensor.DISTANCE: {
        this.lastValue.distance = msg.value;

        break;
      }
      case VisionSensor.DISTANCE_REFLECTED: {
        // Is this the time the light bounces back? 25 seems to be very near
        this.lastValue.distance = msg.value;
        break;
      }
      case VisionSensor.MODE_COLOR_RGB: {
        const red = msg.data.readInt16LE(msg.payloadIndex + 0);
        const green = msg.data.readInt16LE(msg.payloadIndex + 2);
        const blue = msg.data.readInt16LE(msg.payloadIndex + 4);
        this.lastValue = {
          rgb: [red, green, blue]
        };
        break;
      }
      case VisionSensor.MODE_COLOR_DISTANCE_FLOAT: {
        const color = msg.payload[0];
        let distance = msg.payload[1];
        const partial = msg.payload[3];
        if (partial) {
          distance += 1.0 / partial;
        }

        this.lastValue = {
          color,
          distance
        };
        break;
      }
      default:
        this._log(
          "warn",
          `Received message while being in an unexpected mode=${toHexString(
            this.mode
          )}`
        );
    }
  }
}

// Inspired by https://github.com/undera/pylgbst/blob/master/pylgbst/peripherals.py#L528
VisionSensor.DISTANCE = 0x01;
VisionSensor.DISTANCE_REFLECTED = 0x03;
VisionSensor.MODE_COLOR_RGB = 0x06;
VisionSensor.MODE_COLOR_DISTANCE_FLOAT = 0x08;

module.exports = VisionSensor;
