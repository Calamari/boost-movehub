const Peripheral = require("./Peripheral");

class TiltSensor extends Peripheral {
  constructor(ioType) {
    super(ioType);
    this.lastValue = null;
  }

  subscribe(callback) {}
}

module.exports = TiltSensor;
