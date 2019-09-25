function toHexString(nr) {
  const zeroPad = nr < 16 ? "0" : "";
  return `0x${zeroPad}${nr.toString(16)}`;
}

module.exports = {
  toHexString
};
