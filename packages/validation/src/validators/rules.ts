import { unsafeRemoveMarkup } from '../utils/text';
import { ValidationResult } from './validationResult';
import { ValidationResults } from './validationResults';

function rule<T>(
    test: { (value: T): boolean },
    defaultMessage: string,
    defaultSummary: string,
    isRequired?: boolean,
): {
    (
        results: ValidationResults<{}>,
        value: T,
        message?: string,
        summary?: string,
        fieldName?: string,
    ): ValidationResult;
} {
    return (
        results: ValidationResults<{}>,
        value: T,
        message?: string,
        summary?: string,
        fieldName?: string,
    ): ValidationResult => {
        return new ValidationResult(
            results,
            results.showValidationErrors(),
            test(value),
            message || defaultMessage,
            summary || defaultSummary,
            isRequired || false,
            fieldName,
        );
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const required = rule<any>(
    (value): boolean => {
        if (value === null || value === undefined) return false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (value.__proto__ === ('' as any).__proto__) return value.trim().length > 0;
        if (value instanceof Array) return value.length > 0;
        if (Number.isNaN(value)) return false;
        return true;
    },
    'Required',
    'Required',
    true,
);

export const isTrue = rule<boolean | undefined | null>(
    (value): boolean => value !== null && value !== undefined && value === true,
    'Should be true',
    'Should be true',
);

export const isFalse = rule<boolean | undefined | null>(
    (value): boolean => value === null || value === undefined || value === false,
    'Should be false',
    'Should be false',
);

export const nonZero = rule<number | undefined>(
    (value): boolean => !!value && value !== undefined && value > 0,
    'Must be non-zero',
    'Must be non-zero',
);

export function minLength(
    results: ValidationResults<{}>,
    value: string,
    minLen: number,
    message?: string,
    summary?: string,
    fieldName?: string,
): ValidationResult {
    return isTrue(
        results,
        value !== null && value !== undefined && value.length >= minLen,
        message || `Minimum of ${minLen} characters`,
        summary || 'Minimum characters not met',
        fieldName,
    );
}

export function minLengthHtml(
    results: ValidationResults<{}>,
    value: string,
    minLen: number,
    message?: string,
    summary?: string,
    fieldName?: string,
): ValidationResult {
    const valueStripped = unsafeRemoveMarkup(value).trim().replace(/\s\s+/g, ' ') ?? '';
    return minLength(results, valueStripped, minLen, message, summary, fieldName);
}

export function maxLength(
    results: ValidationResults<{}>,
    value: string,
    maxLen: number,
    message?: string,
    summary?: string,
    fieldName?: string,
): ValidationResult {
    return isTrue(
        results,
        value !== null && value !== undefined && value.length <= maxLen,
        message || `Maximum of ${maxLen} characters`,
        summary || 'Maximum characters exceeded',
        fieldName,
    );
}

export function maxLengthHtml(
    results: ValidationResults<{}>,
    value: string,
    maxLen: number,
    message?: string,
    summary?: string,
    fieldName?: string,
): ValidationResult {
    const valueStripped = unsafeRemoveMarkup(value).trim().replace(/\s\s+/g, ' ') ?? '';
    return maxLength(results, valueStripped, maxLen, message, summary, fieldName);
}

export function maxLengthStripHtml(value: string, maxLen: number): boolean {
    const valueStripped = unsafeRemoveMarkup(value).trim().replace(/\s\s+/g, ' ') ?? '';
    return valueStripped.length <= maxLen;
}

export function minRange(
    results: ValidationResults<{}>,
    value: number,
    minLen: number,
    message?: string,
    summary?: string,
    fieldName?: string,
): ValidationResult {
    return isTrue(
        results,
        value >= minLen,
        message || `Minimum of ${minLen}`,
        summary || 'Minimum value not met',
        fieldName,
    );
}

export function maxRange(
    results: ValidationResults<{}>,
    value: number,
    maxLen: number,
    message?: string,
    summary?: string,
    fieldName?: string,
): ValidationResult {
    return isTrue(
        results,
        value <= maxLen,
        message || `Maximum of ${maxLen}`,
        summary || 'Maximum value exceeded',
        fieldName,
    );
}

export function valid(resultSet: ValidationResults<{}>, fieldName?: string): ValidationResult {
    return new ValidationResult(null, resultSet.showValidationErrors(), true, '', '', false, fieldName);
}
export function invalid(resultSet: ValidationResults<{}>, result: ValidationResult): ValidationResult {
    return new ValidationResult(
        null,
        resultSet.showValidationErrors(),
        false,
        result.errorMessage,
        result.errorSummary,
        false,
        result.fieldName,
    );
}
export function allWithFieldName(
    resultSet: ValidationResults<{}>,
    fieldName?: string,
    ...results: { (): ValidationResult }[]
): ValidationResult {
    for (let i = 0; i < results.length; i++) {
        const result = results[i]();
        if (!result.isValid()) {
            return invalid(resultSet, result);
        }
    }
    return valid(resultSet, fieldName);
}

export function all(resultSet: ValidationResults<{}>, ...results: { (): ValidationResult }[]): ValidationResult {
    return allWithFieldName(resultSet, '', ...results);
}

export function collection(resultSet: ValidationResults<{}>, validators: ValidationResults<{}>[]): ValidationResult[] {
    return validators.reduce((acc, cur): ValidationResult[] => {
        if (!cur.isValid()) {
            cur.errorList().forEach((e): void => {
                resultSet.add(e);
                acc.push(e);
            });
        }
        return acc;
    }, [] as ValidationResult[]);
}
