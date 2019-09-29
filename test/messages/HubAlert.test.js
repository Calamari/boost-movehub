const chai = require("chai");
const HubAlert = require("../../src/messages/HubAlert");

var expect = chai.expect;

describe("HubAlert", () => {
  describe("#build", () => {
    it("creates an instance of a HubAlert message", () => {
      expect(HubAlert.build(0x12, 0x34)).to.be.instanceOf(HubAlert);
    });

    it("contains the right payload", () => {
      expect(HubAlert.build(0x12, 0x34).data).to.eql(
        Buffer.from([0x05, 0x00, 0x03, 0x12, 0x34])
      );
    });
  });

  describe(".alertType", () => {
    it("returns the alertType we builded with", () => {
      expect(HubAlert.build(0x12, 0x34).alertType).to.eql(0x12);
    });
  });

  describe(".alertTypeToString", () => {
    it("returns text for low voltage alert", () => {
      expect(
        HubAlert.build(HubAlert.LOW_VOLTAGE, 0x01).alertTypeToString
      ).to.eql("lowVoltage");
    });

    it("returns text for high current alert", () => {
      expect(
        HubAlert.build(HubAlert.HIGH_CURRANT, 0x01).alertTypeToString
      ).to.eql("highCurrant");
    });

    it("returns text for low signal strength alert", () => {
      expect(
        HubAlert.build(HubAlert.LOW_SIGNAL_STRENGTH, 0x01).alertTypeToString
      ).to.eql("lowSignal");
    });

    it("returns text for over power condition alert", () => {
      expect(
        HubAlert.build(HubAlert.OVER_POWER_CONDITION, 0x01).alertTypeToString
      ).to.eql("overPower");
    });
  });
});
