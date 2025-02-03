import { CodedError } from '@ukri-tfs/exceptions';

export const resourceNotFoundException = (message: string): CodedError => {
    return new CodedError(message, 'ENOENT');
};
