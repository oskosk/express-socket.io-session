express-socket.io-session
=========================

Share a cookie-based express-session middleware with socket.io

**express-socket.io-session** works with **express > 4.0.0** and **socket.io > 1.0.0** and won't be backward compatible.

**Help me notice errors or ask me for improvements [creating an issue](https://github.com/oskosk/express-socket.io-session/issues/new)**.

## Overview

On every socket connection, you'll have the session object at 
**socket.handshake.session** 
That is the same session object `req.session` you get in your route middleware when your app
uses `express-session`.


### Modifying session data inside socket.io event handlers

Don't rely on **session data autosaving** if you use an [async store](https://github.com/expressjs/session#compatible-session-stores) for **express-session**. 

Use [Session.reload()](https://github.com/expressjs/session#sessionreload) and [Session.save()](https://github.com/expressjs/session#sessionsave)
on the `socket.handshake.session` object inside your socket.io event handlers.

**Please, see [More about updating and getting session data](more-about-updating-and-getting-session-data) for better understanding
of how to read and update session data inside your socket.io event handlers**.

## Installation

```
$ npm install express-socket.io-session
```

## Usage

    var session = require("express-session")({
        secret: "my-secret",
        resave: true,
        saveUninitialized: true
    });
    var sharedsession = require("express-socket.io-session")(session);
    

    app.use(session); // Use express-session middleware for express
    
    io.use(sharedsession(session)); // use shared session middleware for socket.io

**Sharing session data with a namespaced socket**

    io.of('/namespace').use(sharedsession(session));


**Using your own custom [cookie-parser](https://www.npmjs.com/package/cookie-parser) instance**
    
    ...
    var cookieParser = require("cookie-parser");
    ...
    io.use(sharedsession(session, cookieParser({
        /* your params to cookie-parser* /
    }));

## Example

```
$ npm install express socket.io express-session express-socket.io-session
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

    io.on("connection", function(socket) {
        // Accept a login event with user's data
        socket.on("login", function(userdata) {
            socket.handshake.session.userdata = userdata;
            socket.handshake.session.save();
        });
        socket.on("logout", function(userdata) {
            if (socket.handshake.session.userdata) {
                delete socket.handshake.session.userdata;
                // Save the data to the session store
            socket.handshake.session.save();
            }
        });        
    });

    server.listen(3000);


## More about updating and getting session data

You may be used to `express-session` behaviour by which, you just
modify the `session` properties and its value gets updated (even with
using asynchronous stores like mongodb or redis). **express-session** achieves that
by monkeypatching (and overloading) `req.end`. 

The case here is that **socket.io middleware is run only once**. On connection handshake.
The event handlers you define can't trigger the middleware. 

So if you get used to accessing and saving session data **inside
your event handlers**, with the `.reload()` 
and `.save()` from the session object you'll do just fine.

By using **express-socket.io-session** you'll find these methods in `socket.handshake.session.get()` and `socket.handshake.session.save()`
when handling an event.


## API

This module exports a middleware function for **socket.io**.
This  **sharedsession** function can be used with the `io.use()` method.

**sharedsession( express_session_middleware, [cookieparser_instance] )**

* `express_session_middleware` is **required** and must be an express middleware function created with the  [express-session](https://www.npmjs.org/package/express-session) module that allows cookie-based sessions.
* `cookieparser_instance` is optional. If you don't provide en instance created by [cookie-parser](https://www.npmjs.org/package/cookie-parser), this module creates one for you with defaults.

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

