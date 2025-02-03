import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import { JwtVerificationErrors } from '../../security';
import jwkToPem from '../../security/jwkToPem';
import {
    DecodedToken,
    JwtValidationError,
    RawTokenExtractor,
    WellKnownEndpointKey,
    WellKnownEndpointKeysAccessor,
} from './models';

export const getAccessTokenFromRequest = (req: IncomingMessage, rawTokenExtractor: RawTokenExtractor): string => {
    try {
        const accessToken = rawTokenExtractor.extract(req);

        if (!accessToken) {
            throw new JwtValidationError(
                'Access token not found in request',
                JwtVerificationErrors.accessTokenNotFound,
            );
        }

        return accessToken;
    } catch (error) {
        if (error instanceof JwtValidationError) {
            throw error;
        } else if (error instanceof Error) {
            throw new JwtValidationError(error.message || error.name, JwtVerificationErrors.accessTokenNotFound);
        } else {
            throw new JwtValidationError(
                'Error getting access token from request',
                JwtVerificationErrors.accessTokenNotFound,
            );
        }
    }
};

/* These algorithms are currently defined by jwt.Algorithm as a union type
   so they can't be directly compared. This list may, of course, be made
   more restrictive should certain algorithms be undesirable
   */
export const PERMITTED_JWT_ALGORITHMS = [
    'HS256',
    'HS384',
    'HS512',
    'RS256',
    'RS384',
    'RS512',
    'ES256',
    'ES384',
    'ES512',
    'PS256',
    'PS384',
    'PS512',
    'none',
];

export const isCompatibleAlgorithm = (algorithm: string): algorithm is jwt.Algorithm => {
    return PERMITTED_JWT_ALGORITHMS.includes(algorithm);
};

export const decodeAccessToken = (encodedToken: string): Partial<DecodedToken> => {
    try {
        const decodedAccessToken = jwt.decode(encodedToken, { complete: true, json: true });

        if (!decodedAccessToken) {
            throw new JwtValidationError('Token could not be decoded', JwtVerificationErrors.failedToDecodeToken);
        }

        if (!isCompatibleAlgorithm(decodedAccessToken.header.alg)) {
            throw new Error(`Unexpected JWT algorithm (header.alg): ${decodedAccessToken.header.alg}`);
        }

        const header: DecodedToken['header'] = {
            ...decodedAccessToken.header,
            alg: decodedAccessToken.header.alg, // Necessary to pass TS type checking
        };

        return {
            ...decodedAccessToken,
            header,
        };
    } catch (error) {
        if (error instanceof JwtValidationError) {
            throw error;
        } else if (error instanceof Error) {
            throw new JwtValidationError(error.message || error.name, JwtVerificationErrors.failedToDecodeToken);
        } else {
            throw new JwtValidationError(
                'Error decoding token from request',
                JwtVerificationErrors.failedToDecodeToken,
            );
        }
    }
};

export const getWellKnownEndpointKeys = async (
    wellKnownEndpointKeysAccessor: WellKnownEndpointKeysAccessor,
    wellKnownEndpoint: string,
): Promise<WellKnownEndpointKey[]> => {
    return wellKnownEndpointKeysAccessor
        .retrieve(wellKnownEndpoint)
        .then(endpointKeys => {
            if (endpointKeys.length === 0) {
                throw new JwtValidationError(
                    'Found 0 well known endpoint keys',
                    JwtVerificationErrors.failedToGetKeysFromWellKnownEndpoint,
                );
            }

            return endpointKeys;
        })
        .catch(err => {
            if (err instanceof JwtValidationError) {
                throw err;
            } else if (err instanceof Error) {
                throw new JwtValidationError(
                    err.message || err.name,
                    JwtVerificationErrors.failedToGetKeysFromWellKnownEndpoint,
                );
            } else {
                throw new JwtValidationError(
                    'Unknown error extracting PEM from token',
                    JwtVerificationErrors.failedToGetKeysFromWellKnownEndpoint,
                );
            }
        });
};

export const getPemFromDecodedToken = (decodedToken: Partial<DecodedToken>, keys: WellKnownEndpointKey[]): string => {
    try {
        const key = keys.find(keyToCheck => keyToCheck.kid === decodedToken.header?.kid);

        if (!key) {
            throw new JwtValidationError('Kid not found in header', JwtVerificationErrors.invalidToken);
        }

        const pem = jwkToPem(key as jwkToPem.JWK);
        if (!pem) {
            throw new JwtValidationError(
                'Failed to create pem from decoded token header kid',
                JwtVerificationErrors.failedToCreatePem,
            );
        }

        return pem;
    } catch (err) {
        if (err instanceof JwtValidationError) {
            throw err;
        } else if (err instanceof Error) {
            throw new JwtValidationError(err.message || err.name, JwtVerificationErrors.failedToCreatePem);
        } else {
            throw new JwtValidationError(
                'Unknown error extracting PEM from token',
                JwtVerificationErrors.failedToCreatePem,
            );
        }
    }
};

export const getPayloadFromAccessToken = (
    encodedToken: string,
    pem: jwt.Secret,
    alg: jwt.Algorithm,
): string | object => {
    try {
        const jwtVerifyOptions: jwt.VerifyOptions = { algorithms: [alg] };

        // verification using auth0 function
        // https://github.com/auth0/node-jsonwebtoken
        const decodedToken = jwt.verify(encodedToken, pem, jwtVerifyOptions);

        if (!decodedToken) {
            throw new JwtValidationError('Token is invalid', JwtVerificationErrors.invalidToken);
        }

        return decodedToken;
    } catch (err) {
        if (err instanceof JwtValidationError) {
            throw err;
        } else if (err instanceof jwt.TokenExpiredError) {
            throw new JwtValidationError('Token expired', JwtVerificationErrors.tokenExpired);
        } else if (err instanceof Error) {
            throw new JwtValidationError(err.message || err.name, JwtVerificationErrors.invalidToken);
        } else {
            throw new JwtValidationError('Unknown error verifying token', JwtVerificationErrors.invalidToken);
        }
    }
};
