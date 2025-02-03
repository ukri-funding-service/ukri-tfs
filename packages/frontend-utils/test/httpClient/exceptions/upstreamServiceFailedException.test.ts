import { fail } from 'assert';
import { expect } from 'chai';
import 'mocha';
import { upstreamServiceFailedException } from '../../../src/httpClient/exceptions/upstreamServiceFailedException';

describe('packages/frontend-utils - http-client/exceptions/upstreamServiceFailedException', () => {
    describe('simple factory functions', () => {
        it('should throw exception with expected message', () => {
            try {
                const theError = upstreamServiceFailedException('some test message');
                expect(theError).to.have.property('message', 'some test message');
            } catch (err) {
                fail('Should not throw error');
            }
        });

        it('should throw an Error subclass', () => {
            try {
                const theError = upstreamServiceFailedException('some test message');
                expect(theError).to.be.instanceOf(Error);
            } catch (err) {
                fail('Should not throw error');
            }
        });
    });
});
