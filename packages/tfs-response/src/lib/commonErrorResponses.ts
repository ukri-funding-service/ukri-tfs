import { ErrorResponse } from '.';

export const badRequest = (message: string): ErrorResponse => {
    return {
        statusCode: 400,
        error: 'Bad Request',
        message,
    };
};

export const forbidden = (message: string): ErrorResponse => {
    return {
        statusCode: 403,
        error: 'Forbidden',
        message,
    };
};
export const notFound = (message: string): ErrorResponse => {
    return {
        statusCode: 404,
        error: 'Not Found',
        message,
    };
};

export const conflict = (message: string): ErrorResponse => {
    return {
        statusCode: 409,
        error: 'Conflict',
        message,
    };
};

export const unprocessableEntity = (message: string): ErrorResponse => {
    return {
        statusCode: 422,
        error: 'Unprocessable Entity',
        message,
    };
};

export const internalServerError = (message: string): ErrorResponse => {
    return {
        statusCode: 500,
        error: 'Internal Server Error',
        message,
    };
};

export const gatewayTimeout = (message: string): ErrorResponse => {
    return {
        statusCode: 504,
        error: 'Gateway Timeout',
        message,
    };
};
