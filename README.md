express-socket.io-session
=========================

Share a cookie-based express-session middleware with socket.io. Works with **express > 4.0.0** and **socket.io > 1.0.0** and won't be backward compatible.

**Help me notice errors or ask me for improvements [creating an issue](https://github.com/oskosk/express-socket.io-session/issues/new)**.


## Installation

```
$ npm install express-socket.io-session
```

## Overview

After every socket connection, you'll have **socket.handshake.session**.
That is the same session object `req.session` you get in your route middleware when your app
uses [express-session](https://www.npmjs.com/package/express-session).


### Modifying session data inside socket.io event handlers

When inside express, you normally get to modify your session variables trusting
that **express-session** saves them for you.

Invoke this module with an option of `autoSave:true` in order for achieveing the
same behaviour.

```js
io.use(sharedsession(session, {
    autoSave:true
}));
```

## Usage

```js
var session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
});
var sharedsession = require("express-socket.io-session");

// Use express-session middleware for express
app.use(session);

// Use shared session middleware for socket.io
// setting autoSave:true
io.use(sharedsession(session, {
    autoSave:true
})); 
```

**Sharing session data with a namespaced socket**

```js
io.of('/namespace').use(sharedsession(session, {
    autoSave: true
}));
```

**Using your own custom [cookie-parser](https://www.npmjs.com/package/cookie-parser) instance**

```js
...
var cookieParser = require("cookie-parser");
...
io.use(sharedsession(session, cookieParser({
    /* your params to cookie-parser* /
}));
```

## Example

```
$ npm install express socket.io express-session express-socket.io-session
```

**index.js**

```js
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

io.on("connection", function(socket) {
    // Accept a login event with user's data
    socket.on("login", function(userdata) {
        socket.handshake.session.userdata = userdata;
        socket.handshake.session.save();
    });
    socket.on("logout", function(userdata) {
        if (socket.handshake.session.userdata) {
            delete socket.handshake.session.userdata;
            socket.handshake.session.save();
        }
    });        
});

server.listen(3000);
```

## API

```js
var sharedsession = require("express-socket.io-session");
io.use(sharedsession(express_session));
```

### sharedsession( express_session, [cookieparser], [options])

* **express_session** - This parameter is **required** and must be an express middleware function created with the  [express-session](https://www.npmjs.org/package/express-session) module that allows cookie-based sessions over Express.
* **cookieparser** - Optional. If you don't provide en instance created by [cookie-parser](https://www.npmjs.org/package/cookie-parser), this module creates one for you with defaults.
* **options** 
  * **options.autoSave** - Boolean - If true, session will be autosaved if it has been modified
  inside your event handler. Default: `false`.

## Inspiration

* [socket.io and express 4 sessions](http://stackoverflow.com/questions/23494016/socket-io-and-express-4-sessions)
* [Socket.io 1.0.5 : How to save session variables?](http://stackoverflow.com/questions/24290699/socket-io-1-0-5-how-to-save-session-variables/24380110#24380110)

Although there are a couple of modules that allow you to share session objects between express and socket.io,
I wanted to be able to share the modules without affecting regular `express-session` instantiation.

These modules do the same work but with different approachs on initialization.

* [session.socket.io](https://www.npmjs.org/package/session.socket.io) 
* [socket.io-session-middleware](https://github.com/peerigon/socket.io-session-middleware) 


## License 

The MIT License (MIT)

Copyright (c) 2014-2015 osk &lt;oskosk@gmail.com&gt;

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

