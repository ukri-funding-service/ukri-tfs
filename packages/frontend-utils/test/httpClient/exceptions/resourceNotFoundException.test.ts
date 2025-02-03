import { expect } from 'chai';
import 'mocha';
import { resourceNotFoundException } from '../../../src/httpClient/exceptions';

describe('packages/frontend-utils - http-client/exceptions', () => {
    describe('resourceNotFoundException', () => {
        it('should create error with expected message', () => {
            expect(resourceNotFoundException('test message')).to.have.property('message', 'test message');
        });

        it('should create error with expected code', () => {
            expect(resourceNotFoundException('test message')).to.have.property('code', 'ENOENT');
        });

        it('should throw an Error subclass', () => {
            expect(resourceNotFoundException('blah')).to.be.instanceOf(Error);
        });
    });

    describe('accessors', () => {
        const inputs = [{ message: '' }, { message: 'marge' }, { message: '⚙️' }];

        inputs.forEach(({ message }) => {
            it(`should return message '${message}'`, () => {
                expect(resourceNotFoundException(message)).to.have.property('message', message);
            });
            it(`should return code 'ENOENT'`, () => {
                expect(resourceNotFoundException(message)).to.have.property('code', 'ENOENT');
            });
        });
    });
});
