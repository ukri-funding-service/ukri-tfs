import { CodedError } from '@ukri-tfs/exceptions';
import { Response } from 'node-fetch';

export const errorCode = 'PAYLOAD_TOO_LARGE';

export const payloadTooLargeException = (response: Response): CodedError => {
    const errorMessage = response.statusText || 'Payload too large';
    return new CodedError(errorMessage, errorCode);
};
