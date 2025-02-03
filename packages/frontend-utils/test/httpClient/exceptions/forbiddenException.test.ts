import { expect } from 'chai';
import 'mocha';
import { forbiddenException } from '../../../src/httpClient/exceptions';
import { ForbiddenError } from '../../../src/pageFunctions/httpError';

describe('packages/frontend-utils - http-client/exceptions', () => {
    describe('forbiddenException', () => {
        it('should create object with a message', () => {
            expect(forbiddenException('some message for testing')).to.have.property('message');
        });

        it('should create object with expected message', () => {
            expect(forbiddenException('some message for testing').message).to.equal('some message for testing');
        });

        it('should throw an Error subclass', () => {
            expect(forbiddenException('blah')).to.be.instanceOf(Error);
        });

        it('should throw an ForbiddenError subclass', () => {
            expect(forbiddenException('blah')).to.be.instanceOf(ForbiddenError);
        });
    });
});
