import { describe, expect, it } from '@jest/globals';
import { upstreamServiceFailedException } from '../../src/exceptions';

describe('packages/exceptions - exceptions/upstreamServiceFailedException', () => {
    describe('upstreamServiceFailedException', () => {
        it('should throw exception with expected message and no code', () => {
            try {
                upstreamServiceFailedException('some message');
                throw new Error('upstreamServiceFailedException should have thrown');
            } catch (e: unknown) {
                expect(e).toHaveProperty('code', undefined);
                expect(e).toHaveProperty('message', 'some message');
            }
        });

        it('should throw an Error subclass', () => {
            expect(() => upstreamServiceFailedException('some message')).toThrow(Error);
        });
    });

    describe('accessors', () => {
        const inputs = [
            { message: '', expected: '' },
            { message: 'marge', expected: 'marge' },
            { message: '⚙️', expected: '⚙️' },
        ];

        inputs.forEach(({ message, expected }) => {
            it(`should return message '${message}' and code undefined`, () => {
                try {
                    upstreamServiceFailedException(message);
                    throw new Error('upstreamServiceFailedException should have thrown');
                } catch (e: unknown) {
                    expect(e).toHaveProperty('code', undefined);
                    expect(e).toHaveProperty('message', expected);
                }
            });
        });
    });
});
