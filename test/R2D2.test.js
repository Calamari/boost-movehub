const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const Peripheral = require("../src/peripherals/Peripheral");
const MovehubPorts = require("../src/MovehubPorts");
const Hub = require("../src/Hub");
const R2D2 = require("../src/interfaces/R2D2");
const PeripheralFactory = require("../src/PeripheralFactory");
const stubCharacteristic = require("./support/stubCharacteristic");
const stubPeripheral = require("./support/stubPeripheral");
const expect = chai.expect;
chai.use(sinonChai);

describe("R2D2 interface", () => {
  let characteristic;
  let hub;
  let peripheral;
  let r2d2;

  beforeEach(() => {
    characteristic = {
      ...stubCharacteristic
    };
    peripheral = stubPeripheral(characteristic);
    hub = new Hub(peripheral);

    hub.ports.registry[MovehubPorts.PORT_D] = PeripheralFactory.create(
      Peripheral.DEV_MOTOR_EXTERNAL_TACHO,
      MovehubPorts.PORT_D
    );
    r2d2 = new R2D2(hub);
  });

  describe("has a head", () => {
    it("that can turn", () => {
      r2d2.head.turn(10, 90);
      expect(characteristic.write).to.have.been.called;
      expect(characteristic.write.getCall(0).args[0]).to.eql(
        new Buffer([0x09, 0x00, 0x81, 0x03, 0x01, 0x07, 0x5a, 0x64, 0x03])
      );
    });

    it("returns a promise that ends, when turn is finished", () => {
      expect(r2d2.head.turn(10, 90)).to.be.instanceOf(Promise);
    });
  });
});
