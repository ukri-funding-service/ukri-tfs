import { expect } from 'chai';
import 'mocha';
import { badRequestException } from '../../../src/httpClient/exceptions';

describe('packages/frontend-utils - http-client/exceptions', () => {
    describe('badRequestException', () => {
        it('should create error with expected message', () => {
            expect(badRequestException('test message')).to.have.property('message', 'test message');
        });

        it('should create error with expected code', () => {
            expect(badRequestException('test message')).to.have.property('code', 'BAD_REQUEST');
        });

        it('should throw an Error subclass', () => {
            expect(badRequestException('blah')).to.be.instanceOf(Error);
        });
    });

    describe('accessors', () => {
        const inputs = [{ message: '' }, { message: 'marge' }, { message: '⚙️' }];

        inputs.forEach(({ message }) => {
            it(`should return message '${message}'`, () => {
                expect(badRequestException(message)).to.have.property('message', message);
            });
            it(`should return code 'ENOENT'`, () => {
                expect(badRequestException(message)).to.have.property('code', 'BAD_REQUEST');
            });
        });
    });
});
