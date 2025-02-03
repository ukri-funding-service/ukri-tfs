import { expect } from 'chai';
import 'mocha';
import { validationFailedException } from '../../../src/httpClient/exceptions/validationFailedException';
import { CodedError } from '@ukri-tfs/exceptions';

describe('packages/frontend-utils - http-client/exceptions/validationFailedException', () => {
    describe('simple factory functions', () => {
        it('should throw exception with expected code', () => {
            expect(validationFailedException()).to.have.property('code', 'VALIDATION');
        });

        it('should throw exception with expected message', () => {
            expect(validationFailedException()).to.have.property('message', 'Validation failed');
        });

        it('should throw an Error subclass', () => {
            expect(validationFailedException()).to.be.instanceOf(Error);
        });
    });

    describe('accessors', () => {
        const inputs = [
            { body: {}, expected: 'Validation failed' },
            { body: { message: '' }, expected: 'Validation failed' },
            { body: { message: undefined }, expected: 'Validation failed' },
            { body: { message: 'marge' }, expected: 'marge' },
            { body: { message: '⚙️' }, expected: '⚙️' },
        ];

        inputs.forEach(({ body, expected }) => {
            it(`should return message code 'VALIDATION'`, () => {
                expect(validationFailedException(body)).to.have.property('code', 'VALIDATION');
            });

            it(`should return message '${JSON.stringify(body)}'`, () => {
                expect(validationFailedException(body)).to.have.property('message', expected);
            });

            it('should throw an Error subclass', () => {
                expect(validationFailedException(body)).to.be.instanceOf(Error);
            });
        });

        it('pass code', () => {
            const body = {
                message: 'dummyMessage',
                code: 'dummyCode',
            };
            const actual = validationFailedException(body);

            expect(actual).to.have.property('code', body.code);
            expect(actual).to.have.property('message', body.message);
            expect(actual).to.be.instanceOf(CodedError);
        });
    });
});
