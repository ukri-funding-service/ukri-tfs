import { expect } from 'chai';
import 'mocha';
import { DEPRECATED_BadRequestException } from '../../../src/httpClient/exceptions/badRequestException';

describe('packages/frontend-utils - http-client/exceptions', () => {
    describe('badRequestException', () => {
        it('should create error with expected message', () => {
            expect(DEPRECATED_BadRequestException('test message')).to.equal('test message');
        });

        it('should throw an string', () => {
            expect(DEPRECATED_BadRequestException('blah')).to.be.a('string');
        });
    });

    describe('accessors', () => {
        const inputs = [{ message: '' }, { message: 'marge' }, { message: '⚙️' }];

        inputs.forEach(({ message }) => {
            it(`should return message '${message}'`, () => {
                expect(DEPRECATED_BadRequestException(message)).to.equal(message);
            });
        });
    });
});
