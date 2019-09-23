const DeviceMessage = require("./DeviceMessage");

/**
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#port-value-single
 *
 * example:  <Buffer 06 00 45 3a 00 a6>
 */
class PortValueSingleMessage extends DeviceMessage {
  get portId() {
    return this.data[3];
  }

  get value() {
    switch (this.length) {
      case 5:
        return this.data[4];
      case 6:
        return this.data.readInt16BE(4);
      case 8:
        return this.data.readInt32BE(4);
    }
  }

  toString() {
    const port = this.portId.toString(16);
    return `PortValueSingleMessage(port=${port}, value=${this.value})`;
  }
}

PortValueSingleMessage.TYPE = 0x45;

module.exports = PortValueSingleMessage;
