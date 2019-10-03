const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const Peripheral = require("../src/peripherals/Peripheral");
const TiltSensor = require("../src/peripherals/TiltSensor");
const Motor = require("../src/peripherals/Motor");
const Hub = require("../src/Hub");
const HubAttachedMessage = require("../src/messages/HubAttachedMessage");
const stubCharacteristic = require("./support/stubCharacteristic");
const stubPeripheral = require("./support/stubPeripheral");
const expect = chai.expect;
chai.use(sinonChai);

const LEGO_CHARACTERISTIC = "000016241212efde1623785feabcd123";

describe("Hub", () => {
  let peripheral;
  let hub;
  let characteristic;
  beforeEach(() => {
    characteristic = {
      ...stubCharacteristic
    };
    peripheral = stubPeripheral(characteristic);
  });

  it("directly connects with the peripheral", () => {
    hub = new Hub(peripheral);
    expect(peripheral.connect).to.have.been.called;
  });

  describe("on characteristic sending us packages", () => {
    beforeEach(() => {
      peripheral.connect = cb => cb(null);
      hub = new Hub(peripheral);
    });

    describe("on HubAttached messages", () => {
      it("can attach a motor", () => {
        const portId = 0x01;
        const msg = Buffer.from([
          0x0f,
          0x00,
          HubAttachedMessage.TYPE,
          portId,
          HubAttachedMessage.EVENT_TYPE_ATTACHED_IO,
          Peripheral.DEV_MOTOR_EXTERNAL_TACHO,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x10,
          0x00,
          0x00,
          0x00,
          0x10
        ]);
        characteristic.dataHandler(msg);

        expect(hub.ports.get(portId)).to.be.instanceOf(Motor);
      });

      it("can attach a tilt sensor", () => {
        const portId = 0x01;
        const msg = Buffer.from([
          0x0f,
          0x00,
          HubAttachedMessage.TYPE,
          portId,
          HubAttachedMessage.EVENT_TYPE_ATTACHED_IO,
          Peripheral.DEV_TILT_INTERNAL,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x10,
          0x00,
          0x00,
          0x00,
          0x10
        ]);
        characteristic.dataHandler(msg);

        expect(hub.ports.get(portId)).to.be.instanceOf(TiltSensor);
      });
    });
  });
});
