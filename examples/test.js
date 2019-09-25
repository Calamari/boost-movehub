const Boost = require("../src/Boost");
const { COLOR_RED } = require("../src/peripherals/RgbLed");

const boost = new Boost("001653aeb339", { logger: console });

boost.on("hubConnected", hub => {
  console.log("hub connected");

  // hub.on("tilt", tilt => console.log(tilt));

  // hub.subscribeToAllPorts();

  hub.led(COLOR_RED);

  let g = 0;
  const ledInt = setInterval(() => {
    hub.led(++g);
    // g += 25;
    // hub.ledRGB(g, g, 255 - g);
  }, 500);

  setTimeout(() => {
    clearInterval(ledInt);
    hub.switchOff();

    setTimeout(() => {
      process.exit(0);
    }, 500);
  }, 5000);
});

boost.startScanning();
