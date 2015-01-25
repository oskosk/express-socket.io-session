var cookieparser = require('cookie-parser');
var debug = require("debug")("express-socket.io-session");

// The express session object will be set
// in socket.handskake.session.

/**
 * Returns a middleware function that acts on socket.handshake
 *
 * @param {Function} an express-session middleware function to reuse with io.use
 * @param {Function} an express-session middleware function to reuse with express-session
 */
module.exports = function(expressSessionMiddleware, cookieParserMiddleware) {
  var socketIoSharedSessionMiddleware;

  if (typeof cookieParserMiddleware === 'undefined') {
    debug("No cookie-parser instance passed as argument");
    debug("Creating a cookie-parser instance with default values");
    cookieParserMiddleware = cookieparser();
  }
  debug("Creating socket.io middleware");

  socketIoSharedSessionMiddleware = function(socket, next) {
    var req = socket.handshake;
    var res = {};
    //Parse session cookie
    cookieParserMiddleware(req, res, function(err) {
      if (err) {
        debug("cookieParser errored");
        return next(err);
      }
      expressSessionMiddleware(req, res, function(req, res) {
        next();
      });
    });
  };
  return socketIoSharedSessionMiddleware;
};