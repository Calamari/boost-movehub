const { toHexString } = require("../helpers");

/**
 * Base class for all Messages being send to or received from the MoveHub.
 *
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#message-types
 */
class DeviceMessage {
  /**
   * @param {Buffer} data Received Buffer data.
   */
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
