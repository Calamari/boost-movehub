const HubAttachedMessage = require('./messages/HubAttachedMessage')
const GenericError = require('./messages/GenericError')
const PortOutputCommandFeedbackMessage = require('./messages/PortOutputCommandFeedbackMessage')
const PortValueSingleMessage = require('./messages/PortValueSingleMessage')
const UnknownMessage = require('./messages/UnknownMessage')

module.exports = {
  mapping: {
    [HubAttachedMessage.TYPE]: HubAttachedMessage,
    [GenericError.TYPE]: GenericError,
    [PortOutputCommandFeedbackMessage.TYPE]: PortOutputCommandFeedbackMessage,
    [PortValueSingleMessage.TYPE]: PortValueSingleMessage,
  },

  /**
   * Creates an instance of a DeviceMessage implementation
   * 
   * @param {Buffer} data
   * @returns {DeviceMessage | null} Returns an instance of DeviceMessage subclass, or null if message type is unknown to us
   */
  create(data) {
    const type = this.getType(data)
    if (this.mapping[type]) {
      const MessageClass = this.mapping[type]
      return new MessageClass(data) 
    }
    return new UnknownMessage(data)
  },

  getType(data) {
    return data[2]
  }
}
