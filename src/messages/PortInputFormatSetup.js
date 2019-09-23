const PortInputFormat = require("./PortInputFormat");

/**
 * Downstream message to setup receiving single value sensor updates
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#port-input-format-setup-single
 */
class PortInputFormatSetup extends PortInputFormat {}

/**
 * Instanties a proper PortInputFormatSetup to send to Hub
 *
 * @param {number} portId
 */
PortInputFormatSetup.build = function build(portId, options = {}) {
  const mode = options.mode || 0x00;
  const deltaInterval = options.deltaInterval || 0x01; // TODO: Fiure out: delta of what exactly?
  const notificationEnabled = options.notificationEnabled || 0x01;
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

module.exports = PortInputFormatSetup;
