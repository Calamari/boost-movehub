class Peripheral {
  constructor(ioType, portId) {
    this.ioType = ioType;
    this.portId = portId;
  }
}

/**
 * Defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#io-type-id
 */
Peripheral.DEV_MOTOR = 0x0001;
Peripheral.DEV_SYSTEM_TRAIN_MOTOR = 0x0002;
Peripheral.DEV_BUTTON = 0x0005;
Peripheral.DEV_LED_LIGHT = 0x0008;
Peripheral.DEV_VOLTAGE = 0x0014;
Peripheral.DEV_CURRENT = 0x0015;
Peripheral.DEV_PIEZO_SOUND = 0x0016;
Peripheral.DEV_RGB_LIGHT = 0x0017;
Peripheral.DEV_TILT_EXTERNAL = 0x0022;
Peripheral.DEV_MOTION_SENSOR = 0x0023;
Peripheral.DEV_VISION_SENSOR = 0x0025;
Peripheral.DEV_MOTOR_EXTERNAL_TACHO = 0x0026;
Peripheral.DEV_MOTOR_INTERNAL_TACHO = 0x0027;
Peripheral.DEV_TILT_INTERNAL = 0x0028;

module.exports = Peripheral;
