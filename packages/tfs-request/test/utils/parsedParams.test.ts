import {
    singleValueParamAsInteger,
    singleValueParamAsString,
    WrongNumberOfParametersError,
} from '../../src/utils/parsedParams';

describe('parsed params to integer', () => {
    describe('tfs-request/singleValueParamAsInteger', () => {
        describe('Single string', () => {
            it('converts the string 123 to an integer', () => {
                const result = singleValueParamAsInteger('123');

                expect(result).toBe(123);
            });
            it('converts the string 456 to an integer', () => {
                const result = singleValueParamAsInteger('456');

                expect(result).toBe(456);
            });
        });
        describe('Array of strings', () => {
            it('converts an array with length one', () => {
                const result = singleValueParamAsInteger(['1112']);

                expect(result).toBe(1112);
            });

            it('throws a WrongNumberOfParametersError if the array has multiple elements', () => {
                expect(() => singleValueParamAsInteger(['1112', '2232'])).toThrow(
                    new WrongNumberOfParametersError('Error: Expected 1 parameter received 2'),
                );
            });

            it('throws a WrongNumberOfParametersError if the array has no elements', () => {
                expect(() => singleValueParamAsInteger([])).toThrow(
                    new WrongNumberOfParametersError('Error: Expected 1 parameter received 0'),
                );
            });
        });
        describe('Undefined', () => {
            it('a value of undefined results in NaN', () => {
                const result = singleValueParamAsInteger(undefined);

                expect(result).toBe(NaN);
            });
        });
    });
});

describe('parsed params to string', () => {
    describe('tfs-request/singleValueParamAsString', () => {
        describe('Single string', () => {
            it('returns the string SomeString', () => {
                const result = singleValueParamAsString('SomeString');

                expect(result).toBe('SomeString');
            });

            it('returns the string SomeOtherString', () => {
                const result = singleValueParamAsString('SomeOtherString');

                expect(result).toBe('SomeOtherString');
            });
        });
        describe('Array of strings', () => {
            it('returns the element in a single element array', () => {
                const result = singleValueParamAsString(['SomeString']);

                expect(result).toBe('SomeString');
            });

            it('throws a WrongNumberOfParametersError if the array has multiple elements', () => {
                expect(() => singleValueParamAsString(['stringone', 'stringtwo'])).toThrow(
                    new WrongNumberOfParametersError('Error: Expected 1 parameter received 2'),
                );
            });

            it('throws a WrongNumberOfParametersError if the array has no elements', () => {
                expect(() => singleValueParamAsString([])).toThrow(
                    new WrongNumberOfParametersError('Error: Expected 1 parameter received 0'),
                );
            });
        });

        describe('Undefined', () => {
            it('a value of undefined results in the string undefined', () => {
                const result = singleValueParamAsString(undefined);

                expect(result).toBe('undefined');
            });
        });
    });
});
