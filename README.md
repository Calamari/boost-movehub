# Boost-Movehub [![Build Status](https://travis-ci.org/Calamari/boost-movehub.svg?branch=master)](https://travis-ci.org/Calamari/boost-movehub)

A JavaScript library to control your Lego Boost Movehub appliance.

# Example

```js
const { Boost, R2D2 } = require("boost-movehub");
const boost = new Boost("001653aeb339");

boost.on("hubConnected", async hub => {
  const r2 = new R2D2(hub, { logger: console });
  // Drive forward R2D2
  r2.wheels.drive(30);
  // and turn your head while you are at it.
  await r2.head.turnDegree(360, 20);
  // Enough of fooling around. Time to stop.
  await r2.wheels.stop();
});
```

# Disclaimer

Lego is a trademark of The Lego Group. I am not affiliated with them, I just love and play around with their toys.

# Licence

MIT License. [See license file](./LICENSE.md).
