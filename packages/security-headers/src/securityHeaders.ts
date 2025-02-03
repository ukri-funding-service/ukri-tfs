import { IncomingMessage, ServerResponse } from 'http';
import { SecurityMode, getContentSecurityPolicyHeader } from './contentSecurityPolicy/contentSecurityPolicy';
import { tfsFetchDirectives } from './tfsFetchDirectives';

export function getTfsContentSecurityPolicy(securityMode: SecurityMode): string {
    const allDirectives = [...tfsFetchDirectives(securityMode)];

    return getContentSecurityPolicyHeader(allDirectives);
}

export function addSecurityHeaders(
    devMode = false,
): (_req: IncomingMessage, res: ServerResponse, next: () => void) => void {
    const securityMode: SecurityMode = devMode ? 'DEVELOPMENT' : 'PRODUCTION';

    return (_req: IncomingMessage, res: ServerResponse, next: () => void): void => {
        res.setHeader('Strict-Transport-Security', 'max-age=7884000');
        res.setHeader('Content-Security-Policy', getTfsContentSecurityPolicy(securityMode));
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        next();
    };
}
