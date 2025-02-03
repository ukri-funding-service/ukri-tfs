export { ValidationErrorCode } from './ValidationErrorCode';
export { ValidationResult } from './validationResult';
export { ValidationResults } from './validationResults';

import { errorFormat } from '../errors';
import * as rules from './rules';
export const Rules = { ...rules };
export const getFieldErrors = (errors: errorFormat[], fieldName: string): errorFormat[] => {
    return errors.filter(error => error.fieldName === fieldName);
};
