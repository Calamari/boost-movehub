/**
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#message-types
 */
module.exports = class DeviceMessage {
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
};
