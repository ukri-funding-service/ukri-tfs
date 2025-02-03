import { describe, expect, it } from '@jest/globals';
import { parseOpp } from '../../src';

describe('parseOpp', () => {
    it('should return number from display id', () => {
        expect(parseOpp('OPP123')).toEqual(123);
    });
});
