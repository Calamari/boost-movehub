const DeviceMessage = require('./DeviceMessage')

/**
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#generic-error-messages
 */
class GenericError extends DeviceMessage {
  constructor(data) {
    this.data = data
  }

  toString() {
    return 'TODO: what part of data is the error?'
  }
}

GenericError.TYPE = 0x35

GenericError.DEFINITION = {
  0x01:	'ACK',
  0x02:	'MACK',
  0x03:	'Buffer Overflow',
  0x04:	'Timeout',
  0x05:	'Command NOT recognized',
  0x06:	'Invalid use (e.g. parameter error(s)',
  0x07:	'Overcurrent',
  0x08:	'Internal ERROR'
}

module.exports = GenericError