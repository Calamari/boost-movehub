const chai = require("chai");
const { encodeFlags, int32ToArray, toHexString } = require("../src/helpers");

var expect = chai.expect;

describe("helpers", () => {
  describe("#encodeFlags", () => {
    it("passes a number just through", () => {
      expect(encodeFlags(0b0010)).to.eql(0b0010);
    });

    it("or-combines array of numbers", () => {
      expect(encodeFlags([0b1010, 0b1001])).to.eql(0b1011);
    });
  });

  describe("#int32ToArray", () => {
    it("encodes the number Little endian style", () => {
      expect(int32ToArray(255 << 4)).to.eql(new Uint8Array([0xf0, 0x0f, 0, 0]));
    });
  });

  describe("#toHexString", () => {
    it("adds a leading zero if needed", () => {
      expect(toHexString(15)).to.eql("0x0f");
    });

    it("does not a leading zero if not needed", () => {
      expect(toHexString(250)).to.eql("0xfa");
    });

    it("goes bigger then a byte", () => {
      expect(toHexString(256)).to.eql("0x100");
    });
  });
});
