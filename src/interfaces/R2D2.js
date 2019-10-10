const MovehubPorts = require("../MovehubPorts");
const Motor = require("../peripherals/Motor");
const { promiseTimeout } = require("../helpers");

// The wheels have a radius of 1.75cm, so the perimeter is 10.996cm (let's say 11cm)
const WHEEL_PERIMETER = 11;
const DEGREES_PER_CM = 360 / WHEEL_PERIMETER;

/**
 * Interface to work with R2D2 robot
 */
module.exports = class R2D2 {
  constructor(hub) {
    this.hub = hub;
  }

  get visionSensor() {
    const sensor = this.hub.ports.get(MovehubPorts.PORT_C);

    return {
      subscribe: () => {
        return this._subscribeTo(sensor);
      },
      unsubscribe: () => {
        return this._unsubscribeFrom(sensor);
      }
    };
  }

  get tiltSensor() {
    const sensor = this.hub.ports.get(MovehubPorts.PORT_TILT);

    return {
      subscribe: () => {
        return this._subscribeTo(sensor);
      },
      unsubscribe: () => {
        return this._unsubscribeFrom(sensor);
      }
    };
  }

  get voltageSensor() {
    const sensor = this.hub.ports.get(MovehubPorts.PORT_VOLTAGE);

    return {
      subscribe: () => {
        return this._subscribeTo(sensor);
      },
      unsubscribe: () => {
        return this._unsubscribeFrom(sensor);
      }
    };
  }

  get currentSensor() {
    const sensor = this.hub.ports.get(MovehubPorts.PORT_CURRENT);

    return {
      subscribe: () => {
        return this._subscribeTo(sensor);
      },
      unsubscribe: () => {
        return this._unsubscribeFrom(sensor);
      }
    };
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
    return {
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
        // TODO real promise when finished
        return Promise.resolve();
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
};
