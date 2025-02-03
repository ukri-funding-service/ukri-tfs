import { CodedError } from './codedError';

export const resourceNotFoundException = (message: string): never => {
    throw new CodedError(message, 'ENOENT');
};
