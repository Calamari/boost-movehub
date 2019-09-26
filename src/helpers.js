function int32ToArray(nr) {
  let buf = new Buffer([0, 0, 0, 0]);
  buf.writeInt32BE(nr);
  return new Uint8Array(buf);
}

function toHexString(nr) {
  const zeroPad = nr < 16 ? "0" : "";
  return `0x${zeroPad}${nr.toString(16)}`;
}

module.exports = {
  int32ToArray,
  toHexString
};
