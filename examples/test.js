const Boost = require("../src/Boost");
const MovehubPorts = require("../src/MovehubPorts");
const {
  COLOR_GREEN,
  COLOR_YELLOW,
  COLOR_RED
} = require("../src/peripherals/RgbLed");
const R2D2 = require("../src/interfaces/R2D2");
const { waitFor } = require("../src/helpers");

const boost = new Boost("001653aeb339", { logger: console });

boost.on("hubConnected", async hub => {
  try {
    console.log("hub connected");

    // hub.on("tilt", tilt => console.log(tilt));
    // hub.activateAlerts();

    // hub.subscribeToAllPorts();

    // hub.turnMotorAB(180, 20, 20);
    // hub.ports.get(16).once("stop", () => {
    //   console.log("It stopped turn back!");
    // });

    hub.on("vision", val => {
      console.log("vision", val);
    });

    // Is that what we want?
    r2 = new R2D2(hub, { logger: console });
    // r2.visionSensor.subscribe();
    // r2.tiltSensor.subscribe();
    // await r2.head.subscribe();
    // r2.wheels.driveTime(1200, 10).then(() => {
    // r2.wheels.driveTime(1200, -10);
    // });
    // r2.wheels.driveDistance(10, 10);
    // const isOpen = await r2.chassis.isOpen();
    // if (isOpen) {
    //   await r2.rgbLed.setColor(COLOR_GREEN);
    // } else {
    //   // await r2.chassis.open();
    //   await r2.rgbLed.setColor(COLOR_YELLOW);
    // }

    // r2.wheels.subscribe();
    r2.on("travel", (cm, speed) => {
      console.log("traveled", cm, "cm", "=", speed, "cm/s");
    });

    r2.on("headTurn", degrees => {
      console.log("headTurn", degrees);
    });

    await r2.wheels.turnRight(90, 20);
    await r2.wheels.turnLeft(90, 20);
    // await r2.wheels.drive(100);
    // r2.on("distance", async distance => {
    //   if (distance < 6) {
    //     await r2.wheels.driveDistance(20, 30);
    //   }
    // });

    // await waitFor(1500);
    // await r2.wheels.stop();
    // // r2.visionSensor.unsubscribe();
    // await r2.head.turnDegrees(360, 40);
    // await r2.head.turnTime(350, -30);
    // await r2.rgbLed.setColor(4);
    // hub.startMotorAB(15, 15);
    // hub.led(COLOR_RED);
    // r2.rgbLed.setColor(COLOR_YELLOW);
    setTimeout(() => {
      // r2.head.turn(10);
      // r2.wheels.forward(10);
      // hub.sendMessage(
      //   hub.ports.get(MovehubPorts.PORT_AB).combinedStartSpeed(10, 10)
      // );

      // hub.startMotorAB(-15, 15);
      // hub.startMotorD(20);
      // hub.led(COLOR_YELLOW);
      setTimeout(() => {
        // r2.head.stop();
        // hub.sendMessage(
        //   hub.ports.get(MovehubPorts.PORT_AB).combinedStartSpeed(0)
        // );
        // r2.rgbLed.setColor(COLOR_YELLOW);
        // r2.wheels.stop();
        // hub.startMotorAB(10, 10);
        setTimeout(() => {
          // hub.led(COLOR_RED);
          // hub.stopMotorAB();
        }, 500);
      }, 1000);
    }, 1000);

    // let g = 0;
    // const ledInt = setInterval(() => {
    //   hub.led(++g);
    //   // g += 25;
    //   // hub.ledRGB(g, g, 255 - g);
    // }, 500);

    await waitFor(500);
    hub.switchOff();

    await waitFor(500);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(0);
  }
});

boost.startScanning();
