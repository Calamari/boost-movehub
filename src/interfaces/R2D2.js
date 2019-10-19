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
   *
   * @returns {Promise<void>}
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
      /**
       * Sets color of RGB to given index color.
       * @method R2D2.rgbLed.setColor
       *
       * @param {number} color The index of color to use. (One of `RgbLed.COLOR_*`)
       *
       * @returns {Promise<void>}
       */
      setColor: c => {
        this.hub.sendMessage(led.setColor(c));
        return Promise.resolve();
      }
    };
  }

  get wheels() {
    const motor = this.hub.ports.get(MovehubPorts.PORT_AB);

    return {
      /**
       * Starts both wheels synchronous using given speed.
       * @method R2D2.wheels.drive
       *
       * @param {number} speed Speed ranging from 0 to 100 (%).
       *
       * @returns {Promise<void>}
       */
      drive: speed => {
        this.hub.sendMessage(motor.combinedStartSpeed(speed, speed));
        return Promise.resolve();
      },

      /**
       * Starts both wheels synchronous using given speed until the traveled the given distance.
       * @method R2D2.wheels.driveDistance
       *
       * @param {number} centimeters Number of centimeters until wheels stop.
       * @param {number} speed Speed ranging from 0 to 100 (%).
       *
       * @returns {Promise<void>}
       */
      driveDistance: (centimeters, speed) => {
        const degrees = centimeters * DEGREES_PER_CM;
        this.hub.sendMessage(
          motor.combinedStartSpeedForDegrees(degrees, speed, speed)
        );
        // TODO real promise when finished
        return Promise.resolve();
      },

      /**
       * Starts both wheels synchronous using given speed for given amount of time.
       * @method R2D2.wheels.driveTime
       *
       * @param {number} time Number of milliseconds until wheels stop.
       * @param {number} speed Speed ranging from 0 to 100 (%).
       *
       * @returns {Promise<void>}
       */
      driveTime: (time, speed) => {
        this.hub.sendMessage(
          motor.combinedStartSpeedForTime(time, speed, speed)
        );
        return promiseTimeout(time);
      },

      /**
       * Stop both wheels.
       * @method R2D2.wheels.stop
       *
       * @returns {Promise<void>}
       */
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
      /**
       * Resolves telling if the legs are behind the body of R2D2.
       * @method R2D2.chassis.isOpen
       *
       * @returns {Promise<boolean>}
       */
      isOpen: async () => {
        if (!tiltSensor.subscriptionActive) {
          await this._subscribeTo(tiltSensor);
        }
        const { pitch } = await tiltSensor.getValueAsync();
        return pitch >= 179 && pitch <= 181;
      },

      /**
       * Speeds up the wheels for a short amount of time, so the force will bring
       * R2D2’s body in front of his legs.
       * @method R2D2.chassis.open
       *
       * @returns {Promise<void>} Resolves when the movement is done.
       */
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

      /**
       * TODO: Brings the legs close to R2D2’s body.
       * @method R2D2.chassis.close
       *
       * @returns {Promise<void>} Resolves when the movement is done.
       */
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

      /**
       * Starts turning the head.
       * @method R2D2.head.turn
       *
       * @param {number} speed The speed ranging from -100 to 100 (%). (Clockwise or counter-clockwise)
       *
       * @returns {Promise<void>} Resolves immediately.
       */
      turn: speed => {
        this.hub.sendMessage(head.startSpeed(speed));
        return Promise.resolve();
      },

      /**
       * Stops turning the head.
       * @method R2D2.head.stop
       *
       * @returns {Promise<void>} Resolves immediately.
       */
      stop: () => {
        this.hub.sendMessage(head.stop());
        return Promise.resolve();
      },

      /**
       * Starts turning the head for given amount of degrees.
       * @method R2D2.head.turnDegrees
       *
       * @param {number} degrees The amount of degrees to turn. Can be positive or negative for clockwise and counter-clockwise movement.
       * @param {number} speed The speed ranging from 0 to 100 (%).
       *
       * @returns {Promise<void>} Resolves after movement finishes.
       */
      turnDegrees: (degrees, speed) => {
        // We have to turn the motor more to get the head around 360 degrees
        this.hub.sendMessage(
          head.startSpeedForDegrees(Math.round(1.66 * degrees), speed)
        );
        return new Promise(resolve => {
          head.once("stop", resolve);
        });
      },

      /**
       * Starts turning the head for given amount of milliseconds.
       * @method R2D2.head.turnTime
       *
       * @param {number} time Milliseconds to turn
       * @param {number} speed The speed ranging from 0 to 100 (%).
       *
       * @returns {Promise<void>} Resolves after movement finishes.
       */
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
