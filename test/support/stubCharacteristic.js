const sinon = require("sinon");

const LEGO_CHARACTERISTIC = "000016241212efde1623785feabcd123";

module.exports = function createCharacteristic() {
  return {
    uuid: LEGO_CHARACTERISTIC,
    dataHandler: null,
    on: function(type, cb) {
      if (type === "data") {
        this.dataHandler = cb;
      }
    },
    subscribe: sinon.spy(),
    write: sinon.spy()
  };
};
