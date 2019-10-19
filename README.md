# Boost-Movehub [![Build Status](https://travis-ci.org/Calamari/boost-movehub.svg?branch=master)](https://travis-ci.org/Calamari/boost-movehub)

A JavaScript library to control your Lego Boost Movehub appliance.

## Example

```js
const { Boost, R2D2 } = require("boost-movehub");
const boost = new Boost("001653aeb339"); // Enter your Movehub’s UUID here.

boost.on("hubConnected", async hub => {
  const r2 = new R2D2(hub, { logger: console });
  // Drive forward R2D2
  r2.wheels.drive(30);
  // and turn your head while you are at it.
  await r2.head.turnDegree(360, 20);
  // Enough of fooling around. Time to stop.
  await r2.wheels.stop();
});

boost.startScanning();
```

## Getting started

First things first. Movehub devices are controlled via Bluetooth Low Energy (BLE). This library uses [noble](https://github.com/noble/noble) as abstraction for this. It is highly adviced to quickly read their `README` file just to understand the prerequisites. Since BLE advertisment needs root rights, it is also nice to grant node the rights to this, so you do not have to run your scripts with sudo. See [here how it’s done](https://github.com/noble/noble#running-without-rootsudo).

### High level run through the code

Your Movehub is controlled using messages that are send to your device and it also sends messages back. You can read most of the stuff about all the messages that are being send back and forth on the [Lego Boosttm Movehub Protocol documentation](https://lego.github.io/lego-ble-wireless-protocol-docs/index.html). It contains some typos and is not complete, but it is great to have.

The main class that controls your real Movehub is the `Hub` class. It’s main purpose is to receive the peripheral data from `noble`, checking which devices are plugged in which ports, sending `DeviceMessages` through the `sendMessage` method and receiving `DeviceMessages` and dispatching those to the `Peripheral` instances and emitting those values via a list of different events.

And since this feels very low level (or rather midlevel) and I have a Lego Boost R2D2 at home, there is also the `R2D2` class that provides a nicer interface to your Robots with some higher level functionality like spreading R2’s legs and having everything asynchronous.

## Disclaimer

Lego is a trademark of The Lego Group. I am not affiliated with them, I just love and play around with their toys.

## Inspiration

This is not the first library that connects to your Lego Boost device. So I like to name the projects I drew inspiration from or that made this possible:

- [Lego Boosttm Movehub Protocol documentation](https://lego.github.io/lego-ble-wireless-protocol-docs/index.html) - The documentation provided by Lego themselves. Thanks guys!
- [undera/pylgbst](https://github.com/undera/pylgbst/) - A pyhton lib where I borrowed some ideas, and I looked upon when the Protocol docs where not very clear.
- [hobbyquaker/node-movehub](https://github.com/hobbyquaker/node-movehub) - A very simple library to access your Movehub device. I started with this but found it to low level.
- [JorgePe/BOOSTreveng](https://github.com/JorgePe/BOOSTreveng) - Well, this guy sniffed the messages send back and forth and documented all his findings.

## Licence

MIT License. [See license file](./LICENSE.md).
