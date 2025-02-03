import { describe, expect, it } from '@jest/globals';

import { getFlattenedPathParam } from '../../src/request/getFlattenedPathParam';

describe('getFlattenedPathParam path param utility ', () => {
    it('should convert an array into a string', () => {
        const input = ['zero', 'one', 'two'];
        const expected = 'zero';
        const result = getFlattenedPathParam(input);
        expect(result).toBe(expected);
    });

    it('should return the same string if a string is passed', () => {
        const input = 'zero';
        const expected = 'zero';
        const result = getFlattenedPathParam(input);
        expect(result).toBe(expected);
    });
});
