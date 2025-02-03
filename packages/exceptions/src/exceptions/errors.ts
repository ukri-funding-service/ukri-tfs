export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class InvalidRequestError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidRequestError.prototype);
    }
}

export class UnexpectedServerError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, UnexpectedServerError.prototype);
    }
}

export class UnauthorisedError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, UnauthorisedError.prototype);
    }
}

export class ForbiddenError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}
