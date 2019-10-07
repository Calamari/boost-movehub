const PortInputFormat = require("./PortInputFormat");

/**
 * Downstream message to setup receiving single value sensor updates
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#port-input-format-setup-single
 */
class PortInputFormatSetup extends PortInputFormat {
  constructor(...args) {
    super(...args);
    this.displayName = "PortInputFormatSetup";
  }
}

/**
 * Instantiates a proper PortInputFormatSetup to send to Hub
 *
 * @param {number} portId Port ID to subscribe updates for
 * @param {number} [options.mode]
 * @param {number} [options.deltaInterval] Interval of messages (in what exactly? ms?)
 * @param {number} [options.notificationEnabled] Defines if messages should be send back on a regular base.
 */
PortInputFormatSetup.build = function build(portId, options = {}) {
  const mode = options.mode || 0x00;
  const deltaInterval = options.deltaInterval || 0x01; // TODO: Figure out: delta of what exactly?
  const notificationEnabled =
    options.notificationEnabled !== undefined
      ? options.notificationEnabled
      : PortInputFormatSetup.ENABLE_NOTIFICATONS;
  return new PortInputFormatSetup(
    Buffer.from([
      0x0a,
      0x00,
      PortInputFormatSetup.TYPE,
      portId,
      mode,
      deltaInterval,
      0x00,
      0x00,
      0x00,
      notificationEnabled
    ])
  );
};

PortInputFormatSetup.TYPE = 0x41;

PortInputFormatSetup.DISABLE_NOTIFICATONS = 0x00;
PortInputFormatSetup.ENABLE_NOTIFICATONS = 0x01;

module.exports = PortInputFormatSetup;
