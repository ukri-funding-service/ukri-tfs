import { beforeEach, describe, expect, it } from '@jest/globals';
import { CodedError } from '../../src/exceptions';

describe('packages/exceptions - exceptions/codedError', () => {
    describe('codedError construction', () => {
        it('should be constructable with a message', () => {
            expect(new CodedError('some message')).not.toBeUndefined();
        });

        it('should be constructable with a message and a code', () => {
            expect(new CodedError('some message', 'SOME_CODE')).not.toBeUndefined();
        });

        it('should be constructable with a message and undefined', () => {
            expect(new CodedError('some message', undefined)).not.toBeUndefined();
        });

        it('should be an Error subclass', () => {
            expect(new CodedError('some message')).toBeInstanceOf(Error);
        });
    });

    describe('codedError accessors', () => {
        const inputs = [
            { message: '', code: '' },
            { message: '', code: 'homer' },
            { message: 'marge', code: '' },
            { message: 'bart', code: 'lisa' },
            { message: '⚙️', code: '♻️' },
        ];

        inputs.forEach(({ message, code }) => {
            let codedError: CodedError;

            beforeEach(() => {
                codedError = new CodedError(message, code);
            });

            it(`should return code '${code}'`, () => {
                expect(codedError.code).toEqual(code);
            });

            it(`should return message '${message}'`, () => {
                expect(codedError.message).toEqual(message);
            });
        });
    });
});
