function encodeFlags(flags) {
  if (typeof flags !== "number") {
    console.log(typeof flags);
    flags = flags.reduce((memo, flag) => memo | flag, 0);
  }
  return flags;
}

function int32ToArray(nr) {
  let buf = new Buffer([0, 0, 0, 0]);
  buf.writeInt32LE(nr);
  return new Uint8Array(buf);
}

function toHexString(nr) {
  const zeroPad = nr < 16 ? "0" : "";
  return `0x${zeroPad}${nr.toString(16)}`;
}

module.exports = {
  encodeFlags,
  int32ToArray,
  toHexString
};
