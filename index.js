var cookieparser = require('cookie-parser');
var debug = require("debug")("express-socket.io-session");
var crc = require("crc").crc32;
// The express session object will be set
// in socket.handskake.session.

/**
 * Returns a middleware function that acts on socket.handshake
 *
 * @param {Function} expressSessionMiddleware - An express-session middleware function to reuse with io.use
 * @param {Function} cookieParserMiddleware - An express-session middleware function to reuse with express-session
 * @param {Object} options - An object with some options for overriding default behaviour.
 *   - {Boolean} autSave - If true, the session variables will be saved asyncrhonously to express-session driver
 *                         by wrapping the method socket.on
 */
module.exports = function(expressSessionMiddleware, cookieParserMiddleware, options) {
  var socketIoSharedSessionMiddleware;

  // Accept options as second argument if only 2 parameters passed
  if (arguments.length == 2 && typeof cookieParserMiddleware === 'object') {
    options = cookieParserMiddleware;
    cookieParserMiddleware = undefined;
  }

  if (typeof cookieParserMiddleware === 'undefined') {
    debug("No cookie-parser instance passed as argument. Creating a cookie-parser " +
      "instance with default values");
    cookieParserMiddleware = cookieparser();
  }
  options = options || {};
  var saveUninitializedSession = options.saveUninitialized;
  debug("Creating socket.io middleware");

  socketIoSharedSessionMiddleware = function(socket, next) {
    var req = socket.handshake;
    var res = {
      end: function() {}
    };
    // originalHash, savedHash, originalId, cookieId
    // are variables present for replicating express-session autoSaving behavioiur
    var originalHash, savedHash;
    var originalId;
    var cookieId;
    var _onevent = socket.onevent;
    // Override socket.on if autoSave = true; 
    if (options.autoSave === true) {
      debug("Using autoSave feature. express-session middleware will be called on every event received")
      socket.onevent = function() {
        debug("Executing socket.onevent monkeypatched by express-socket.io-session");
        var _args = arguments;
        originalHash = savedHash = hash(req.session);
        cookieId = req.sessionID;
        originalId = req.sessionID;
        _onevent.apply(socket, _args);
        if (shouldSave(req)) {
          req.session.save()
        }
      };
    }
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
    /*
     * These functions hash, isModified, isSaved, shouldSave
     * and shouldDestroy are canibalized from express-session
     * in order to this module being able to comply with the autoSave options.
     */

    /**
     * Hash the given `sess` object omitting changes to `.cookie`.
     *
     * @param {Object} sess
     * @return {String}
     * @private
     */

    function hash(sess) {
      return crc(JSON.stringify(sess, function(key, val) {
        if (key !== 'cookie') {
          return val;
        }
      }));
    }

    // check if session has been modified
    function isModified(sess) {
      return originalId !== sess.id || originalHash !== hash(sess);
    }

    // check if session has been saved
    function isSaved(sess) {
      return originalId === sess.id && savedHash === hash(sess);
    }

    // determine if session should be destroyed
    function shouldDestroy(req) {
      return req.sessionID && unsetDestroy && req.session == null;
    }

    // determine if session should be saved to store
    function shouldSave(req) {
      // cannot set cookie without a session ID
      if (typeof req.sessionID !== 'string') {
        debug('session ignored because of bogus req.sessionID %o', req.sessionID);
        return false;
      }

      return !saveUninitializedSession && cookieId !== req.sessionID ? isModified(req.session) : !isSaved(req.session)
    }
  };


  return socketIoSharedSessionMiddleware;
};