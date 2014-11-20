var cookieParser = require('cookie-parser')();
var debug = require("debug")("express-socket.io-session");

// The express session object will be set
// in socket.handskake.session.

/**
 * Returns a middleware function that acts on socket.handshake
 *
 * @param {Function} an express-session middleware function
 */
module.exports = function(session) {
  return function(socket, next) {
    var req = socket.handshake;
    var res = {};
    //Parse session cookie
    cookieParser(req, res, function(err) {
      if (err) {
        debug("cookieParser errored");
        return next(err);
      }
      session(req, res, next);
    });
  };
}
