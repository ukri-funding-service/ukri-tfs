import { CodedError } from '@ukri-tfs/exceptions';
import { Response } from 'node-fetch';

export const errorCode = 'UNSUPPORTED_MEDIA_TYPE';

export const unsupportedMediaTypeException = (response: Response): CodedError => {
    const errorMessage = response.statusText || 'Unsupported Media Type';
    return new CodedError(errorMessage, errorCode);
};
