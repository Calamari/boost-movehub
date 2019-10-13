const Peripheral = require("./Peripheral");
const { toHexString } = require("../helpers");

class VisionSensor extends Peripheral {
  constructor(ioType, portId, options = undefined) {
    super(ioType, portId, options);
    this.displayName = "VisionSensor";
    this.emitAs = "vision";
    this.defaultMode = VisionSensor.MODE_COLOR_DISTANCE_FLOAT;
  }

  /**
   * Receives and processes message with value from sensor.
   *
   * @param {PortValueSingleMessage} msg
   */
  receiveValue(msg) {
    const value = { ...(this.lastValue || {}) };
    switch (this.mode) {
      case VisionSensor.MODE_DISTANCE: {
        this.setValue({
          ...value,
          distance: msg.value
        });

        break;
      }
      case VisionSensor.MODE_DISTANCE_REFLECTED: {
        // Is this the time the light bounces back? 25 seems to be very near
        this.setValue({
          ...value,
          distance: msg.value
        });
        break;
      }
      case VisionSensor.MODE_COLOR_RGB: {
        const red = msg.data.readInt16LE(msg.payloadIndex + 0);
        const green = msg.data.readInt16LE(msg.payloadIndex + 2);
        const blue = msg.data.readInt16LE(msg.payloadIndex + 4);
        this.setValue({
          rgb: [red, green, blue]
        });
        break;
      }
      case VisionSensor.MODE_COLOR_DISTANCE_FLOAT: {
        const color = msg.payload[0];
        let distance = msg.payload[1];
        const partial = msg.payload[3];
        if (partial) {
          distance += 1.0 / partial;
        }

        this.setValue({
          color,
          distance
        });
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

  setValue(value) {
    this.lastValue = value;
    this.emit("value", value);
    if (value.distance) {
      this.emit("distance", value.distance);
    }
    if (value.color) {
      this.emit("color", value.color);
    }
    if (value.rgb) {
      this.emit("color", value.rgb);
    }
  }
}

// Inspired by https://github.com/undera/pylgbst/blob/master/pylgbst/peripherals.py#L528
VisionSensor.MODE_DISTANCE = 0x01;
VisionSensor.MODE_DISTANCE_REFLECTED = 0x03;
VisionSensor.MODE_COLOR_RGB = 0x06;
VisionSensor.MODE_COLOR_DISTANCE_FLOAT = 0x08;

module.exports = VisionSensor;
