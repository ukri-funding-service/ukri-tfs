import { describe, expect, it } from '@jest/globals';
import { CodedError, resourceNotFoundException } from '../../src/exceptions';

describe('packages/exceptions - exceptions/resourceNotFoundException', () => {
    describe('resourceNotFoundException', () => {
        it('should throw exception with expected message and code', () => {
            try {
                resourceNotFoundException('some message');
                throw new Error('resourceNotFoundException should have thrown');
            } catch (e: unknown) {
                expect(e).toHaveProperty('code', 'ENOENT');
                expect(e).toHaveProperty('message', 'some message');
            }
        });

        it('should throw an Error subclass', () => {
            expect(() => resourceNotFoundException('some message')).toThrow(Error);
        });
    });

    describe('accessors', () => {
        const inputs = [{ message: '' }, { message: 'marge' }, { message: '⚙️' }];

        inputs.forEach(({ message }) => {
            it(`should return message '${message}' and code 'ENOENT'`, () => {
                try {
                    resourceNotFoundException(message);
                    throw new Error('resourceNotFoundException should have thrown');
                } catch (e: unknown) {
                    if (e instanceof CodedError) {
                        expect(e.message).toBe(message);
                        expect(e.code).toBe('ENOENT');
                    } else {
                        throw new Error('threw wrong type of error');
                    }
                }
            });
        });
    });
});
