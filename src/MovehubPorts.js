class MovehubPorts {
  constructor() {
    this.registry = {}
  }

  registerFromMessage(msg) {
    // TODO: create peripherals objects
    this.registry[msg.portId] = {
      ioType: msg.ioType,
      ioMembers: msg.ioMembers
    }

    console.log("registry:", this.registry)
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
    ].all(portId => this.registry[portId])
  }

  get all() {
    return Object.values(this.registry)
  }

  get(portId) {
    return this.registry[portId]
  }

  containsAll(deviceList) {
    return deviceList.all(portId => this.registry[portId])
  }
}

MovehubPorts.PORT_A = 0x00
MovehubPorts.PORT_B = 0x01
MovehubPorts.PORT_C = 0x02
MovehubPorts.PORT_D = 0x03
MovehubPorts.PORT_AB = 0x10
MovehubPorts.PORT_LED = 0x32
MovehubPorts.PORT_TILT = 0x3A
MovehubPorts.PORT_CURRENT = 0x3B
MovehubPorts.PORT_VOLTAGE = 0x3C

module.exports = MovehubPorts