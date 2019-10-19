const DeviceMessage = require("./DeviceMessage");

/**
 * HubAlert Messages from MoveHub.
 *
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#hub-alerts
 *
 * TODO: Test receiving them
 */
class HubAlert extends DeviceMessage {
  get alertType() {
    return this.data[3];
  }

  /**
   * Returns string representation of alert type.
   */
  get alertTypeToString() {
    switch (this.alertType) {
      case HubAlert.LOW_VOLTAGE:
        return "lowVoltage";
      case HubAlert.HIGH_CURRANT:
        return "highCurrant";
      case HubAlert.LOW_SIGNAL_STRENGTH:
        return "lowSignal";
      case HubAlert.OVER_POWER_CONDITION:
        return "overPower";
    }
  }
}

/**
 * Instantiates a proper HubAlert message to send to Hub
 *
 * @param {number} alertType
 * @param {number} alertOp One of `HubAlert.OP_*`
 */
HubAlert.build = function build(alertType, alertOp) {
  return new HubAlert(
    Buffer.from([0x05, 0x00, HubAlert.TYPE, alertType, alertOp])
  );
};

HubAlert.TYPE = 0x03;

HubAlert.LOW_VOLTAGE = 0x01;
HubAlert.HIGH_CURRANT = 0x02;
HubAlert.LOW_SIGNAL_STRENGTH = 0x03;
HubAlert.OVER_POWER_CONDITION = 0x04;

HubAlert.OP_ENABLE_UPDATES = 0x01;
HubAlert.OP_DISABLE_UPDATES = 0x02;
HubAlert.OP_REQUEST_UPDATES = 0x03;
HubAlert.OP_UPDATE = 0x04;

module.exports = HubAlert;
