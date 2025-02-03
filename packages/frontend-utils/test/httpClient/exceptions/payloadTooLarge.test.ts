import { expect } from 'chai';
import 'mocha';
import { payloadTooLargeException } from '../../../src/httpClient/exceptions/payloadTooLarge';
import { Response } from 'node-fetch';

describe('PayloadTooLargeError', () => {
    it('should return CodedError with message from response', () => {
        const response = { statusText: 'file is too large' } as unknown as Response;
        const theError = payloadTooLargeException(response);
        expect(theError).to.have.property('message', 'file is too large');
    });

    it('should throw CodedError with default message if response does not have one', () => {
        const response = {} as unknown as Response;
        const theError = payloadTooLargeException(response);
        expect(theError).to.have.property('message', 'Payload too large');
    });
});
