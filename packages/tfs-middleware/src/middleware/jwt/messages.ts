export const verifyJwtMessages = {
    accessTokenNotFound: 'Token was not found in request',
    failedToCreatePem: 'Pem could not be generated using the decoded token KID. KID is either missing or mis-matched.',
    failedToDecodeToken: 'Failed to decode the token',
    failedToGetKeysFromWellKnownEndpoint: 'Failed to get keys from well known endpoint',
    invalidClaims: (errMessage: string): string => `Token claims are invalid - ${errMessage}`,
    invalidToken: 'Token is invalid',
    tokenExpired: 'Token has expired',
};
