import { apiLogAuthAudit, apiLogAuthDebug, apiLogAuthError, RequestWithContext } from '@ukri-tfs/auth';
import { firstHeaderValue } from '@ukri-tfs/tfs-request';
import { IncomingMessage, ServerResponse } from 'http';
import { JwtVerificationErrors } from '../../security';
import { verifyJwtMessages } from './messages';
import { VerifyJwtMiddlewareOptions, WellKnownEndpointKeysAccessor } from './models';
import { JwtValidationError } from './models/jwtValidationError';
import { KeysAccessorCachingDecorator } from './wellKnownKeyAccessor';

export const accessTokenHeaderName = 'Authorization';

interface ClaimsWithScope {
    scope: string;
}

export const getClaimsFromPayload = (payload: string | object): string[] => {
    const scopes = (payload as ClaimsWithScope)['scope'] || '';
    return scopes ? scopes.split(' ') : [];
};

export const getAccessTokenFromRequestFn = (req: IncomingMessage): string | undefined => {
    const requestContext = (req as RequestWithContext).context;
    apiLogAuthAudit(requestContext); // audit the service authentication at the first step
    const headerValue = `${firstHeaderValue(req, accessTokenHeaderName)}`;
    const bearerPrefix = 'Bearer ';
    return headerValue.startsWith(bearerPrefix) ? headerValue.replace(bearerPrefix, '') : undefined;
};

export const verifyClaimsFn = async (payload: string | object, requiredClaims: string[]): Promise<void> => {
    // default - prevent all access if server claims have not been set
    if (requiredClaims.length === 0) {
        throw new JwtValidationError('No service scopes set', JwtVerificationErrors.invalidClaims);
    }

    const tokenClaims = getClaimsFromPayload(payload);
    const tokenContainsRequiredClaims = requiredClaims.reduce(
        (isValid: boolean, requiredClaim: string): boolean => isValid && tokenClaims.includes(requiredClaim),
        true,
    );

    if (!tokenContainsRequiredClaims) {
        throw new JwtValidationError(
            `Token does not contain required claims. Expected: [${requiredClaims}], actual: [${tokenClaims}]`,
            JwtVerificationErrors.invalidClaims,
        );
    }
};

export const onErrorFn = (req: IncomingMessage, res: ServerResponse, err: JwtValidationError): void => {
    const requestContext = (req as RequestWithContext).context;

    // Only logged when LOGGING_LEVEL .env variables is set to debug
    apiLogAuthDebug(requestContext, err.message);

    let errorMessage: string;

    switch (err.errorCode) {
        case JwtVerificationErrors.accessTokenNotFound:
            res.statusCode = 401;
            errorMessage = verifyJwtMessages.accessTokenNotFound;
            break;
        case JwtVerificationErrors.failedToCreatePem:
            res.statusCode = 500;
            errorMessage = verifyJwtMessages.failedToCreatePem;
            break;
        case JwtVerificationErrors.failedToDecodeToken:
            res.statusCode = 401;
            errorMessage = verifyJwtMessages.failedToDecodeToken;
            break;
        case JwtVerificationErrors.failedToGetKeysFromWellKnownEndpoint:
            res.statusCode = 500;
            errorMessage = verifyJwtMessages.failedToGetKeysFromWellKnownEndpoint;
            break;
        case JwtVerificationErrors.invalidClaims:
            res.statusCode = 403;
            errorMessage = verifyJwtMessages.invalidClaims(err.message);
            break;
        case JwtVerificationErrors.invalidToken:
            res.statusCode = 401;
            errorMessage = verifyJwtMessages.invalidToken;
            break;
        case JwtVerificationErrors.tokenExpired:
            res.statusCode = 401;
            errorMessage = verifyJwtMessages.tokenExpired;
            break;
    }

    apiLogAuthError(requestContext, errorMessage);
};

export const getIsValidJwtOptions = (
    requiredClaims: string[],
    wellKnownEndpoint: string,
    keysAccessor: WellKnownEndpointKeysAccessor,
): VerifyJwtMiddlewareOptions => {
    return {
        requiredClaims,
        rawTokenExtractor: { extract: getAccessTokenFromRequestFn },
        keysAccessor: KeysAccessorCachingDecorator.getInstance(keysAccessor, wellKnownEndpoint), // Changed to use singleton, otherwise the caching is useless
        claimsVerifier: { verify: verifyClaimsFn },
        wellKnownEndpoint,
    };
};
