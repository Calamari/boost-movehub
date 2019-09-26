const DeviceMessage = require("./DeviceMessage");

/**
 * Downstream message to make peripherals do something.
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#port-output-command
 */
class PortOutput extends DeviceMessage {}

/**
 * Instantiates a proper PortOutput to send to Hub encoded with writeDirectModeData
 *
 * @param {number} portId
 * @param {number[] | number} startupCompletionFlags Bitlist containing flags as defined in Startup and Completion Information or array of flags to set (Available flags: `PortOutput.SC_FLAGS`)
 * @param {number[]} payload Bytes of data to send
 */
PortOutput.buildWriteDirectModeData = function buildWriteDirectModeData(
  portId,
  startupCompletionFlags,
  payload
) {
  if (typeof startupCompletionFlags !== "number") {
    console.log(typeof startupCompletionFlags);
    startupCompletionFlags = startupCompletionFlags.reduce(
      (memo, flag) => memo | flag,
      0
    );
  }
  const length = 6 + payload.length;
  return new PortOutput(
    Buffer.from([
      length,
      0x00,
      PortOutput.TYPE,
      portId,
      startupCompletionFlags,
      PortOutput.SUB_CMD_WRITE_DIRECT_MODE_DATA,
      ...payload
    ])
  );
};

/**
 * Instantiates a proper PortOutput to send to Hub
 *
 * @param {number} portId
 * @param {number[]} payload Bytes of data to send
 */
PortOutput.build = function build(portId, payload) {
  const length = 4 + payload.length;
  return new PortOutput(
    Buffer.from([length, 0x00, PortOutput.TYPE, portId, ...payload])
  );
};

PortOutput.TYPE = 0x81;

PortOutput.SUB_CMD_WRITE_DIRECT = 0x50;
PortOutput.SUB_CMD_WRITE_DIRECT_MODE_DATA = 0x51;

// https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#startup-and-completion-information
PortOutput.SC_FLAGS = {
  EXECUTE_IMMEDIATE: 0b00000001,
  COMMAND_FEEDBACK: 0b00010000
};

module.exports = PortOutput;
