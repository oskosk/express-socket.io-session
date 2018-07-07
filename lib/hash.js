var crc = require('crc').crc32;

/**
 * Hash the given `sess` object omitting changes to `.cookie`.
 *
 * @param {Object} sess
 * @return {String}
 * @private
 */
module.exports = function hash(sess) {
	return crc(
		JSON.stringify(sess, function(key, val) {
			if (key !== 'cookie') {
				return val;
			}
		})
	);
};
