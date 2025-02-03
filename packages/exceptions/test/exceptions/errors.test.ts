import { describe, expect, it } from '@jest/globals';
import {
    ForbiddenError,
    InvalidRequestError,
    NotFoundError,
    UnauthorisedError,
    UnexpectedServerError,
} from '../../src/exceptions/errors';

describe('packages/exceptions - exceptions/errors', () => {
    describe('Error construction', () => {
        it('should be constructable ForbiddenError with a message', () => {
            const forbiddenError = new ForbiddenError('some message');
            expect(forbiddenError).toBeInstanceOf(ForbiddenError);
            expect(forbiddenError.message).toBe('some message');
        });

        it('should be constructable NotFoundError with a message', () => {
            const forbiddenError = new NotFoundError('some message');
            expect(forbiddenError).toBeInstanceOf(NotFoundError);
            expect(forbiddenError.message).toBe('some message');
        });

        it('should be constructable InvalidRequestError with a message', () => {
            const forbiddenError = new InvalidRequestError('some message');
            expect(forbiddenError).toBeInstanceOf(InvalidRequestError);
            expect(forbiddenError.message).toBe('some message');
        });

        it('should be constructable UnexpectedServerError with a message', () => {
            const forbiddenError = new UnexpectedServerError('some message');
            expect(forbiddenError).toBeInstanceOf(UnexpectedServerError);
            expect(forbiddenError.message).toBe('some message');
        });

        it('should be constructable UnauthorisedError with a message', () => {
            const forbiddenError = new UnauthorisedError('some message');
            expect(forbiddenError).toBeInstanceOf(UnauthorisedError);
            expect(forbiddenError.message).toBe('some message');
        });
    });
});
