import { IncomingMessage } from 'http';
import { DocumentContext } from 'next/document';
import {
    cookieBannerSettings,
    NextApiRequestCookies,
    NextPageContextWithAppRequest,
    withCookieConsent,
    WithCookieConsentProps,
} from '../../src';
import { expect } from 'chai';
import { NextPage } from 'next';
import Sinon from 'sinon';
import React from 'react';

describe('withCookieConsent', () => {
    const defaultCtx: Partial<DocumentContext> = {
        defaultGetInitialProps: Sinon.fake(),
    };

    const reqWithCookie: Partial<
        IncomingMessage & {
            cookies: NextApiRequestCookies;
        }
    > = {
        cookies: {
            [cookieBannerSettings.cookiePreferencesSet]: 'some-cookie-value',
            [cookieBannerSettings.cookiePolicy]: '{"essential":true,"additional":true}',
        },
    };

    const originalEnv = { ...process.env };
    const ctxWithCookie: Partial<DocumentContext> = {
        ...defaultCtx,
        req: reqWithCookie as IncomingMessage & { cookies: NextApiRequestCookies },
    };

    const wrappedPageProps: WithCookieConsentProps = {};
    const WrappedComponent: NextPage<WithCookieConsentProps> = () => {
        return <></>;
    };

    WrappedComponent.getInitialProps = (_ctx: NextPageContextWithAppRequest) => Promise.resolve(wrappedPageProps);

    const TestComponent: NextPage<WithCookieConsentProps> = withCookieConsent(WrappedComponent);

    describe('cookiePreferencesSet', () => {
        it('props should return cookiePreferencesSet true if cookie exists', async () => {
            const props = await TestComponent.getInitialProps!(ctxWithCookie as DocumentContext);

            expect(props).to.have.property('cookiePreferencesSet', true);
        });

        it('props should return cookiePreferencesSet false if correct cookie does not exist', async () => {
            const reqWithInvalidCookie: Partial<
                IncomingMessage & {
                    cookies: NextApiRequestCookies;
                }
            > = { cookies: { someOtherCookie: 'some-cookie-value' } };

            const ctxWithInvalidCookie: Partial<DocumentContext> = {
                ...defaultCtx,
                req: reqWithInvalidCookie as IncomingMessage & { cookies: NextApiRequestCookies },
            };

            const props = await TestComponent.getInitialProps!(ctxWithInvalidCookie as DocumentContext);

            expect(props).to.have.property('cookiePreferencesSet', false);
        });

        it('props should return cookiePreferencesSet false if no cookies exist', async () => {
            const props = await TestComponent.getInitialProps!(defaultCtx as DocumentContext);

            expect(props).to.have.property('cookiePreferencesSet', false);
        });
    });

    describe('allowAdditionalCookies', () => {
        it('props should return allow additional cookies if the cookie exists', async () => {
            const props = await TestComponent.getInitialProps!(ctxWithCookie as DocumentContext);

            expect(props.allowAdditionalCookies).to.be.true;
        });

        it('props should return false for allow additional cookies given a cookie does not exist', async () => {
            const reqWithInvalidCookie: Partial<
                IncomingMessage & {
                    cookies: NextApiRequestCookies;
                }
            > = { cookies: { someOtherCookie: 'some-cookie-value' } };

            const ctxWithInvalidCookie: Partial<DocumentContext> = {
                ...defaultCtx,
                req: reqWithInvalidCookie as IncomingMessage & { cookies: NextApiRequestCookies },
            };

            const props = await TestComponent.getInitialProps!(ctxWithInvalidCookie as DocumentContext);

            expect(props.allowAdditionalCookies).to.be.false;
        });

        it('props should return false for allow additional cookies given a cookie exists with additional set to false', async () => {
            const reqWithInvalidCookie: Partial<
                IncomingMessage & {
                    cookies: NextApiRequestCookies;
                }
            > = {
                cookies: {
                    [cookieBannerSettings.cookiePreferencesSet]: 'some-cookie-value',
                    [cookieBannerSettings.cookiePolicy]: '{"essential":true,"additional":false}',
                },
            };

            const ctxWithInvalidCookie: Partial<DocumentContext> = {
                ...defaultCtx,
                req: reqWithInvalidCookie as IncomingMessage & { cookies: NextApiRequestCookies },
            };

            const props = await TestComponent.getInitialProps!(ctxWithInvalidCookie as DocumentContext);

            expect(props.allowAdditionalCookies).to.be.false;
        });
    });

    describe('gtmAuth and gtmPreview', () => {
        afterEach(() => {
            process.env = { ...originalEnv };
        });

        it('props should return gtmAuth and gtmPreview', async () => {
            process.env.GOOGLE_TAG_MANAGER_AUTH = 'some-gtmAuth-value';
            process.env.GOOGLE_TAG_MANAGER_PREVIEW = 'some-gtmPreview-value';

            const props = await TestComponent.getInitialProps!(ctxWithCookie as DocumentContext);

            expect(props.googleTagManager).to.have.property('auth', 'some-gtmAuth-value');
            expect(props.googleTagManager).to.have.property('preview', 'some-gtmPreview-value');
        });
    });
});
