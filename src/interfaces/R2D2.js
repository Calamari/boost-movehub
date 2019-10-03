const MovehubPorts = require("../MovehubPorts");

/**
 * Interface to work with R2D2 robot
 */
module.exports = class R2D2 {
  constructor(hub) {
    this.hub = hub;
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
      forward: speed => {
        this.hub.sendMessage(motor.combinedStartSpeed(speed, speed));
        return Promise.resolve();
      },
      stop: () => {
        this.hub.sendMessage(motor.combinedStop());
      }
    };
  }

  get head() {
    const head = this.hub.ports.get(MovehubPorts.PORT_D);
    return {
      turn: (degree, speed) => {
        //Todo turn
        this.hub.sendMessage(head.startSpeed(speed));
        return Promise.resolve();
      }
    };
  }
};
