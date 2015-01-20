var cookieParser = require('cookie-parser')();
var debug = require("debug")("express-socket.io-session");
/*
 * Inspiration
 * ============
 *
 * [socket.io and express 4 sessions]
 * http://stackoverflow.com/questions/23494016/socket-io-and-express-4-sessions
 *
 * [Socket.io 1.0.5 : How to save session variables?]
 * http://stackoverflow.com/questions/24290699/socket-io-1-0-5-how-to-save-session-variables/24380110#24380110
 *
 * sesion.socket.io
 * ----------------
 * I don't like this one because you can not reuse
 * https://www.npmjs.org/package/session.socket.io
 */

// The express session object will be set
// in socket.handskake.session.

/**
 * Returns a middleware function that acts on socket.handshake
 *
 * @param {Function} an express-session middleware function
 */
module.exports = function(session) {
  debug("Creating socket.io middleware");
  return function(socket, next) {
    var req = socket.handshake;
    var res = {};
    //Parse session cookie
    cookieParser(req, res, function(err) {
      if (err) {
        debug("cookieParser errored");
        return next(err);
      }
      session(req, res, function(req, res) {
        next()
      });
    });
  };
}
