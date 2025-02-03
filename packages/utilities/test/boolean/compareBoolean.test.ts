import { describe, expect, it } from '@jest/globals';
import { compareBooleans } from '../../src/boolean/compareBoolean';

describe('Filter and sort applicants: compareBooleans', () => {
    it('will return zero if both arguments are true', () => {
        const booleanA = true;
        const booleanB = true;

        const result = compareBooleans(booleanA, booleanB);

        expect(result).toEqual(0);
    });

    it('will return zero if both arguments are false', () => {
        const booleanA = false;
        const booleanB = false;

        const result = compareBooleans(booleanA, booleanB);

        expect(result).toEqual(0);
    });

    it('will return -1 if first argument is true and second is false', () => {
        const booleanA = true;
        const booleanB = false;

        const result = compareBooleans(booleanA, booleanB);

        expect(result).toEqual(-1);
    });

    it('will return 1 if first argument is false and second is true', () => {
        const booleanA = false;
        const booleanB = true;

        const result = compareBooleans(booleanA, booleanB);

        expect(result).toEqual(1);
    });
});
