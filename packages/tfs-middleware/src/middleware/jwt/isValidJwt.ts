import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import { JwtVerificationErrors } from '../..';
import {
    decodeAccessToken,
    getAccessTokenFromRequest,
    getPayloadFromAccessToken,
    getPemFromDecodedToken,
} from './jwtProviders';
import {
    RawTokenExtractor,
    VerifyJwtMiddlewareOptions,
    WellKnownEndpointKey,
    WellKnownEndpointKeysAccessor,
} from './models';
import { JwtValidationError } from './models/jwtValidationError';

export const isValidJwt =
    (options: VerifyJwtMiddlewareOptions) =>
    async (req: IncomingMessage): Promise<void> => {
        const {
            rawTokenExtractor,
            keysAccessor: keyAccessor,
            claimsVerifier,
            requiredClaims,
            wellKnownEndpoint,
        } = options;

        return extractAccessToken(req, rawTokenExtractor)
            .then(encodedAccessToken =>
                extractPayloadFromAccessToken(encodedAccessToken, keyAccessor, wellKnownEndpoint),
            )
            .then(payload => claimsVerifier.verify(payload, requiredClaims))
            .catch(err => {
                if (err instanceof JwtValidationError) {
                    throw err;
                } else if (err instanceof Error) {
                    throw new JwtValidationError(err.message || err.name, JwtVerificationErrors.invalidToken);
                } else {
                    throw new JwtValidationError('Unknown Validation error', JwtVerificationErrors.invalidToken);
                }
            });
    };

export const extractPayloadFromAccessToken = async (
    encodedAccessToken: string,
    keyAccessor: WellKnownEndpointKeysAccessor,
    wellKnownEndpoint: string,
): Promise<string | object> => {
    const decodedAccessToken = decodeAccessToken(encodedAccessToken);

    let wellKnownEndpointKeys: WellKnownEndpointKey[];

    try {
        wellKnownEndpointKeys = await keyAccessor.retrieve(wellKnownEndpoint);
    } catch (error) {
        if (error instanceof JwtValidationError) {
            throw error;
        } else if (error instanceof Error) {
            throw new JwtValidationError(
                error.message || error.name,
                JwtVerificationErrors.failedToGetKeysFromWellKnownEndpoint,
            );
        } else {
            throw new JwtValidationError(
                'Failed to access well-known endpoint keys',
                JwtVerificationErrors.failedToGetKeysFromWellKnownEndpoint,
            );
        }
    }

    let pem;
    try {
        pem = getPemFromDecodedToken(decodedAccessToken, wellKnownEndpointKeys);
    } catch (error) {
        if (error instanceof JwtValidationError) {
            throw error;
        } else if (error instanceof Error) {
            throw new JwtValidationError(error.message || error.name, JwtVerificationErrors.failedToCreatePem);
        } else {
            throw new JwtValidationError('Failed to retrieve pem from token', JwtVerificationErrors.failedToCreatePem);
        }
    }

    const alg = decodedAccessToken.header?.alg as jwt.Algorithm;

    return getPayloadFromAccessToken(encodedAccessToken, pem, alg);
};

export const extractAccessToken = async (
    req: IncomingMessage,
    rawTokenExtractor: RawTokenExtractor,
): Promise<string> => {
    try {
        return getAccessTokenFromRequest(req, rawTokenExtractor);
    } catch (err) {
        if (err instanceof JwtValidationError) {
            throw err;
        } else if (err instanceof Error) {
            throw new JwtValidationError(err.message || err.name, JwtVerificationErrors.invalidToken);
        } else {
            throw new JwtValidationError('Unknown Validation error', JwtVerificationErrors.invalidToken);
        }
    }
};
