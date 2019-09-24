const Boost = require("../src/Boost");

const boost = new Boost("001653aeb339", { logger: console });

boost.on("hubConnected", hub => {
  console.log("hub connected");

  hub.on("tilt", tilt => console.log(tilt));

  hub.subscribeToAllPorts();
  setTimeout(() => {
    hub.switchOff();

    setTimeout(() => {
      process.exit(0);
    }, 500);
  }, 5000);
});

boost.startScanning();
