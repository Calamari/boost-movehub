const Peripheral = require("./Peripheral");
const { toHexString } = require("../helpers");

/**
 * This handles the communication and the values we receive from the
 * external vision sensor of the Movehub. That one that measures the
 * distance and the color it sees.
 */
class VisionSensor extends Peripheral {
  /**
   * @param {Number} ioType Peripheral Device Type ID (Should be `Peripheral.DEV_VISON_SENSORT`)
   * @param {Number} portId Port ID this peripheral is connected to
   * @param {object} [options.ioMembers] If this has severeal members, it is a virtual device
   * @param {object} [options.logger]
   */
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

  /**
   * Sets the value received by the Hub.
   *
   * @param {number} value
   */
  setValue(value) {
    this.lastValue = value;
    /**
     * Fires when a new value is set on a Peripheral.
     * @event Peripheral#value
     * @param {number} value
     */
    this.emit("value", value);
    if (value.distance) {
      /**
       * Fires when a `VisionSensor` receives a new distance value.
       * @event VisionSensor#distance
       * @param {number} distance
       */
      this.emit("distance", value.distance);
    }
    if (value.color) {
      /**
       * Fires when a `VisionSensor` receives a new color value.
       * @event VisionSensor#color
       * @param {number} color The index value of the perceived color (One of `RgbLed.COLOR_*`).
       */
      this.emit("color", value.color);
    }
    if (value.rgb) {
      /**
       * Fires when a `VisionSensor` receives a new color value.
       * @event VisionSensor#color
       * @param {number[]} color Red, green and blue values of the perceived color.
       */
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
