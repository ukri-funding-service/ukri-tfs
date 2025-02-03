import { expect } from 'chai';
import { IncomingMessage, ServerResponse } from 'http';
import { describe } from 'mocha';
import { Socket } from 'net';
import { RedirectError, newRedirect, redirect } from '../../src/pageFunctions/redirect';

describe('Redirect() function tests', () => {
    it('should have a 302 status code if preserve data option is not provided', () => {
        const response = new ServerResponse(new IncomingMessage(new Socket()));
        redirect(response, 'testUrl/page');
        expect(response.statusCode).to.equal(302);
    });

    it('should have a 302 status code if preserve data option is false', () => {
        const response = new ServerResponse(new IncomingMessage(new Socket()));
        redirect(response, 'testUrl/page', false);
        expect(response.statusCode).to.equal(302);
    });

    it('should have a 307 status code if preserve data option is true', () => {
        const response = new ServerResponse(new IncomingMessage(new Socket()));
        redirect(response, 'testUrl/page', true);
        expect(response.statusCode).to.equal(307);
    });
});

describe('newRedirect() function tests', () => {
    it('should throw with the url and no preserveData by default', () => {
        const call = () => newRedirect('testUrl/page');

        expect(call).to.throw();
        try {
            call();
        } catch (e) {
            expect(e instanceof RedirectError).to.be.true;
            if (e instanceof RedirectError) {
                expect(e.location).to.equal('testUrl/page');
                expect(e.preserveData).to.be.false;
            }
        }
    });
    it('should throw with the url and no preserveData when set false', () => {
        const call = () => newRedirect('testUrl/page', false);

        expect(call).to.throw();
        try {
            call();
        } catch (e) {
            expect(e instanceof RedirectError).to.be.true;
            if (e instanceof RedirectError) {
                expect(e.location).to.equal('testUrl/page');
                expect(e.preserveData).to.be.false;
            }
        }
    });
    it('should throw with the url and preserveData when set true', () => {
        const call = () => newRedirect('testUrl/page', true);

        expect(call).to.throw();
        try {
            call();
        } catch (e) {
            expect(e instanceof RedirectError).to.be.true;
            if (e instanceof RedirectError) {
                expect(e.location).to.equal('testUrl/page');
                expect(e.preserveData).to.be.true;
            }
        }
    });
});
