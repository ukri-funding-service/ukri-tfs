import { ValidationResult } from '@ukri-tfs/validation';

export const validValidationResult = new ValidationResult(
    null,
    true,
    true,
    'the field is valid',
    'in summary, the field is valid',
    true,
    'valid result',
);

export const invalidValidationResult = new ValidationResult(
    null,
    true,
    false,
    'the field is invalid',
    'in summary, the field is invalid',
    true,
    'invalid result',
);
