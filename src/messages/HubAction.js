const DeviceMessage = require("./DeviceMessage");

/**
 * Up- & Downstream messages for control actions on connected Hub.
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#hub-actions
 */
class HubAction extends DeviceMessage {
  toString() {
    return `HubAction ${this._typeToString()}`;
  }

  _typeToString() {
    switch (this.type) {
      case HubAction.SWITCH_OFF_HUB:
        return "Switch off";
      case HubAction.DISCONNECT:
        return "Disconnect";
      case HubAction.VCC_PORT_CONTROL_ON:
        return "VCC port control on";
      case HubAction.VCC_PORT_CONTROL_OFF:
        return "VCC port control off";
      case HubAction.BUSY_INDICATOR_ON:
        return "Busy Indicator On";
      case HubAction.BUSY_INDICATOR_OFF:
        return "Busy Indicator off";
      case HubAction.IMMEDIATE_SHUTDOWN:
        return "Shutting down immediate";
      case HubAction.HUB_WILL_SWITCH_OFF:
        return "Hub will switch off";
      case HubAction.HUB_WILL_DISCONNECT:
        return "Hub will disconnect";
      case HubAction.HUB_WILL_GO_INTO_BOOT_MODE:
        return "Hub will go into Boot Mode";
      default:
        return "Unknown Action";
    }
  }
}

/**
 * Instanties a proper HubAction to send to Hub
 *
 * @param {number} actionType
 */
HubAction.build = function build(actionType) {
  return new HubAction(Buffer.from([0x04, 0x00, HubAction.TYPE, actionType]));
};

HubAction.TYPE = 0x02;

HubAction.SWITCH_OFF_HUB = 0x01;
HubAction.DISCONNECT = 0x02;
HubAction.VCC_PORT_CONTROL_ON = 0x03;
HubAction.VCC_PORT_CONTROL_OFF = 0x04;
HubAction.BUSY_INDICATOR_ON = 0x05;
HubAction.BUSY_INDICATOR_OFF = 0x06;
HubAction.IMMEDIATE_SHUTDOWN = 0x2f;

// Upstream only
HubAction.HUB_WILL_SWITCH_OFF = 0x30;
HubAction.HUB_WILL_DISCONNECT = 0x31;
HubAction.HUB_WILL_GO_INTO_BOOT_MODE = 0x32;

module.exports = HubAction;
