// TODO replace this with http-errors module
import { BAD_REQUEST, FORBIDDEN, METHOD_NOT_ALLOWED, NOT_FOUND } from 'http-status-codes';

export class HttpError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message?: string) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }

    static isError = (statusCode: number): boolean => statusCode >= 400;
}

export class ForbiddenError extends HttpError {
    constructor(message?: string) {
        super(FORBIDDEN, message);
    }
}

export class BadRequestError extends HttpError {
    constructor(message?: string) {
        super(BAD_REQUEST, message);
    }
}

export class MethodNotAllowedError extends HttpError {
    constructor(message?: string) {
        super(METHOD_NOT_ALLOWED, message);
    }
}

export class NotFoundError extends HttpError {
    constructor(message?: string) {
        super(NOT_FOUND, message);
    }
}
