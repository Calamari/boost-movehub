const chai = require("chai");
const Peripheral = require("../../src/peripherals/Peripheral");
const RgbLed = require("../../src/peripherals/RgbLed");
const PortOutput = require("../../src/messages/PortOutput");
const { expectWriteDirectModeData } = require("../testHelper");

var expect = chai.expect;

describe("RgbLed", () => {
  const led = new RgbLed(Peripheral.DEV_RGB_LIGHT, 0xaa);

  describe(".setColor", () => {
    const subject = led.setColor(RgbLed.COLOR_LIGHTBLUE);

    it("creates an instance of a PortOutput message", () => {
      expect(subject).to.be.instanceOf(PortOutput);
    });

    it("contains the right payload", () => {
      expect(subject.data).to.eql(
        Buffer.from([0x08, 0x00, 0x81, 0xaa, 0x10, 0x51, 0x00, 0x04])
      );
    });

    it("is WriteDirectModeData encoded", () => {
      expectWriteDirectModeData(subject);
    });
  });

  describe(".setRgbColor", () => {
    const subject = led.setColor(255, 0, 128);
    it("creates an instance of a PortOutput message", () => {
      expect(subject).to.be.instanceOf(PortOutput);
    });

    xit("contains the right payload", () => {
      // TODO: Document this, if it works
      // expect(led.setRgbColor(RgbLed.COLOR_LIGHTBLUE).data).to.eql(
      //   Buffer.from([0x08, 0x00, 0x81, 0xaa, 0x01, 0x51, 0x00, 0x04])
      // );
    });
  });
});
