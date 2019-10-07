const Boost = require("../src/Boost");
const MovehubPorts = require("../src/MovehubPorts");
const { COLOR_YELLOW, COLOR_RED } = require("../src/peripherals/RgbLed");
const R2D2 = require("../src/interfaces/R2D2");
const { waitFor } = require("../src/helpers");

const boost = new Boost("001653aeb339", { logger: console });

boost.on("hubConnected", async hub => {
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
  r2 = new R2D2(hub);
  r2.visionSensor.subscribe();
  r2.tiltSensor.subscribe();
  // r2.wheels.driveTime(1200, 10).then(() => {
  // r2.wheels.driveTime(1200, -10);
  // });
  // r2.wheels.driveDistance(10, 10);
  r2.chassis.open();

  // await waitFor(500);
  // r2.visionSensor.unsubscribe();
  // r2.head.turnDegrees(-360, 40);
  // hub.startMotorAB(15, 15);
  // hub.led(COLOR_RED);
  // r2.rgbLed.setColor(COLOR_YELLOW);
  setTimeout(() => {
    // r2.wheels.forward(10);
    // hub.sendMessage(
    //   hub.ports.get(MovehubPorts.PORT_AB).combinedStartSpeed(10, 10)
    // );

    // hub.startMotorAB(-15, 15);
    // hub.startMotorD(20);
    // hub.led(COLOR_YELLOW);
    setTimeout(() => {
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

  setTimeout(() => {
    // clearInterval(ledInt);
    hub.switchOff();

    setTimeout(() => {
      process.exit(0);
    }, 500);
  }, 5000);
});

boost.startScanning();
