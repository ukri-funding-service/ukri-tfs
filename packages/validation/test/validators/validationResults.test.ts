import { describe, expect, it } from '@jest/globals';

import { ValidationResults } from '../../src';

describe('isValidDate', () => {
    it('returns true for a valid date', () => {
        const validationResult = new ValidationResults({}, true);
        expect(validationResult.isValidDate('27/01/2022')).toBeTruthy();
    });

    it('returns false for an invalid date', () => {
        const validationResult = new ValidationResults({}, true);
        expect(validationResult.isValidDate(undefined as unknown as string)).toBeFalsy();
        expect(validationResult.isValidDate('01/2022')).toBeFalsy();
        expect(validationResult.isValidDate('27/01/2022 15:20')).toBeFalsy();
        expect(validationResult.isValidDate('2022/01/27')).toBeFalsy();
        expect(validationResult.isValidDate('29/02/2022')).toBeFalsy();
    });
});
