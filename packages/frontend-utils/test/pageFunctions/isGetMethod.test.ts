import { expect } from 'chai';
import { isGetMethod } from '../../src/pageFunctions';
import { RequestBuilder } from '../helpers/requestBuilder';

describe('isGetMethod() tests', () => {
    it('should return false if request is undefined', () => {
        expect(isGetMethod(undefined)).to.be.false;
    });

    it('should return false if request method is undefined', () => {
        const request = new RequestBuilder().build();
        request.method = undefined;
        expect(isGetMethod(request)).to.be.false;
    });

    it('should return false if request method is not GET', () => {
        const request = new RequestBuilder().build();
        request.method = 'POST';
        expect(isGetMethod(request)).to.be.false;
    });

    it('should return false if request method is "GET" in uppercase', () => {
        const request = new RequestBuilder().build();
        request.method = 'GET';
        expect(isGetMethod(request)).to.be.true;
    });

    it('should return false if request method is "get" in lowercase', () => {
        const request = new RequestBuilder().build();
        request.method = 'get';
        expect(isGetMethod(request)).to.be.true;
    });
});
