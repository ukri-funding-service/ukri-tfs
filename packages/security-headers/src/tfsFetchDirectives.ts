import { SecurityMode } from './contentSecurityPolicy/contentSecurityPolicy';
import { FetchDirective } from './contentSecurityPolicy/fetchDirective';

export function tfsFetchDirectives(securityMode: SecurityMode): FetchDirective[] {
    return [
        getDefaultSrcDirective(securityMode),
        getScriptSrcDirective(securityMode),
        getImgSrcDirective(securityMode),
        getStyleSrcDirective(securityMode),
        getFontSrcDirective(securityMode),
        getConnectSrcDirective(securityMode),
        getFrameSrcDirective(securityMode),
    ];
}

export const isSourcePermittedInProduction = (source: string): boolean => source !== "'unsafe-eval'";
export const isSourcePermittedInDevelopment = (_source: string): boolean => true;

export const getSourceFilter = (securityMode: SecurityMode): ((clause: string) => boolean) => {
    // The default here is intentional - should other SecurityModes be added in future, the
    // PRODUCTION mode will always default unless specifically overruled by a new case statement
    switch (securityMode) {
        case 'DEVELOPMENT':
            return isSourcePermittedInDevelopment;
        default:
            return isSourcePermittedInProduction;
    }
};

export function getDefaultSrcDirective(mode: SecurityMode): FetchDirective {
    const permittedSource = getSourceFilter(mode);

    // Be careful what is added to this one, as it is the default for any
    // undefined fetch directive
    const permittedSources = ["'self'"].filter(permittedSource);

    return new FetchDirective('default-src', permittedSources);
}

export function getScriptSrcDirective(mode: SecurityMode): FetchDirective {
    const permittedSource = getSourceFilter(mode);

    const permittedSources = [
        "'self'",
        "'unsafe-eval'", // Removed by permittedSource filter in PRODUCTION
        "'unsafe-inline'",
        '*.newrelic.com',
        '*.nr-data.net',
        'https://static.hotjar.com',
        'https://script.hotjar.com',
        '*.googletagmanager.com',
        '*.google-analytics.com',
    ].filter(permittedSource);

    return new FetchDirective('script-src', permittedSources);
}

export function getImgSrcDirective(mode: SecurityMode): FetchDirective {
    const permittedSource = getSourceFilter(mode);

    const permittedSources = [
        "'self'",
        'ukri-tfs-prod-assets.s3.eu-west-2.amazonaws.com',
        'data:',
        '*.googletagmanager.com',
        '*.google-analytics.com',
        'https://script.hotjar.com',
    ].filter(permittedSource);

    return new FetchDirective('img-src', permittedSources);
}

export function getStyleSrcDirective(mode: SecurityMode): FetchDirective {
    const permittedSource = getSourceFilter(mode);

    const permittedSources = ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'].filter(permittedSource);

    return new FetchDirective('style-src', permittedSources);
}

export function getFontSrcDirective(mode: SecurityMode): FetchDirective {
    const permittedSource = getSourceFilter(mode);

    const permittedSources = ["'self'", 'fonts.gstatic.com', 'https://script.hotjar.com'].filter(permittedSource);

    return new FetchDirective('font-src', permittedSources);
}

export function getConnectSrcDirective(mode: SecurityMode): FetchDirective {
    const permittedSource = getSourceFilter(mode);

    const permittedSources = [
        "'self'",
        '*.google-analytics.com',
        'https://*.hotjar.com:*',
        'https://vc.hotjar.io:*',
        'https://surveystats.hotjar.io',
        'wss://*.hotjar.com',
        'https://bam.nr-data.net',
    ].filter(permittedSource);

    return new FetchDirective('connect-src', permittedSources);
}

export function getFrameSrcDirective(mode: SecurityMode): FetchDirective {
    const permittedSource = getSourceFilter(mode);

    const permittedSources = ['https://vars.hotjar.com'].filter(permittedSource);

    return new FetchDirective('frame-src', permittedSources);
}
