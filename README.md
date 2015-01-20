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

        var session require("express-session")({
            secret: "my-secret",
            resave: true,
            saveUninitialized: true
        });
        // Use sessions with express
        app.use(session);
        //Share the express' session with socket.io
        io.use(require("express-socket.io-session")(session));
## Usage example

```
# Install express, socket.io and express-session 
$ npm install express socket.io express-session 
# Install this module
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

## API

This module exports  a **socket.io**'s middleware for using with `io.use()`
You get a *shared session* middleware by requiring the module.

**require("express-socket.io-session")( express_session_middleware )**

The  `express_session_middleware` parameter is **mandatory** and must be an express middleware function created with the  [express-session](https://www.npmjs.org/package/express-session) module that allows cookie-based sessions.

##License 

MIT
