import { expect, describe, it } from '@jest/globals';
import { isIsoDateTime } from '../../src/dateTime/isIsoDateTime';

describe('dateTime/isIsoDateTimeFormat', () => {
    it('rejects non string', () => {
        expect(isIsoDateTime(null)).toBe(false);
        expect(isIsoDateTime(undefined)).toBe(false);
        expect(isIsoDateTime(123)).toBe(false);
        expect(isIsoDateTime({})).toBe(false);
        expect(isIsoDateTime([])).toBe(false);
    });

    it('accepts ISO date time string', () => {
        expect(isIsoDateTime(new Date().toISOString())).toBe(true);
    });

    it('rejects non ISO date time string', () => {
        expect(isIsoDateTime('not a date')).toBe(false);
    });
});
