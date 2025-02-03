import { expect } from 'chai';
import 'mocha';
import { unsupportedMediaTypeException } from '../../../src/httpClient/exceptions/unsupportedMediaType';
import { Response } from 'node-fetch';

describe('UnsupportedMediaTypeException', () => {
    it('should return CodedError with message from response', () => {
        const response = { statusText: 'only upload pdf' } as unknown as Response;
        const theError = unsupportedMediaTypeException(response);
        expect(theError).to.have.property('message', 'only upload pdf');
    });

    it('should throw CodedError with default message if response does not have one', () => {
        const response = {} as unknown as Response;
        const theError = unsupportedMediaTypeException(response);
        expect(theError).to.have.property('message', 'Unsupported Media Type');
    });
});
