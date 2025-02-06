import { NextPage } from 'next';
import process from 'process'; // required to override nextjs' process implementation with node' process
import React from 'react';
import { cookieBannerSettings } from '../defaults';
import { AppRequest, NextPageContextWithAppRequest } from '../pageFunctions';
import { getAllowAdditionalCookies } from '../pageFunctions/readCookies';

export type NextApiRequestCookies = {
    [x: string]: string | undefined;
};

export type AppRequestWithCookies = AppRequest & { cookies?: NextApiRequestCookies };

export interface WithCookieConsentProps {
    cookiePreferencesSet?: boolean;
    allowAdditionalCookies?: boolean;
    googleTagManager?: {
        auth?: string;
        preview?: string;
    };
}

export const getGTMAuthAndPreview = (): { auth?: string; preview?: string } => {
    return {
        auth: process.env.GOOGLE_TAG_MANAGER_AUTH!,
        preview: process.env.GOOGLE_TAG_MANAGER_PREVIEW!,
    };
};

export function withCookieConsent<T>(WrappedComponent: NextPage<T>): React.ComponentType<T & WithCookieConsentProps> {
    const WithCookieBanner: NextPage<T & WithCookieConsentProps> = props => {
        return <WrappedComponent {...props} />;
    };

    WithCookieBanner.getInitialProps = async (
        ctx: NextPageContextWithAppRequest,
    ): Promise<T & WithCookieConsentProps> => {
        const initialProps = WrappedComponent.getInitialProps ? await WrappedComponent.getInitialProps(ctx) : null;
        let cookiePreferencesSet = false;
        let allowAdditionalCookies = false;

        if (ctx.req) {
            const req = ctx.req as AppRequestWithCookies;
            cookiePreferencesSet = !!(req.cookies && req.cookies[cookieBannerSettings.cookiePreferencesSet]);
            allowAdditionalCookies = getAllowAdditionalCookies(req.cookies);
        }

        const googleTagManager = getGTMAuthAndPreview();

        return { cookiePreferencesSet, allowAdditionalCookies, googleTagManager, ...initialProps! };
    };

    return WithCookieBanner;
}
