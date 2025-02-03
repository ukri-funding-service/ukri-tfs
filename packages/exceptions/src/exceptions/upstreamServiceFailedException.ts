import { CodedError } from './codedError';

export const upstreamServiceFailedException = (message: string): never => {
    throw new CodedError(message);
};
