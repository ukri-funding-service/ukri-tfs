import { Algorithm } from 'jsonwebtoken';
import { JwtValidationError } from './jwtValidationError';
import { JwtVerificationErrors } from '../../../security/jwtVerificationErrors';

// WellKnownEndpointKey is defined by the aws well known endpoint.
// https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html

export type WellKnownEndpointKey = {
    alg: Algorithm;
    e: string;
    kid: string;
    kty: string;
    n: string;
    use: string;
};

export type WellKnownEndpointKeysAccessor = {
    retrieve: (wellKnownEndpoint: string) => Promise<WellKnownEndpointKey[]>;
};

export const retrieveWellKnownEndpointKeys: WellKnownEndpointKeysAccessor = {
    retrieve: async (wellKnownEndpoint: string): Promise<WellKnownEndpointKey[]> => {
        if (!wellKnownEndpoint) {
            /* Despite appearances, this can be undefined FSB-6794 */ throw new JwtValidationError(
                'Well-known endpoint is required',
                JwtVerificationErrors.failedToGetKeysFromWellKnownEndpoint,
            );
        }

        return fetch(wellKnownEndpoint)
            .then(response => response.json())
            .then(jsonResponse => {
                if (jsonResponse) {
                    const keys = jsonResponse.keys as WellKnownEndpointKey[];

                    if (keys) {
                        return keys;
                    }
                }

                throw new JwtValidationError(
                    'Failed to GET well known endpoint keys',
                    JwtVerificationErrors.failedToGetKeysFromWellKnownEndpoint,
                );
            });
    },
};
