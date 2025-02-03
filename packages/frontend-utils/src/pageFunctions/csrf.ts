import { IncomingMessage } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { RequestWithSession, SessionData } from './request';

export interface CsrfProps {
    csrfToken?: string;
}

export function getSession(req?: IncomingMessage): Partial<SessionData> {
    const requestWithSession: RequestWithSession = { ...req };
    return requestWithSession.session || {};
}

function getCsrfToken(req?: IncomingMessage): string {
    const session = req && getSession(req);
    if (session && !session.props) {
        session.props = { csrf: { csrfToken: uuidv4() } };
    }
    return session && session.props && session.props.csrf && session.props.csrf.csrfToken
        ? session.props.csrf.csrfToken
        : '';
}

export function isCsrfSafe(req?: IncomingMessage, postData?: CsrfProps): boolean {
    return !!req && !!postData && !!postData.csrfToken && getCsrfToken(req) === postData.csrfToken;
}

export function withCsrfToken<T>(props: T, req?: IncomingMessage): CsrfProps & T {
    return { csrfToken: getCsrfToken(req), ...props };
}
