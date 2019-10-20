const DeviceMessage = require("./DeviceMessage");

/**
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#hub-attached-i-o.
 *
 * Example data: <Buffer 0f 00 04 00 01 27 00 00 00 00 10 00 00 00 10>
 */
class HubAttachedMessage extends DeviceMessage {
  /**
   * ID of port as defined in Port
   */
  get portId() {
    return this.data[3];
  }

  /**
   * One of `HubAttachedMessage.EVENT_TYPE_*`
   */
  get eventType() {
    return this.data[4];
  }

  get ioType() {
    return this.data[5];
  }

  /**
   * This only applies to eventType === EVENT_TYPE_ATTACHED_VIRTUAL_IO
   */
  get ioMembers() {
    if (this.eventType !== HubAttachedMessage.EVENT_TYPE_ATTACHED_VIRTUAL_IO) {
      return [];
    }
    return [this.data[7], this.data[8]];
  }
}

HubAttachedMessage.TYPE = 0x04;

HubAttachedMessage.EVENT_TYPE_DETACHED_IO = 0x00;
HubAttachedMessage.EVENT_TYPE_ATTACHED_IO = 0x01;
HubAttachedMessage.EVENT_TYPE_ATTACHED_VIRTUAL_IO = 0x02;

module.exports = HubAttachedMessage;
