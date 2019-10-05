const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const Peripheral = require("../src/peripherals/Peripheral");
const Motor = require("../src/peripherals/Motor");
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
    characteristic = stubCharacteristic();
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
      const result = r2d2.head.turn(90);
      expect(characteristic.write).to.have.been.calledOnce;
      expect(characteristic.write.getCall(0).args[0]).to.eql(
        new Buffer([0x09, 0x00, 0x81, 0x03, 0x01, 0x07, 0x5a, 0x64, 0x03])
      );
      expect(result).to.be.instanceOf(Promise);
    });

    it("that can turn an specific amount of degrees", () => {
      const result = r2d2.head.turnDegrees(90, 10);
      expect(characteristic.write).to.have.been.calledOnce;
      expect(characteristic.write.getCall(0).args[0]).to.eql(
        new Buffer([
          0x0e,
          0x00,
          0x81,
          0x03,
          0x01,
          Motor.SUB_CMD_START_SPEED_FOR_DEGREES,
          0x95, // 90 * 1.66
          0x00,
          0x00,
          0x00,
          0x0a,
          0x64,
          Motor.END_STATE_BREAK,
          0x03
        ])
      );
      expect(result).to.be.instanceOf(Promise);
    });

    it("that can turn for an specific amount of time", () => {
      const time = 1000;
      const result = r2d2.head.turnTime(time, 10);
      expect(characteristic.write).to.have.been.calledOnce;
      expect(characteristic.write.getCall(0).args[0]).to.eql(
        new Buffer([
          0x0c,
          0x00,
          0x81,
          0x03,
          0x01,
          Motor.SUB_CMD_START_SPEED_FOR_TIME,
          0xe8,
          0x03,
          0x0a,
          0x64,
          Motor.END_STATE_FLOAT,
          0x03
        ])
      );
      expect(result).to.be.instanceOf(Promise);
    });
  });
});
