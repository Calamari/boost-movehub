const Peripheral = require("./Peripheral");
const PortOutput = require("../messages/PortOutput");

const INDEX_MODE = 0x00;
const RGB_MODE = 0x01;

class RgbLed extends Peripheral {
  constructor(ioType, portId, options = undefined) {
    super(ioType, portId, options);
    this.displayName = "RgbLed";
    this.lastValue = null;
    this.mode = RgbLed.MODE_2AXIS_ANGLE;
  }

  /**
   * Creates a message that sets color to specific color by it’s number.
   * Sends message as defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#output-sub-command-setrgbcolorno-redcolor-greencolor-bluecolor-n-a
   * TODO: Make flags configurable via options
   *
   * @param {number} color One of `RgbLed.COLOR_*`
   */
  setColor(color) {
    return PortOutput.buildWriteDirectModeData(
      this.portId,
      PortOutput.SC_FLAGS.EXECUTE_IMMEDIATE,
      [INDEX_MODE, color]
    );
  }

  /**
   * Creates a message that sets LED to a specified RGB value
   * Sends message as defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#output-sub-command-setrgbcolorno-colorno-n-a
   * TODO: Make flags configurable via options
   *
   * FIXME: This does not work yet
   *
   * @param {number} red Red part of RGB value 0…255
   * @param {number} green Green part of RGB value 0…255
   * @param {number} blue Blue part of RGB value 0…255
   */
  setRGBColor(red, green, blue) {
    return PortOutput.buildWriteDirectModeData(
      this.portId,
      PortOutput.SC_FLAGS.EXECUTE_IMMEDIATE,
      [0, 0x51, RGB_MODE, red, green, blue]
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

RgbLed.COLOR_OFF = 0x00;
RgbLed.COLOR_PINK = 0x01;
RgbLed.COLOR_PURPLE = 0x02;
RgbLed.COLOR_BLUE = 0x03;
RgbLed.COLOR_LIGHTBLUE = 0x04;
RgbLed.COLOR_CYAN = 0x05;
RgbLed.COLOR_GREEN = 0x06;
RgbLed.COLOR_YELLOW = 0x07;
RgbLed.COLOR_ORANGE = 0x09;
RgbLed.COLOR_RED = 0x09;
RgbLed.COLOR_WHITE = 0x0a;

module.exports = RgbLed;
