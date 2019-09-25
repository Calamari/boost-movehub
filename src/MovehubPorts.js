const PeripheralFactory = require("./PeripheralFactory");

const DEFAULT_OPTIONS = {
  logger: {}
};

class MovehubPorts {
  constructor(options = DEFAULT_OPTIONS) {
    this.registry = {};
    this.logger = options.logger || {};
  }

  registerFromMessage(msg) {
    this.registry[msg.portId] = PeripheralFactory.create(
      msg.ioType,
      msg.portId,
      { logger: this.logger }
    ) || {
      temp: "THIS IS TODO",
      ioType: msg.ioType,
      ioMembers: msg.ioMembers
    };

    console.log("registry:", this.registry);
  }

  get builtInDevicesRegistered() {
    return [
      MovehubPorts.PORT_A,
      MovehubPorts.PORT_B,
      MovehubPorts.PORT_AB,
      MovehubPorts.PORT_LED,
      MovehubPorts.PORT_TILT,
      MovehubPorts.PORT_CURRENT,
      MovehubPorts.PORT_VOLTAGE
    ].every(portId => this.registry[portId]);
  }

  get all() {
    return Object.values(this.registry);
  }

  get(portId) {
    return this.registry[portId];
  }

  containsAll(deviceList = []) {
    return deviceList.every(portId => this.registry[portId]);
  }

  _log(type, ...message) {
    this.logger[type] && this.logger[type]("[Ports]", ...message);
  }
}

MovehubPorts.PORT_A = 0x00;
MovehubPorts.PORT_B = 0x01;
MovehubPorts.PORT_C = 0x02;
MovehubPorts.PORT_D = 0x03;
MovehubPorts.PORT_AB = 0x10;
MovehubPorts.PORT_LED = 0x32;
MovehubPorts.PORT_TILT = 0x3a;
MovehubPorts.PORT_CURRENT = 0x3b;
MovehubPorts.PORT_VOLTAGE = 0x3c;

module.exports = MovehubPorts;
