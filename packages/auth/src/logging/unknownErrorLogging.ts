import { LogWithDescription, LogWithError } from './formats';

export const logUnknownWithMessage = (
    loggingFunction: LogWithDescription,
    error: unknown,
    messagePrefix = '',
): void => {
    if (error instanceof Error) {
        loggingFunction(`${messagePrefix}: ${error.message}`);
    } else {
        loggingFunction(JSON.stringify(error));
    }
};

export const logUnknownWithError = (loggingFunction: LogWithError, error: unknown): void => {
    if (error instanceof Error) {
        loggingFunction(error);
    } else {
        loggingFunction(new Error(JSON.stringify(error)));
    }
};
