const DeviceMessage = require("./DeviceMessage");

function printableAction(action) {
  switch (action) {
    case PortOutputCommandFeedbackMessage.ACTION_START:
      return "started";
    case PortOutputCommandFeedbackMessage.ACTION_CONFLICT:
      return "conflict";
    case PortOutputCommandFeedbackMessage.ACTION_STOP:
      return "stopped";
    default:
      return "unknown";
  }
}

/**
 * Message that holds values for multiple ports.
 *
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#port-value-single
 */
class PortOutputCommandFeedbackMessage extends DeviceMessage {
  get payload() {
    const payload = Array.from(this.data).slice(
      DeviceMessage.DEFAULT_HEADER_SIZE
    );
    return payload.reduce((memo, key, index) => {
      if (index % 2 === 0) {
        memo[key] = payload[index + 1];
      }
      return memo;
    }, {});
  }

  get valuesForPorts() {
    return this.payload;
  }

  toString() {
    const payload = this.payload;
    const printablePayload = Object.keys(payload)
      .map(portId => `${portId} => ${printableAction(payload[portId])}`)
      .join(", ");
    return `PortOutputCommandFeedback(payload=(${printablePayload}))`;
  }
}

PortOutputCommandFeedbackMessage.TYPE = 0x82;

PortOutputCommandFeedbackMessage.ACTION_START = 0x01;
PortOutputCommandFeedbackMessage.ACTION_CONFLICT = 0x05;
PortOutputCommandFeedbackMessage.ACTION_STOP = 0x0a;

module.exports = PortOutputCommandFeedbackMessage;
