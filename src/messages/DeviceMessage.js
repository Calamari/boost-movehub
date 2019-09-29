const { toHexString } = require("../helpers");

/**
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#message-types
 */
class DeviceMessage {
  constructor(data) {
    this.data = data;
  }

  /**
   * From https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#common-message-header
   */
  get length() {
    return this.data[0];
  }

  get type() {
    return this.data[2];
  }

  toString() {
    return `type ${toHexString(this.type)}`;
  }
}

DeviceMessage.DEFAULT_HEADER_SIZE = 3;

module.exports = DeviceMessage;
