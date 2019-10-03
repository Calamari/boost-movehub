const chai = require("chai");
const PortOutput = require("../src/messages/PortOutput");

var expect = chai.expect;

function expectWriteDirectModeData(msg) {
  expect(msg.isWriteDirectModeData).to.be.true;

  expect(msg.data[5]).to.eql(
    PortOutput.SUB_CMD_WRITE_DIRECT_MODE_DATA,
    "type is sub command WriteDirectModeData"
  );

  expect(msg.length).to.gte(
    7,
    "Lenght must contain at least another sub command and payload"
  );
}

module.exports = {
  expectWriteDirectModeData
};
