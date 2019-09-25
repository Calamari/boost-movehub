const DeviceMessage = require("./DeviceMessage");
const { toHexString } = require("../helpers");

/**
 * Upstream message as answer to PortInputFormatSetup message
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#port-input-format-single
 */
class PortInputFormat extends DeviceMessage {
  get portId() {
    return this.data[3];
  }

  get mode() {
    return this.data[4];
  }

  // FIXME: Not quite sure if that is in deed 5 or more like 5-8 (Uint32)
  get deltaInterval() {
    return this.data[5];
  }

  get notificationEnabled() {
    return this.data[9];
  }

  toString() {
    const portId = toHexString(this.portId);
    const mode = toHexString(this.mode);
    const delta = toHexString(this.deltaInterval);
    const updates = this.notificationEnabled ? "true" : "false";

    return `PortInfoFormat(port=${portId}, mode=${mode}, delta=${delta}, updates=${updates})`;
  }
}

/**
 * Instanties a proper PortInputFormat to send to Hub
 *
 * @param {number} actionType
 */
PortInputFormat.build = function build(portId) {
  const mode = 0x00;
  const deltaInterval = 0x01; // TODO: Fiure out: delta of what exactly?
  const notificationEnabled = 0x01;
  return new HubAction(
    Buffer.from([
      0x0a,
      0x00,
      PortInputFormat.TYPE,
      portId,
      mode,
      deltaInterval,
      0x00,
      0x00,
      0x00,
      notificationEnabled
    ])
  );
};

PortInputFormat.TYPE = 0x47;

module.exports = PortInputFormat;
