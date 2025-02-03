import { expect } from 'chai';
import { storeCookie } from '../../../src';

describe('cookieUtils', () => {
    it('should set cookie with provided string', () => {
        storeCookie('some-string');
        expect(document.cookie).to.equal('some-string');
    });
});
