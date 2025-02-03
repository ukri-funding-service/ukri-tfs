import { AccessTokenProvider, anonymousUser, RequestContext, RequestWithContext } from '@ukri-tfs/auth';
import { IncomingMessage } from 'http';
import { NextPageContext } from 'next';
import { CsrfProps } from './csrf';

export interface SessionProps {
    csrf: CsrfProps;
}

export interface SessionData {
    userTfsId?: string;
    props: SessionProps;
    [key: string]: any;
}

export interface RequestWithSession extends Partial<IncomingMessage> {
    session?: SessionData;
}

export interface RequestWithAccessToken extends Partial<IncomingMessage> {
    accessToken?: AccessTokenProvider;
}

// TODO: investigate including the express session & express passport types in the AppRequest
export declare type AppRequest = RequestWithSession & RequestWithContext & RequestWithAccessToken;

export declare type NextPageContextWithAppRequest = NextPageContext & { req: AppRequest };

export function getLoggedInUserIdFromRequest(request?: IncomingMessage): string {
    const requestWithSession = request as RequestWithSession;
    return (
        requestWithSession?.session?.passport?.user?.user?.tfsId ||
        requestWithSession?.session?.userTfsId ||
        anonymousUser
    );
}

export function getTfsUserId(requestContext: RequestContext): string {
    return requestContext.userData.userId || anonymousUser;
}
