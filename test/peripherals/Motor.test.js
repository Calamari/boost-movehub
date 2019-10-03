const chai = require("chai");
const Peripheral = require("../../src/peripherals/Peripheral");
const Motor = require("../../src/peripherals/Motor");
const PortOutput = require("../../src/messages/PortOutput");
const { expectWriteDirectModeData } = require("../testHelper");
var expect = chai.expect;

describe("Motor", () => {
  let motor = new Motor(Peripheral.DEV_MOTOR_INTERNAL_TACHO, 0xaa);

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

    it("does not work on a virtual device", () => {
      motor = new Motor(Peripheral.DEV_MOTOR_INTERNAL_TACHO, 0xaa, {
        ioMembers: [0x01, 0x02]
      });

      expect(() => {
        motor.startPower(10);
      }).to.Throw("Virtual Device cannot start Power on only one motor.");
    });
  });

  describe(".stop", () => {
    const subject = motor.stop();

    it("creates an instance of a PortOutput message", () => {
      expect(subject).to.be.instanceOf(PortOutput);
    });

    it("contains the right payload", () => {
      expect(subject.data).to.eql(
        Buffer.from([0x09, 0x00, 0x81, 0xaa, 0x01, 0x07, 0x00, 0x00, 0b11])
      );
    });

    it("does not work on a virtual device", () => {
      motor = new Motor(Peripheral.DEV_MOTOR_INTERNAL_TACHO, 0xaa, {
        ioMembers: [0x01, 0x02]
      });

      expect(() => {
        motor.stop();
      }).to.Throw("Virtual Device cannot start Power on only one motor.");
    });
  });

  describe(".combinedStartPower", () => {
    const subject = motor.combinedStartPower(10, 10);

    it("creates an instance of a PortOutput message", () => {
      expect(subject).to.be.instanceOf(PortOutput);
    });

    it("contains the right payload", () => {
      expect(subject.data).to.eql(
        Buffer.from([0x09, 0x00, 0x81, 0xaa, 0x11, 0x51, 0x02, 0x0a, 0x0a])
      );
    });

    it("is WriteDirectModeData encoded", () => {
      expectWriteDirectModeData(subject);
    });
  });
});
