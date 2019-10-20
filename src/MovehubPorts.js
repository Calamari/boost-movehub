const PeripheralFactory = require("./PeripheralFactory");

const DEFAULT_OPTIONS = {
  logger: {}
};

/**
 * Registry for all ports of Movehub.
 */
class MovehubPorts {
  /**
   * @param {Object} [options]
   * @param {Object} [options.logger={}]
   */
  constructor(options = DEFAULT_OPTIONS) {
    this.registry = {};
    this.logger = options.logger || {};
  }

  /**
   * Creates and registers a peripheral using the message.
   *
   * @param {HubAttached} msg
   */
  registerFromMessage(msg) {
    this.registry[msg.portId] = PeripheralFactory.create(
      msg.ioType,
      msg.portId,
      { logger: this.logger, ioMembers: msg.ioMembers }
    ) || {
      temp: "THIS IS TODO",
      ioType: msg.ioType,
      ioMembers: msg.ioMembers
    };
  }

  /**
   * Returns true if all Movehub build-in ports have registered.
   */
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

  /**
   * Returns all registered `Peripheral`s.
   */
  get all() {
    return Object.values(this.registry);
  }

  /**
   * Returns the `Peripheral` on given port.
   *
   * @param {number} portId
   * @returns {Peripheral}
   */
  get(portId) {
    return this.registry[portId];
  }

  /**
   * Returns true if all port Ifs that are given have been registered.
   *
   * @param {number[]} portIdList List of PortIds that have to be registered.
   * @returns {boolean}
   */
  containsAll(portIdList = []) {
    return portIdList.every(portId => this.registry[portId]);
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
