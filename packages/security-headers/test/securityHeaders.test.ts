import { describe, expect, it } from '@jest/globals';
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import { addSecurityHeaders, getTfsContentSecurityPolicy } from '../src';

describe('packages/security-headers - response/securityHeaders', () => {
    it('should add Strict-Transport-Security header', () => {
        const res = new ServerResponse(new IncomingMessage(new Socket()));
        expect(res.hasHeader('Strict-Transport-Security')).toBeFalsy();

        addSecurityHeaders()({} as IncomingMessage, res, () => {});

        expect(res.hasHeader('Strict-Transport-Security')).toBeTruthy();
        expect(res.getHeader('Strict-Transport-Security')).toEqual('max-age=7884000');
    });

    it('should add Content-Security-Policy header', () => {
        const res = new ServerResponse(new IncomingMessage(new Socket()));
        expect(res.hasHeader('Content-Security-Policy')).toBeFalsy();

        addSecurityHeaders()({} as IncomingMessage, res, () => {});

        expect(res.hasHeader('Content-Security-Policy')).toBeTruthy();
        expect(res.getHeader('Content-Security-Policy')?.toString().length).toBeGreaterThan(0);
    });

    it('should add unsafe-eval to Content-Security-Policy header in development', () => {
        const res = new ServerResponse(new IncomingMessage(new Socket()));
        expect(res.hasHeader('Content-Security-Policy')).toBeFalsy();

        addSecurityHeaders(true)({} as IncomingMessage, res, () => {});

        expect(res.hasHeader('Content-Security-Policy')).toBeTruthy();
        expect(res.getHeader('Content-Security-Policy')?.toString().length).toBeGreaterThan(0);
    });

    it('should not add unsafe-eval to Content-Security-Policy header in production', () => {
        const res = new ServerResponse(new IncomingMessage(new Socket()));
        expect(res.hasHeader('Content-Security-Policy')).toBeFalsy();

        addSecurityHeaders()({} as IncomingMessage, res, () => {});

        expect(res.hasHeader('Content-Security-Policy')).toBeTruthy();
        expect(res.getHeader('Content-Security-Policy')).not.toContain('unsafe-eval');
    });

    it('should add X-Frame-Options header', () => {
        const res = new ServerResponse(new IncomingMessage(new Socket()));
        expect(res.hasHeader('X-Frame-Options')).toBeFalsy();

        addSecurityHeaders()({} as IncomingMessage, res, () => {});

        expect(res.hasHeader('X-Frame-Options')).toBeTruthy();
        expect(res.getHeader('X-Frame-Options')).toEqual('DENY');
    });

    it('should add X-Content-Type-Options header', () => {
        const res = new ServerResponse(new IncomingMessage(new Socket()));
        expect(res.hasHeader('X-Content-Type-Options')).toBeFalsy();

        addSecurityHeaders()({} as IncomingMessage, res, () => {});

        expect(res.hasHeader('X-Content-Type-Options')).toBeTruthy();
        expect(res.getHeader('X-Content-Type-Options')).toEqual('nosniff');
    });

    describe('tfsContentSecurityPolicy', () => {
        describe('behaviour in PRODUCTION', () => {
            it('should return a non-empty value', () => {
                const result = getTfsContentSecurityPolicy('PRODUCTION');
                expect(result.length).toBeGreaterThan(0);
            });

            it('should return a CSP with a default-src policy', () => {
                const result = getTfsContentSecurityPolicy('PRODUCTION');
                const elements = result.split(';');

                const match = elements.filter(policy => policy.trim().startsWith('default-src'));

                expect(match.length).toEqual(1);
            });

            it('should return a CSP with a script-src policy', () => {
                const result = getTfsContentSecurityPolicy('PRODUCTION');
                const elements = result.split(';');

                const match = elements.filter(policy => policy.trim().startsWith('script-src'));

                expect(match.length).toEqual(1);
            });

            it('should return a CSP with a img-src policy', () => {
                const result = getTfsContentSecurityPolicy('PRODUCTION');
                const elements = result.split(';');

                const match = elements.filter(policy => policy.trim().startsWith('img-src'));

                expect(match.length).toEqual(1);
            });

            it('should return a CSP with a style-src policy', () => {
                const result = getTfsContentSecurityPolicy('PRODUCTION');
                const elements = result.split(';');

                const match = elements.filter(policy => policy.trim().startsWith('style-src'));

                expect(match.length).toEqual(1);
            });

            it('should return a CSP with a font-src policy', () => {
                const result = getTfsContentSecurityPolicy('PRODUCTION');
                const elements = result.split(';');

                const match = elements.filter(policy => policy.trim().startsWith('font-src'));

                expect(match.length).toEqual(1);
            });

            it('should return a CSP with a connect-src policy', () => {
                const result = getTfsContentSecurityPolicy('PRODUCTION');
                const elements = result.split(';');

                const match = elements.filter(policy => policy.trim().startsWith('connect-src'));

                expect(match.length).toEqual(1);
            });

            it('should return a CSP with a frame-src policy', () => {
                const result = getTfsContentSecurityPolicy('PRODUCTION');
                const elements = result.split(';');

                const match = elements.filter(policy => policy.trim().startsWith('frame-src'));

                expect(match.length).toEqual(1);
            });
        });

        describe('behaviour in DEVELOPMENT', () => {
            it('should return a non-empty value', () => {
                const result = getTfsContentSecurityPolicy('DEVELOPMENT');
                expect(result.length).toBeGreaterThan(0);
            });

            it('should return a CSP with a default-src policy', () => {
                const result = getTfsContentSecurityPolicy('DEVELOPMENT');
                const elements = result.split(';');

                const match = elements.filter(policy => policy.trim().startsWith('default-src'));

                expect(match.length).toEqual(1);
            });

            it('should return a CSP with a script-src policy', () => {
                const result = getTfsContentSecurityPolicy('DEVELOPMENT');
                const elements = result.split(';');

                const match = elements.filter(policy => policy.trim().startsWith('script-src'));

                expect(match.length).toEqual(1);
            });

            it('should return a CSP with a img-src policy', () => {
                const result = getTfsContentSecurityPolicy('DEVELOPMENT');
                const elements = result.split(';');

                const match = elements.filter(policy => policy.trim().startsWith('img-src'));

                expect(match.length).toEqual(1);
            });

            it('should return a CSP with a style-src policy', () => {
                const result = getTfsContentSecurityPolicy('DEVELOPMENT');
                const elements = result.split(';');

                const match = elements.filter(policy => policy.trim().startsWith('style-src'));

                expect(match.length).toEqual(1);
            });

            it('should return a CSP with a font-src policy', () => {
                const result = getTfsContentSecurityPolicy('DEVELOPMENT');
                const elements = result.split(';');

                const match = elements.filter(policy => policy.trim().startsWith('font-src'));

                expect(match.length).toEqual(1);
            });

            it('should return a CSP with a connect-src policy', () => {
                const result = getTfsContentSecurityPolicy('DEVELOPMENT');
                const elements = result.split(';');

                const match = elements.filter(policy => policy.trim().startsWith('connect-src'));

                expect(match.length).toEqual(1);
            });

            it('should return a CSP with a frame-src policy', () => {
                const result = getTfsContentSecurityPolicy('DEVELOPMENT');
                const elements = result.split(';');

                const match = elements.filter(policy => policy.trim().startsWith('frame-src'));

                expect(match.length).toEqual(1);
            });
        });
    });
});
