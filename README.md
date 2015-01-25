express-socket.io-session
=========================

Share a cookie-based express-session middleware with socket.io

**THIS MODULE WORKS FINE BUT IS EXPERIMENTAL.**

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


**Using your own custom [cookie-parser](https://www.npmjs.com/package/cookie-parser) instance**
    
    ...
    var cookieParser = require("cookie-parser");
    ...
    io.use(require("express-socket.io-session")(session, cookieParser({/* your params to cookie-parser* /})));

## Example

```
# Install express, socket.io and express-session 
$ npm install express socket.io express-session 
# Install this module
$ npm install express-socket.io-session
```

**index.js**


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

 


## API

This module exports  a **socket.io**'s middleware for using with `io.use()`
You get a *shared session* middleware by requiring the module.

**require("express-socket.io-session")( express_session_middleware, [cookieparser_instance] )**

* `express_session_middleware` is **required** and must be an express middleware function created with the  [express-session](https://www.npmjs.org/package/express-session) module that allows cookie-based sessions.
* `cookieparser_instance` is optional. If you dont provide en instance created by `require("cookie-parser")()`, this module creates one for you with defaults.

##Inspiration

* [socket.io and express 4 sessions](http://stackoverflow.com/questions/23494016/socket-io-and-express-4-sessions)
* [Socket.io 1.0.5 : How to save session variables?](http://stackoverflow.com/questions/24290699/socket-io-1-0-5-how-to-save-session-variables/24380110#24380110)

Although there are a couple of modules that allow to share session objects between express and socket.io,
I wanted to be able to share the modules without affecting regular `express-session` instantiation.

These modules do the same work but with different approachs on initialization.

* [session.socket.io](https://www.npmjs.org/package/session.socket.io) 
* [socket.io-session-middleware](https://github.com/peerigon/socket.io-session-middleware) 


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

