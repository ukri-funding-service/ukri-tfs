import { expect } from 'chai';
import 'mocha';
import { methodNotAllowedException } from '../../../src/httpClient/exceptions';
import { MethodNotAllowedError } from '../../../src/pageFunctions/httpError';

describe('packages/frontend-utils - http-client/exceptions', () => {
    describe('methodNotAllowedException', () => {
        it('should create object with a message', () => {
            expect(methodNotAllowedException('some message for testing')).to.have.property('message');
        });

        it('should create object with expected message', () => {
            expect(methodNotAllowedException('some message for testing').message).to.equal('some message for testing');
        });

        it('should throw a MethodNotAllowedError', () => {
            expect(methodNotAllowedException('blah')).to.be.instanceOf(MethodNotAllowedError);
        });
    });
});
