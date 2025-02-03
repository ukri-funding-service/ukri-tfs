import { CodedError } from '@ukri-tfs/exceptions';

export const validationFailedException = (body?: { message?: string; code?: string }): CodedError => {
    let validationError = 'Validation failed';
    if (body && body.message) {
        validationError = body.message;
    }

    return new CodedError(validationError, (body && body.code) || 'VALIDATION');
};
