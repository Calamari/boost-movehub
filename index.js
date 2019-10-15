const Boost = require("./src/Boost");

Boost.Hub = require("./src/Hub");
Boost.R2D2 = require("./interfaces/R2D2");

const RgbLed = require("./peripherals/RgbLed");

Boost.colors = {
  COLOR_OFF: RgbLed.COLOR_OFF,
  COLOR_PINK: RgbLed.COLOR_PINK,
  COLOR_PURPLE: RgbLed.COLOR_PURPLE,
  COLOR_BLUE: RgbLed.COLOR_BLUE,
  COLOR_LIGHTBLUE: RgbLed.COLOR_LIGHTBLUE,
  COLOR_CYAN: RgbLed.COLOR_CYAN,
  COLOR_GREEN: RgbLed.COLOR_GREEN,
  COLOR_YELLOW: RgbLed.COLOR_YELLOW,
  COLOR_ORANGE: RgbLed.COLOR_ORANGE,
  COLOR_RED: RgbLed.COLOR_RED,
  COLOR_WHITE: RgbLed.COLOR_WHITE
};

module.exports = Boost;
