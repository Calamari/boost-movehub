const Boost = require("../src/Boost");

const boost = new Boost("001653aeb339", { logger: console });

boost.on("hubConnected", hub => {
  console.log("hub connected");

  setTimeout(() => {
    hub.switchOff();
  }, 1000);
  // hub.switchOff();
  // hub.led('green')
  setTimeout(() => {
    process.exit(0);
  }, 2000);
});

boost.startScanning();
