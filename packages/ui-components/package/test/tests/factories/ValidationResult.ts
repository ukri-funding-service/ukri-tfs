import { ValidationResult } from '@ukri-tfs/validation';
export const validErrorMessage = 'the field is valid';
export const validErrorSummary = 'in summary, the field is valid';
export const validResult = new ValidationResult(
    null,
    true,
    true,
    validErrorMessage,
    validErrorSummary,
    true,
    'valid result',
);
export const invalidErrorMessage = 'the field is invalid';
export const invalidErrorSummary = 'in summary, the field is invalid';
export const invalidResult = new ValidationResult(
    null,
    true,
    false,
    invalidErrorMessage,
    invalidErrorSummary,
    true,
    'invalid result',
);
