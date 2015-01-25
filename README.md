express-socket.io-session
=========================

Share a cookie-based express-session middleware with socket.io

**Notice**

**THIS MODULE IS EXPERIMENTAL. IT WORKS. BUT IT WON'T WORK *AS EXPECTED* YET BECAUSE I STILL DON'T KNOW WHAT TO EXPECT FROM IT.**

**It works with express > 4.0.0 and socket.io > 1.0.0 and won't be backward compatible.**.

On every socket connection, you'll have `socket.handshake.session` pointing to
the same `req.session` you would expect in any express app handler that uses
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


**Sharing session data with a namespaced socket**

    io.of('/namespace').use(sharedsession(session));

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

#License 

The MIT License (MIT)

Copyright (c) 2014-2015 osk &lt;oscar@shovelapps.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

