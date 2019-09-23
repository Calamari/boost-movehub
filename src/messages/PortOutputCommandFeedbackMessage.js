const DeviceMessage = require('./DeviceMessage')

/**
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#port-value-single
 */
class PortOutputCommandFeedbackMessage extends DeviceMessage {
}

PortOutputCommandFeedbackMessage.TYPE = 0x82

module.exports = PortOutputCommandFeedbackMessage
