const Boost = require("../src/Boost");
const { COLOR_RED } = require("../src/peripherals/RgbLed");

const boost = new Boost("001653aeb339", { logger: console });

boost.on("hubConnected", hub => {
  console.log("hub connected");

  // hub.on("tilt", tilt => console.log(tilt));

  hub.subscribeToAllPorts();

  // hub.led(COLOR_RED);

  // hub.turnMotorAB(180, 20, 20);
  // hub.ports.get(16).once("stop", () => {
  //   console.log("It stopped turn back!");
  // });

  // Is that what we want?
  // r2 = new R2D2(hub)
  // r2.get(R2D2.HEAD).turn(250, Motor.FAST)

  // hub.startMotorD(-20);
  // setTimeout(() => {
  //   hub.startMotorD(-20);
  //   setTimeout(() => {
  //     hub.stopMotorD();
  //   }, 500);
  // }, 500);

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
