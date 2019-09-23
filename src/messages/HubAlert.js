const DeviceMessage = require("./DeviceMessage");

/**
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#hub-alerts
 */
class HubAlerts extends DeviceMessage {}

/**
 * Instantiates a proper HubAlerts message to send to Hub
 *
 * @param {number} alertType
 */
HubAlerts.build = function build(alertType, alertOp) {
  return new HubAlerts(
    Buffer.from([0x05, 0x00, HubAlerts.TYPE, alertType, alertOp])
  );
};

HubAlerts.TYPE = 0x03;

HubAlerts.TYPE_VOLTAGE = 0x01;
HubAlerts.HIGH_CURRANT = 0x02;
HubAlerts.LOG_SIGNAL_STRGENTH = 0x03;
HubAlerts.OVER_POWER_CONDITION = 0x04;

HubAlerts.OP_ENABLE_UPDATES = 0x01;
HubAlerts.OP_DISABLE_UPDATES = 0x02;
HubAlerts.OP_REQUEST_UPDATES = 0x03;
HubAlerts.OP_UPDATE = 0x04;

module.exports = HubAlerts;
