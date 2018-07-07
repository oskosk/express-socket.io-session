const sharedsession = require('./index');
const hash = require('./lib/hash');

test('hash() hashes predictably', () => {
	expect(hash( { a: 2 } ) ).toBe( 2100756332 );
} );

test('hash() is idempotent', () => {
	expect( hash( { a: 2 } ) ).toBe( hash( { a: 2 } ) );
} );
test('sharedsession() returns a function that accepts two arguments', () => {
	expect( sharedsession() ).toHaveLength( 2 );
} );