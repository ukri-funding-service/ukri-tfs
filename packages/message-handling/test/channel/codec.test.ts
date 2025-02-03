import { expect } from 'chai';
import { IdentityCodec } from '../../src/codec/codec';
import 'mocha';

describe('packages/message-handling - codec', () => {
    describe('IdentityCodec', () => {
        it('returns what it is given on encode', () => {
            const uut = new IdentityCodec<string>();
            expect(uut.encode('something')).to.equal('something');
        });

        it('returns what it is given on decode', () => {
            const uut = new IdentityCodec<string>();
            expect(uut.decode('something')).to.equal('something');
        });
    });
});
