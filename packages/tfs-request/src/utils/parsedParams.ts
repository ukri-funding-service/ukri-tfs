export class WrongNumberOfParametersError extends Error {}

export const singleValueParamAsInteger = (stringToConvert: string | string[] | undefined): number => {
    if (stringToConvert === undefined) {
        return NaN;
    }
    const isArray = Array.isArray(stringToConvert);

    if (isArray && stringToConvert.length === 1) {
        return parseInt(stringToConvert[0]);
    } else if (isArray) {
        throw new WrongNumberOfParametersError(`Error: Expected 1 parameter received ${stringToConvert.length}`);
    } else {
        return parseInt(stringToConvert);
    }
};

export const singleValueParamAsString = (input: string | string[] | undefined): string => {
    if (input === undefined) {
        return 'undefined';
    }
    const isArray = Array.isArray(input);

    if (isArray && input.length === 1) {
        return input[0];
    } else if (isArray) {
        throw new WrongNumberOfParametersError(`Error: Expected 1 parameter received ${input.length}`);
    } else {
        return input;
    }
};
