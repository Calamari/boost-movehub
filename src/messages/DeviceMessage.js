/**
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#message-types
 */
module.exports = class DeviceMessage {
  constructor(data) {
    this.data = data
  }

  get type() {
    return this.data[2]
  }
}
