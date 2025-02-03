import { JwtVerificationErrors } from '../../..';

export class JwtValidationError extends Error {
    constructor(m: string, public errorCode: JwtVerificationErrors) {
        super(m) /* istanbul ignore next */; // coverage bug

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
