import { describe, expect, it } from '@jest/globals';
import * as commonErrorResponses from '../../src';
import { ErrorResponse } from '../../src';

describe('packages/tfs-response - lib/commonErrorResponses', () => {
    it('should construct a 400 Bad Request error response', () => {
        const req = commonErrorResponses.badRequest('some reason');

        const expected: ErrorResponse = {
            statusCode: 400,
            error: 'Bad Request',
            message: 'some reason',
        };

        expect(req).toEqual(expected);
    });

    it('should construct a 403 Forbidden error response', () => {
        const req = commonErrorResponses.forbidden('some reason');

        const expected: ErrorResponse = {
            statusCode: 403,
            error: 'Forbidden',
            message: 'some reason',
        };

        expect(req).toEqual(expected);
    });

    it('should construct a 404 Forbidden error response', () => {
        const req = commonErrorResponses.notFound('some reason');

        const expected: ErrorResponse = {
            statusCode: 404,
            error: 'Not Found',
            message: 'some reason',
        };

        expect(req).toEqual(expected);
    });

    it('should construct a 404 Forbidden error response', () => {
        const req = commonErrorResponses.conflict('some reason');

        const expected: ErrorResponse = {
            statusCode: 409,
            error: 'Conflict',
            message: 'some reason',
        };

        expect(req).toEqual(expected);
    });

    it('should construct a 500 Internal Server Error response', () => {
        const req = commonErrorResponses.internalServerError('some reason');

        const expected: ErrorResponse = {
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'some reason',
        };

        expect(req).toEqual(expected);
    });

    it('should construct a 504 Gateway Timeout response', () => {
        const req = commonErrorResponses.gatewayTimeout('some reason');

        const expected: ErrorResponse = {
            statusCode: 504,
            error: 'Gateway Timeout',
            message: 'some reason',
        };

        expect(req).toEqual(expected);
    });

    it('should construct a 422 Unprocessable Entity response', () => {
        const req = commonErrorResponses.unprocessableEntity('some reason');

        const expected: ErrorResponse = {
            statusCode: 422,
            error: 'Unprocessable Entity',
            message: 'some reason',
        };

        expect(req).toEqual(expected);
    });
});
