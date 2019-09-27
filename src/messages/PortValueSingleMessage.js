const DeviceMessage = require("./DeviceMessage");
const { toHexString } = require("../helpers");

/**
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#port-value-single
 *
 * example:  <Buffer 06 00 45 3a 00 a6>
 */
class PortValueSingleMessage extends DeviceMessage {
  get portId() {
    return this.data[3];
  }

  get payload() {
    switch (this.length) {
      case 5:
        return [this.data[4]];
      case 6:
        return [this.data[4], this.data[5]];
      case 8:
        return [this.data[4], this.data[5], this.data[6], this.data[7]];
    }
  }

  get value() {
    switch (this.length) {
      case 5:
        return this.data[4];
      case 6:
        return this.data.readInt16LE(4);
      case 8:
        return this.data.readInt32LE(4);
    }
  }

  toString() {
    const port = toHexString(this.portId);
    return `PortValueSingleMessage(port=${port}, value=${this.value})`;
  }
}

PortValueSingleMessage.TYPE = 0x45;

module.exports = PortValueSingleMessage;
