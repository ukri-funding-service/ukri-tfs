/* eslint @typescript-eslint/no-explicit-any: 0 */
/* disabled to allow switching eslint warnings to errors */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { RequestBuilder } from '../helpers/requestBuilder';
import { getSession, isCsrfSafe, withCsrfToken } from '../../src/pageFunctions';
import { IncomingMessage } from 'http';
import { Socket } from 'net';

describe('CSRF function tests', () => {
    describe('getSession() tests', () => {
        it('should return an empty session given an undefined request', () => {
            expect(getSession(undefined)).to.be.empty;
        });

        it('should return an empty session given an undecorated request', () => {
            const request = new IncomingMessage(new Socket());
            expect(getSession(request)).to.be.empty;
        });

        it('should return a session given a request containing a session', () => {
            const request = new RequestBuilder().build();
            expect(getSession(request)).to.have.property('props');
        });
    });

    describe('isCsrfSafe() tests', () => {
        it('should return false if no request is provided', () => {
            expect(isCsrfSafe(undefined)).to.be.false;
        });

        it('should return false if no POST data is provided', () => {
            const request = new RequestBuilder().build();
            expect(isCsrfSafe(request)).to.be.false;
        });

        it('should return false if POST data has no csrfToken', () => {
            const request = new RequestBuilder().build();
            expect(isCsrfSafe(request, { field: 'value' } as any)).to.be.false;
        });

        it('should return false if POST data is empty', () => {
            const request = new RequestBuilder().build();
            expect(isCsrfSafe(request, {})).to.be.false;
        });

        it('should return false if POST data has an invalid csrfToken', () => {
            const request = new RequestBuilder().build();
            expect(isCsrfSafe(request, { csrfToken: 'invalid' })).to.be.false;
        });

        it('should return true if POST data has a valid csrfToken', () => {
            const request = new RequestBuilder().build();
            expect(isCsrfSafe(request, { csrfToken: 'fake' })).to.be.true;
        });
    });

    describe('withCsrfToken() tests', () => {
        it('should return initial props', () => {
            const request = undefined;
            const initialProps = { foo: 'bar' };

            const finalProps = withCsrfToken(initialProps, request);

            expect(finalProps).property('foo').to.eq('bar');
        });

        it('should return props with an empty CSRF token given an undefined request', () => {
            const request = undefined;
            const initialProps = { foo: 'bar' };

            const finalProps = withCsrfToken(initialProps, request);

            expect(finalProps).property('csrfToken').to.be.empty;
        });

        it('should return a generated CSRF token given an undecorated request', () => {
            const request = new IncomingMessage(new Socket());
            const initialProps = { foo: 'bar' };

            const finalProps = withCsrfToken(initialProps, request);

            expect(finalProps).property('csrfToken').to.not.be.empty;
        });

        it('should return props with a valid CSRF token given a decorated request', () => {
            const request = new RequestBuilder().build();
            const initialProps = { foo: 'bar' };

            const finalProps = withCsrfToken(initialProps, request);

            expect(finalProps).property('csrfToken').to.eq('fake');
        });
    });
});
