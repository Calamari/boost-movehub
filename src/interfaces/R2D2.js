const MovehubPorts = require("../MovehubPorts");
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
        this.hub.sendMessage(sensor.subscribe());
        return Promise.resolve();
      },
      unsubscribe: () => {
        this.hub.sendMessage(sensor.unsubscribe());
        return Promise.resolve();
      }
    };
  }

  get tiltSensor() {
    const sensor = this.hub.ports.get(MovehubPorts.PORT_TILT);

    return {
      subscribe: () => {
        this.hub.sendMessage(sensor.subscribe());
        return Promise.resolve();
      },
      unsubscribe: () => {
        this.hub.sendMessage(sensor.unsubscribe());
        return Promise.resolve();
      }
    };
  }

  get voltageSensor() {
    const sensor = this.hub.ports.get(MovehubPorts.PORT_VOLTAGE);

    return {
      subscribe: () => {
        this.hub.sendMessage(sensor.subscribe());
        return Promise.resolve();
      },
      unsubscribe: () => {
        this.hub.sendMessage(sensor.unsubscribe());
        return Promise.resolve();
      }
    };
  }

  get currentSensor() {
    const sensor = this.hub.ports.get(MovehubPorts.PORT_CURRENT);

    return {
      subscribe: () => {
        this.hub.sendMessage(sensor.subscribe());
        return Promise.resolve();
      },
      unsubscribe: () => {
        this.hub.sendMessage(sensor.unsubscribe());
        return Promise.resolve();
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

  get head() {
    const head = this.hub.ports.get(MovehubPorts.PORT_D);
    return {
      turn: speed => {
        this.hub.sendMessage(head.startSpeed(speed));
        return Promise.resolve();
      },
      turnDegrees: (degrees, speed) => {
        // We have to turn the motor more to get the head around 360 degrees
        this.hub.sendMessage(
          head.startSpeedForDegrees(Math.round(1.66 * degrees), speed)
        );
        // TODO real promise when finished
        return Promise.resolve();
      },
      turnTime: (time, speed) => {
        this.hub.sendMessage(head.startSpeedForTime(time, speed));
        return promiseTimeout(time);
      }
    };
  }
};
