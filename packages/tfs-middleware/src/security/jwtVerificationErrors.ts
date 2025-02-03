export enum JwtVerificationErrors {
    accessTokenNotFound = 'ACCESS_TOKEN_NOT_FOUND',
    failedToDecodeToken = 'FAILED_TO_DECODE_TOKEN',
    failedToGetKeysFromWellKnownEndpoint = 'FAILED_TO_GET_KEYS_FROM_WELL_KNOWN_ENDPOINT',
    failedToCreatePem = 'FAILED_TO_CREATE_PEM',
    tokenExpired = 'TOKEN_EXPIRED',
    invalidToken = 'INVALID_TOKEN',
    invalidClaims = 'INVALID_CLAIMS',
}
