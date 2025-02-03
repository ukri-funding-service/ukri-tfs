import { CodedError } from '@ukri-tfs/exceptions';

export const conflictErrorCode = 'CONFLICT';

export const conflictException = (): CodedError => {
    return new CodedError(conflictErrorCode, conflictErrorCode);
};
