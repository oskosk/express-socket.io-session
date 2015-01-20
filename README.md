express-socket.io-session
=========================

Share a cookie-based express-session middleware with socket.io (Experimental)

**THIS MODULE IS EXPERIMENTAL. IT WORKS. BUT IT WON'T WORK *AS EXPECTED* YET BECAUSE I STILL DON'T KNOW WHAT TO EXPECT FROM IT**.

On every socket connection, you'll have `socket.handshake.session` pointing to
the same req.session you would expect in any express app handler that uses
the `express-session` middleware module.


##Installation

```
$ npm install express-socket.io-session
```


## Usage

```
$ npm install express socket.io express-session 
$ npm install express-socket.io-session
```

**index.js**

```
var app = require('express')(),
  server  = require("http").createServer(app),
  io = require("socket.io")(server),
  session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
  }),
  sharedsession = require("express-socket.io-session");


// Attach session
app.use(session);

// Share session with io sockets

io.use(sharedsession(session));

server.listen(3000);

```

##License 

MIT
