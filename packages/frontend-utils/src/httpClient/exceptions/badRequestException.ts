import { CodedError } from '@ukri-tfs/exceptions';

export const errorCode = 'BAD_REQUEST';

export const badRequestException = (message: string): CodedError => {
    return new CodedError(message, errorCode);
};

// Deprecated. Due to throwing JSON payload without encapsulating it.
export const DEPRECATED_BadRequestException = (message: string): string => {
    return message;
};
