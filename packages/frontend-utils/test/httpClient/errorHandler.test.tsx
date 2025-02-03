import * as chai from 'chai';
import 'mocha';
import { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';
import { errorHandler } from '../../src/httpClient';
import { ForbiddenError, HttpError, MethodNotAllowedError } from '../../src/pageFunctions/httpError';
import { Response } from 'node-fetch';

describe('Http client error handler tests', () => {
    chai.should();
    chai.use(chaiAsPromised);

    it('400 code should result in message with same payload as response', async () => {
        const mockPayload = { something: 'in the response body' };
        const response = { status: 400, url: 'url', json: async () => mockPayload } as Response;

        try {
            await errorHandler(response);
            expect.fail('Expected a rejection from the errorHandler');
        } catch (err) {
            expect(err).to.deep.equal({ something: 'in the response body' });
        }
    });

    it('401 code should map to HttpError', async () => {
        await expect(errorHandler({ status: 401, url: 'url' } as Response)).to.be.rejectedWith(
            HttpError,
            `Invalid/unspecified authentication credentials for "url"`,
        );
    });

    it('403 code should map to ForbiddenError', async () => {
        await expect(errorHandler({ status: 403, url: 'url' } as Response)).to.be.rejectedWith(
            ForbiddenError,
            `User is not authorised`,
        );
    });

    it('405 code should map to MethodNotAllowedError', async () => {
        await expect(
            errorHandler({ status: 405, url: 'url', text: () => Promise.resolve('response text') } as Response),
        ).to.be.rejectedWith(MethodNotAllowedError, `response text`);
    });

    it('413 code should map to PayloadTooLargeException', async () => {
        await expect(
            errorHandler({ status: 413, url: 'url', json: () => Promise.resolve('json') } as Response),
        ).to.be.rejectedWith(Error, `Payload too large`);
    });

    it('415 code should map to UnsupportedMediaTypeException', async () => {
        await expect(
            errorHandler({ status: 415, url: 'url', json: () => Promise.resolve('json') } as Response),
        ).to.be.rejectedWith(Error, `Unsupported Media Type`);
    });

    it('422 code should map to Error: Validation failed', async () => {
        await expect(
            errorHandler({ status: 422, url: 'url', json: () => Promise.resolve('json') } as Response),
        ).to.be.rejectedWith(Error, `Validation failed`);
    });

    it('409 code should map to Conflict', async () => {
        await expect(
            errorHandler({ status: 409, url: 'url', json: () => Promise.resolve('json') } as Response),
        ).to.be.rejectedWith(Error, `CONFLICT`);
    });

    it('unknown code should map to Error', async () => {
        await expect(
            errorHandler({ status: 999, url: 'url', text: () => Promise.resolve('text') } as Response),
        ).to.be.rejectedWith(Error, `text`);
    });
});
