import { describe, expect, it } from '@jest/globals';
import { containsSubset, setsAreTheSame } from '../../src/set';

describe('set utils', () => {
    describe('exact set comparison', () => {
        it('two blank sets are the same', () => {
            expect(setsAreTheSame(new Set([]), new Set([]))).toBeTruthy();
        });
        it('two sets with one thing in them are the same', () => {
            expect(setsAreTheSame(new Set([1]), new Set([1]))).toBeTruthy();
        });

        it('two sets with one thing in them are not the same', () => {
            expect(setsAreTheSame(new Set([1]), new Set([2]))).toBeFalsy();
        });

        it('two sets with one thing in them are not the same', () => {
            expect(setsAreTheSame(new Set([2, 1]), new Set([1, 2]))).toBeTruthy();
        });

        it('two different size sets are not the same', () => {
            expect(setsAreTheSame(new Set([1, 2]), new Set([2, 3, 1]))).toBeFalsy();
        });

        it('two different size sets are not the same', () => {
            expect(setsAreTheSame(new Set([1, 2, 3, 4]), new Set([5, 6, 7, 8]))).toBeFalsy();
        });

        it('same size partially same contents is not the same set', () => {
            expect(
                setsAreTheSame(new Set([1, 2, 3, 4, 5, 6, 7, 8]), new Set([1, 2, 3, 4, 11, 12, 13, 14])),
            ).toBeFalsy();
        });

        it('different type contents can be in sets that are the same', () => {
            expect(setsAreTheSame(new Set([1, 'a']), new Set(['a', 1]))).toBeTruthy();
        });
    });
    describe('contains subset', () => {
        it('1 is a subset of 1,2', () => {
            expect(containsSubset(new Set([1]), new Set([1, 2]))).toBe(true);
        });

        it('1 is not a subset of 3,2', () => {
            expect(containsSubset(new Set([1]), new Set([3, 2]))).toBe(false);
        });

        it('subset not same as completely different set', () => {
            expect(containsSubset(new Set([1, 4]), new Set([3, 2]))).toBe(false);
        });

        it('1,4 is a subset of 1,4', () => {
            expect(containsSubset(new Set([1, 4]), new Set([1, 4]))).toBe(true);
        });

        it('1,2,3 is not a subset of 1,2', () => {
            expect(containsSubset(new Set([1, 2, 3]), new Set([1, 2]))).toBe(false);
        });

        it('empty is a subset of empty', () => {
            expect(containsSubset(new Set([]), new Set([]))).toBe(true);
        });
    });
});
