import JWT, { TokenExpiredError } from 'jsonwebtoken';
import { WellKnownEndpointKey } from '../jwt';
import { Logger } from '@ukri-tfs/logging';
import jwkToPem from '../../security/jwkToPem';

export interface VerifyAccessTokenOptions {
    getWellKnownKeys(): Promise<WellKnownEndpointKey[]>;
    noKeysFound?(): void;
}

export async function verifyAccessToken(
    accessToken: string,
    logger: Logger,
    options: VerifyAccessTokenOptions,
): Promise<boolean> {
    logger.debug('Verifying the access token');

    if (!accessToken) {
        logger.debug('Access token not found');
        return false;
    }

    try {
        const decodedAccessToken = JWT.decode(accessToken, { complete: true, json: true });

        if (!decodedAccessToken) {
            if (options.noKeysFound) {
                options.noKeysFound();
            }

            return false;
        }

        logger.debug('Fetching well-known keys');
        const keys = await options.getWellKnownKeys();

        logger.debug('Retrieving matching key for access token');
        const key = keys.find(keyToCheck => keyToCheck.kid === decodedAccessToken.header.kid);

        if (!key) {
            logger.warn('Unable to find matching key in the well-known key file');

            if (options.noKeysFound) {
                options.noKeysFound();
            }

            return false;
        }

        const pem = jwkToPem(key as jwkToPem.JWK);
        logger.debug('Using pem to decode key');

        logger.debug('Verifying the access token with well-known keys');
        JWT.verify(accessToken, pem, { algorithms: [key.alg] });
        logger.debug('Access token verified');
        return true;
    } catch (e) {
        if (e instanceof TokenExpiredError) {
            logger.info('Access token has expired');
        } else {
            logger.error('Error validating the access token: ' + e);
        }
        return false;
    }
}
