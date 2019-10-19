const MovehubPorts = require("../MovehubPorts");
const Motor = require("../peripherals/Motor");
const { promiseTimeout } = require("../helpers");

// The wheels have a radius of 1.75cm, so the perimeter is 10.996cm (let's say 11cm)
const WHEEL_PERIMETER = 11;
const DEGREES_PER_CM = 360 / WHEEL_PERIMETER;

const EMIT_TO_SENSOR = {
  color: MovehubPorts.PORT_C,
  current: MovehubPorts.PORT_CURRENT,
  distance: MovehubPorts.PORT_C,
  tilt: MovehubPorts.PORT_TILT,
  voltage: MovehubPorts.PORT_VOLTAGE
};

/**
 * Interface to work with your R2D2 robot.
 */
module.exports = class R2D2 {
  constructor(hub, options = {}) {
    this.hub = hub;
    this.logger = options.logger || {};
  }

  /**
   * Register event handlers on specific topics.
   *
   * @param {string} what Type of event to listen to.
   * @param {Function} cb Callback method to call when event is happening.
   */
  async on(what, cb) {
    const portId = EMIT_TO_SENSOR[what];
    if (!portId) {
      this._log("warn", `Don't know on what port to listen for event ${what}`);
      return;
    }
    const sensor = this.hub.ports.get(MovehubPorts.PORT_C);
    if (!sensor.subscriptionActive) {
      await this._subscribeTo(sensor);
    }
    return sensor.on(what, cb);
  }

  get rgbLed() {
    const led = this.hub.ports.get(MovehubPorts.PORT_LED);

    return {
      setColor: c => {
        this.hub.sendMessage(led.setColor(c));
        return Promise.resolve();
      }
    };
  }

  get wheels() {
    const motor = this.hub.ports.get(MovehubPorts.PORT_AB);

    return {
      drive: speed => {
        this.hub.sendMessage(motor.combinedStartSpeed(speed, speed));
        return Promise.resolve();
      },
      driveDistance: (centimeters, speed) => {
        const degrees = centimeters * DEGREES_PER_CM;
        this.hub.sendMessage(
          motor.combinedStartSpeedForDegrees(degrees, speed, speed)
        );
        // TODO real promise when finished
        return Promise.resolve();
      },
      driveTime: (time, speed) => {
        this.hub.sendMessage(
          motor.combinedStartSpeedForTime(time, speed, speed)
        );
        return promiseTimeout(time);
      },
      stop: () => {
        this.hub.sendMessage(motor.combinedStop());
        return Promise.resolve();
      }
    };
  }

  get chassis() {
    const motor = this.hub.ports.get(MovehubPorts.PORT_AB);
    const tiltSensor = this.hub.ports.get(MovehubPorts.PORT_TILT);

    // TODO: add method that checks if chassis is currenlty open
    return {
      isOpen: async () => {
        if (!tiltSensor.subscriptionActive) {
          await this._subscribeTo(tiltSensor);
        }
        const { pitch } = await tiltSensor.getValueAsync();
        return pitch >= 179 && pitch <= 181;
      },
      open: () => {
        this.hub.sendMessage(
          motor.combinedStartSpeedForDegrees(
            135,
            100,
            100,
            100,
            Motor.END_STATE_BREAK,
            Motor.PROFILE_DO_NOT_USE
          )
        );
        return new Promise(resolve => {
          motor.once("stop", resolve);
        });
      },
      close: () => {
        // TODO: this does not work yet
        this.hub.sendMessage(
          motor.combinedStartSpeedForDegrees(
            -235,
            100,
            100,
            100,
            Motor.END_STATE_BREAK,
            Motor.PROFILE_DO_NOT_USE
          )
        );
        return new Promise(resolve => {
          motor.once("stop", resolve);
        });
      }
    };
  }

  get head() {
    const head = this.hub.ports.get(MovehubPorts.PORT_D);

    return {
      subscribe: () => {
        return this._subscribeTo(sensor);
      },
      unsubscribe: () => {
        return this._unsubscribeFrom(sensor);
      },
      turn: speed => {
        this.hub.sendMessage(head.startSpeed(speed));
        return Promise.resolve();
      },
      stop: () => {
        this.hub.sendMessage(head.stop());
        return Promise.resolve();
      },
      turnDegrees: (degrees, speed) => {
        // We have to turn the motor more to get the head around 360 degrees
        this.hub.sendMessage(
          head.startSpeedForDegrees(Math.round(1.66 * degrees), speed)
        );
        return new Promise(resolve => {
          head.once("stop", resolve);
        });
      },
      turnTime: (time, speed) => {
        this.hub.sendMessage(head.startSpeedForTime(time, speed));
        return new Promise(resolve => {
          head.once("stop", resolve);
        });
      }
    };
  }

  _subscribeTo(peripheral) {
    return new Promise(resolve => {
      peripheral.once("subscribed", resolve);
      this.hub.sendMessage(peripheral.subscribe());
    });
  }

  _unsubscribeFrom(peripheral) {
    return new Promise(resolve => {
      peripheral.once("unsubscribed", resolve);
      this.hub.sendMessage(peripheral.unsubscribe());
    });
  }

  _log(type, ...message) {
    this.logger[type] &&
      this.logger[type]("[R2D2]", new Date().toISOString(), ...message);
  }
};
