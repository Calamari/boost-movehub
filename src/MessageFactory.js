const HubAction = require("./messages/HubAction");
const HubAlert = require("./messages/HubAlert");
const HubAttached = require("./messages/HubAttached");
const GenericError = require("./messages/GenericError");
const PortOutputCommandFeedback = require("./messages/PortOutputCommandFeedback");
const PortValueSingle = require("./messages/PortValueSingle");
const UnknownMessage = require("./messages/UnknownMessage");
const PortInputFormat = require("./messages/PortInputFormat");

/**
 * @class MessageFactory
 */
module.exports = {
  mapping: {
    [HubAction.TYPE]: HubAction,
    [HubAlert.TYPE]: HubAlert,
    [HubAttached.TYPE]: HubAttached,
    [GenericError.TYPE]: GenericError,
    [PortOutputCommandFeedback.TYPE]: PortOutputCommandFeedback,
    [PortValueSingle.TYPE]: PortValueSingle,
    [PortInputFormat.TYPE]: PortInputFormat
  },

  /**
   * Creates an instance of a DeviceMessage.
   *
   * @param {Buffer} data
   * @returns {DeviceMessage | UnknownMessage} Returns an instance of DeviceMessage subclass, or null if message type is unknown to us
   */
  create(data) {
    const type = this.getType(data);
    if (this.mapping[type]) {
      const MessageClass = this.mapping[type];
      return new MessageClass(data);
    }
    return new UnknownMessage(data);
  },

  getType(data) {
    return data[2];
  }
};

/*
For testing:
[Hub] Parse data: <Buffer 0f 00 04 00 01 27 00 00 00 00 10 00 00 00 10>
[Hub] Parse data: <Buffer 0f 00 04 01 01 27 00 00 00 00 10 00 00 00 10>
[Hub] Parse data: <Buffer 0f 00 04 02 01 25 00 00 00 00 10 00 00 00 10>
[Hub] Parse data: <Buffer 0f 00 04 03 01 26 00 00 00 00 10 00 00 00 10>
[Hub] Parse data: <Buffer 09 00 04 10 02 27 00 00 01>
[Hub] Parse data: <Buffer 0f 00 04 32 01 17 00 00 00 00 01 06 00 00 20>
[Hub] Parse data: <Buffer 0f 00 04 3a 01 28 00 00 00 00 10 00 00 01 02>
[Hub] Parse data: <Buffer 0f 00 04 3b 01 15 00 02 00 00 00 00 00 01 00>
[Hub] Parse data: <Buffer 0f 00 04 3c 01 14 00 02 00 00 00 00 00 01 00>
[Hub] Parse data: <Buffer 0f 00 04 46 01 42 00 01 00 00 00 00 00 00 10>
*/
