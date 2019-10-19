const DeviceMessage = require("./DeviceMessage");
const { toHexString } = require("../helpers");

/**
 * Upstream message as answer to `PortInputFormatSetup` message.
 *
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#port-input-format-single
 */
class PortInputFormat extends DeviceMessage {
  constructor(...args) {
    super(...args);
    this.displayName = "PortInputFormat";
  }

  get portId() {
    return this.data[3];
  }

  get mode() {
    return this.data[4];
  }

  get deltaInterval() {
    return this.data.readInt32LE(5);
  }

  get notificationEnabled() {
    return this.data[9];
  }

  toString() {
    const portId = toHexString(this.portId);
    const mode = toHexString(this.mode);
    const delta = toHexString(this.deltaInterval);
    const updates = this.notificationEnabled ? "true" : "false";

    return `${this.displayName}(port=${portId}, mode=${mode}, delta=${delta}, updates=${updates})`;
  }
}

PortInputFormat.TYPE = 0x47;

module.exports = PortInputFormat;
