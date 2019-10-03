const sinon = require("sinon");

module.exports = function create(characteristic) {
  return {
    address: "00:00:00:00:00:00:01",
    uuid: "001653aeb339",
    discoverAllServicesAndCharacteristics: sinon.spy(cb =>
      cb(null, [], [characteristic])
    ),
    connect: sinon.spy(cb => cb(null)),
    on: sinon.spy(),
    updateRssi: sinon.spy()
  };
};
