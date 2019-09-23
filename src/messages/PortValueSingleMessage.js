const DeviceMessage = require('./DeviceMessage')

/**
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#port-value-single
 */
class PortValueSingleMessage extends DeviceMessage {
}

PortValueSingleMessage.TYPE = 0x45

module.exports = PortValueSingleMessage
