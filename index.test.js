var sharedsession = require('./index');
var hash = require('./lib/hash');

test('hash() hashes predictably', function() {
	expect(hash({ a: 2 })).toBe(2100756332);
});

test('hash() is idempotent', function() {
	expect(hash({ a: 2 })).toBe(hash({ a: 2 }));
});
test('sharedsession() returns a function that accepts two arguments', function() {
	expect(sharedsession()).toHaveLength(2);
});
