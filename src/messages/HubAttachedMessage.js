const DeviceMessage = require('./DeviceMessage')

/**
 * As defined in https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#hub-attached-i-o
 * example data: <Buffer 0f 00 04 00 01 27 00 00 00 00 10 00 00 00 10>
 */
class HubAttachedMessage extends DeviceMessage {
  /**
   * Returns ID of port as defined in Port
   */
  get portId() {
    return this.data[3]
  }

  get eventType() {
    return this.data[4]
  }

  get ioType() {
    return this.data[5]
  }

  /**
   * This only applies to eventType === EVENT_TYPE_ATTACHED_VIRTUAL_IO
   */
  get ioMembers() {
    if (this.eventType !== HubAttachedMessage.EVENT_TYPE_ATTACHED_VIRTUAL_IO) {
      return []
    }
    return [this.data[7], this.data[8]]
  }
}

HubAttachedMessage.TYPE = 0x04

HubAttachedMessage.DEV_MOTOR = 0x0001
HubAttachedMessage.DEV_SYSTEM_TRAIN_MOTOR = 0x0002
HubAttachedMessage.DEV_BUTTON = 0x0005
HubAttachedMessage.DEV_LED_LIGHT = 0x0008
HubAttachedMessage.DEV_VOLTAGE = 0x0014
HubAttachedMessage.DEV_CURRENT = 0x0015
HubAttachedMessage.DEV_PIEZO_SOUND = 0x0016
HubAttachedMessage.DEV_RGB_LIGHT = 0x0017
HubAttachedMessage.DEV_TILT_EXTERNAL = 0x0022
HubAttachedMessage.DEV_MOTION_SENSOR = 0x0023
HubAttachedMessage.DEV_VISION_SENSOR = 0x0025
HubAttachedMessage.DEV_MOTOR_EXTERNAL_TACHO = 0x0026
HubAttachedMessage.DEV_MOTOR_INTERNAL_TACHO = 0x0027
HubAttachedMessage.DEV_TILT_INTERNAL = 0x0028

HubAttachedMessage.EVENT_TYPE_DETACHED_IO = 0x00
HubAttachedMessage.EVENT_TYPE_ATTACHED_IO = 0x01
HubAttachedMessage.EVENT_TYPE_ATTACHED_VIRTUAL_IO = 0x02

module.exports = HubAttachedMessage