const DeviceMessage = require("./DeviceMessage");

/**
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#hub-actions
 */
class HubAction extends DeviceMessage {}

/**
 * Instanties a proper HubAction to send to Hub
 *
 * @param {number} actionType
 */
HubAction.build = function build(actionType) {
  return new HubAction(Buffer.from([0x04, 0x00, HubAction.Type, actionType]));
};

HubAction.Type = 0x02;

HubAction.SWITCH_OFF_HUB = 0x01;
HubAction.DISCONNECT = 0x02;
HubAction.VCC_PORT_CONTROL_ON = 0x03;
HubAction.VCC_PORT_CONTROL_OFF = 0x04;
HubAction.BUSY_INDICATOR_ON = 0x05;
HubAction.BUSY_INDICATOR_OFF = 0x06;
HubAction.IMMEDIATE_SHUTDOWN = 0x2f;

module.exports = HubAction;
