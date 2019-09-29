const chai = require("chai");
const Peripheral = require("../../src/peripherals/Peripheral");
const Motor = require("../../src/peripherals/Motor");
const PortOutput = require("../../src/messages/PortOutput");
const { expectWriteDirectModeData } = require("../testHelper");
var expect = chai.expect;

describe("Motor", () => {
  const motor = new Motor(Peripheral.DEV_MOTOR_INTERNAL_TACHO, 0xaa);

  describe(".startPower", () => {
    const subject = motor.startPower(10);

    it("creates an instance of a PortOutput message", () => {
      expect(subject).to.be.instanceOf(PortOutput);
    });

    it("contains the right payload", () => {
      expect(subject.data).to.eql(
        Buffer.from([0x08, 0x00, 0x81, 0xaa, 0x01, 0x51, 0x01, 0x0a])
      );
    });

    it("is WriteDirectModeData encoded", () => {
      expectWriteDirectModeData(subject);
    });
  });

  describe(".stop", () => {
    const subject = motor.stop();

    it("creates an instance of a PortOutput message", () => {
      expect(subject).to.be.instanceOf(PortOutput);
    });

    it("contains the right payload", () => {
      expect(subject.data).to.eql(
        Buffer.from([0x08, 0x00, 0x81, 0xaa, 0x01, 0x51, 0x01, 0x00])
      );
    });

    it("is WriteDirectModeData encoded", () => {
      expectWriteDirectModeData(subject);
    });
  });
});
