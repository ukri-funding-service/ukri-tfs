import { expect } from 'chai';
import { isPostMethod } from '../../src/pageFunctions';
import { RequestBuilder } from '../helpers/requestBuilder';

describe('isPostMethod() tests', () => {
    it('should return false if request is undefined', () => {
        expect(isPostMethod(undefined)).to.be.false;
    });

    it('should return false if request method is undefined', () => {
        const request = new RequestBuilder().build();
        request.method = undefined;
        expect(isPostMethod(request)).to.be.false;
    });

    it('should return false if request method is not POST', () => {
        const request = new RequestBuilder().build();
        expect(isPostMethod(request)).to.be.false;
    });

    it('should return false if request method is "POST" in uppercase', () => {
        const request = new RequestBuilder().build();
        request.method = 'POST';
        expect(isPostMethod(request)).to.be.true;
    });

    it('should return false if request method is "post" in lowercase', () => {
        const request = new RequestBuilder().build();
        request.method = 'post';
        expect(isPostMethod(request)).to.be.true;
    });
});
