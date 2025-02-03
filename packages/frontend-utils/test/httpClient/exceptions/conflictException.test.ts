import { expect } from 'chai';
import 'mocha';
import { conflictException } from '../../../src/httpClient/exceptions';

describe('packages/frontend-utils - http-client/exceptions', () => {
    describe('conflictException', () => {
        it('should throw exception with expected code', () => {
            expect(conflictException()).to.have.property('code', 'CONFLICT');
        });

        it('should throw exception with expected message', () => {
            expect(conflictException()).to.have.property('message', 'CONFLICT');
        });

        it('should throw an Error subclass', () => {
            expect(conflictException()).to.be.instanceOf(Error);
        });
    });
});
