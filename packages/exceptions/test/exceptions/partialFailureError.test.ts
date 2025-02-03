import { describe, expect, it } from '@jest/globals';
import { PartialFailureError } from '../../src/exceptions';

describe('packages/exceptions - exceptions/PartialFailureError', () => {
    describe('codedError accessors', () => {
        it(`an unknown number of possibleTotalErrors results in failurePercent being NaN`, () => {
            const partialFailureError = new PartialFailureError('message', []);
            expect(partialFailureError.failurePercent).toBeNaN();
        });

        it(`a known number of possibleTotalErrors resulting in 50% failurePercent`, () => {
            const partialFailureError = new PartialFailureError('message', ['error1', 'error2'], 4);
            expect(partialFailureError.failurePercent).toBe(0.5);
        });
    });
});
