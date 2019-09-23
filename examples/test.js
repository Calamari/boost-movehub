const Boost = require('../src/Boost')

const boost = new Boost('001653aeb339', { logger: console })

boost.on('hubConnected', _hub => {
  console.log("hub connected")
  // hub.led('green')
  setTimeout(() => {
    process.exit(0)
  })
})

boost.startScanning();
