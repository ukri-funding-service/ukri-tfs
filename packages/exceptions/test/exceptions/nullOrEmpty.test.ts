import { describe, expect, it } from '@jest/globals';
import {
    throwIfEmptyArray,
    throwIfEmptyString,
    throwIfNull,
    throwIfNullOrEmpty,
    throwIfUndefined,
    throwIfUndefinedOrNull,
    valueIsEmptyArray,
    valueIsEmptyString,
    valueIsNull,
    valueIsUndefined,
    valueIsUndefinedOrNull,
} from './../../src/exceptions/nullOrEmpty';

describe('exceptions - nullOrEmpty', () => {
    describe('throwIfNullOrEmpty', () => {
        it('should throw Error if an arg is undefined', () => {
            expect(() => throwIfNullOrEmpty('1', '2', undefined)).toThrow('value is undefined');
        });

        it('should throw Error if an arg is null', () => {
            expect(() => throwIfNullOrEmpty('1', '2', null)).toThrow('value is null');
        });

        it('should throw Error if an arg is an empty string', () => {
            expect(() => throwIfNullOrEmpty('1', '2', '')).toThrow('value is empty string');
        });

        it('should throw Error if an arg is an empty array', () => {
            expect(() => throwIfNullOrEmpty('1', '2', [])).toThrow('value is empty array');
        });

        it('should not throw if all args are non-empty, non-null values', () => {
            expect(() => throwIfNullOrEmpty('1', [1], 1, {}, true, BigInt('1'))).not.toThrow();
        });
    });

    describe('throwIfEmptyString', () => {
        it('should throw Error if arg is empty string', () => {
            expect(() => throwIfEmptyString('')).toThrow('value is empty string');
        });

        it('should not throw Error if arg is non-empty string', () => {
            expect(() => throwIfEmptyString('test')).not.toThrow();
        });

        it('should not throw Error if arg is not a string', () => {
            expect(() => throwIfEmptyString(1)).not.toThrow();
        });

        it('should not throw Error if arg is undefined', () => {
            expect(() => throwIfEmptyString(undefined)).not.toThrow();
        });

        it('should not throw Error if arg is null', () => {
            expect(() => throwIfEmptyString(null)).not.toThrow();
        });
    });

    describe('throwIfEmptyArray', () => {
        it('should throw Error if arg is empty array', () => {
            expect(() => throwIfEmptyArray([])).toThrow('value is empty array');
        });

        it('should not throw Error if arg is non-empty array', () => {
            expect(() => throwIfEmptyArray([1])).not.toThrow();
        });

        it('should not throw Error if arg is not an array', () => {
            expect(() => throwIfEmptyArray(1)).not.toThrow();
        });

        it('should not throw Error if arg is undefined', () => {
            expect(() => throwIfEmptyArray(undefined)).not.toThrow();
        });

        it('should not throw Error if arg is null', () => {
            expect(() => throwIfEmptyArray(null)).not.toThrow();
        });
    });

    describe('throwIfUndefined', () => {
        it('should throw Error if arg is undefined', () => {
            expect(() => throwIfUndefined(undefined)).toThrow('value is undefined');
        });

        it('should not throw Error if arg is defined', () => {
            expect(() => throwIfUndefined(1)).not.toThrow();
        });

        it('should not throw Error if arg is null', () => {
            expect(() => throwIfUndefined(null)).not.toThrow();
        });
    });

    describe('throwIfNull', () => {
        it('should throw Error if arg is null', () => {
            expect(() => throwIfNull(null)).toThrow('value is null');
        });

        it('should not throw Error if arg is defined', () => {
            expect(() => throwIfNull(1)).not.toThrow();
        });

        it('should not throw Error if arg is undefined', () => {
            expect(() => throwIfNull(undefined)).not.toThrow();
        });
    });

    describe('valueIsUndefined', () => {
        it('should return true if value is undefined', () => {
            expect(valueIsUndefined(undefined)).toBeTruthy();
        });

        it('should return false if value is defined', () => {
            expect(valueIsUndefined(1)).toBeFalsy();
        });

        it('should return false if value is null', () => {
            expect(valueIsUndefined(null)).toBeFalsy();
        });
    });

    describe('throwIfUndefinedOrNull', () => {
        it('should throw Error if arg is undefined', () => {
            expect(() => throwIfUndefinedOrNull(undefined)).toThrow('value is undefined');
        });

        it('should throw Error if arg is null', () => {
            expect(() => throwIfUndefinedOrNull(null)).toThrow('value is null');
        });

        it('should not throw Error if arg is number', () => {
            expect(() => throwIfUndefinedOrNull(1)).not.toThrow();
        });

        it('should not throw Error if arg is non-empty string', () => {
            expect(() => throwIfUndefinedOrNull('test')).not.toThrow();
        });

        it('should not throw Error if arg is an object', () => {
            expect(() => throwIfUndefinedOrNull({})).not.toThrow();
        });

        it('should not throw Error if arg is a BigInt', () => {
            expect(() => throwIfUndefinedOrNull(BigInt(1))).not.toThrow();
        });
    });

    describe('valueIsNull', () => {
        it('should return true if value is null', () => {
            expect(valueIsNull(null)).toBeTruthy();
        });

        it('should return false if value is defined', () => {
            expect(valueIsNull(1)).toBeFalsy();
        });

        it('should return false if value is undefined', () => {
            expect(valueIsNull(undefined)).toBeFalsy();
        });
    });

    describe('valueIsEmptyString', () => {
        it('should return true if value is empty string', () => {
            expect(valueIsEmptyString('')).toBeTruthy();
        });

        it('should return false if value is non-empty string', () => {
            expect(valueIsEmptyString('test')).toBeFalsy();
        });

        it('should return false if value is not string', () => {
            expect(valueIsEmptyString(1)).toBeFalsy();
        });

        it('should return false if value is undefined', () => {
            expect(valueIsEmptyString(undefined)).toBeFalsy();
        });

        it('should return false if value is null', () => {
            expect(valueIsEmptyString(null)).toBeFalsy();
        });
    });

    describe('valueIsEmptyArray', () => {
        it('should return true if value is empty string', () => {
            expect(valueIsEmptyArray([])).toBeTruthy();
        });

        it('should return false if value is non-empty array', () => {
            expect(valueIsEmptyArray([1])).toBeFalsy();
        });

        it('should return false if value is not array', () => {
            expect(valueIsEmptyArray(1)).toBeFalsy();
        });

        it('should return false if value is undefined', () => {
            expect(valueIsEmptyArray(undefined)).toBeFalsy();
        });

        it('should return false if value is null', () => {
            expect(valueIsEmptyArray(null)).toBeFalsy();
        });
    });

    describe('valueIsUndefinedOrNull', () => {
        it('should return true if value is undefined', () => {
            expect(valueIsUndefinedOrNull(undefined)).toBeTruthy();
        });

        it('should return true if value is null', () => {
            expect(valueIsUndefinedOrNull(null)).toBeTruthy();
        });

        it('should return false if value is defined', () => {
            expect(valueIsUndefinedOrNull(1)).toBeFalsy();
        });
    });
});
