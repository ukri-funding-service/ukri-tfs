import { VerifyAccessTokenOptions } from './verifyAccessToken';
import { getWellKnownKeys } from './getWellKnownKeys';
import { Logger } from '@ukri-tfs/logging';
import { WellKnownEndpointKey } from '../jwt';
import { IncomingMessage } from 'http';

export interface ValidateRequestOptions {
    getUserAccessToken: (id: string) => Promise<string>;
    setUserAccessToken: (id: string, accessToken: string, expirySeconds: number) => Promise<void>;
    refreshAccessToken: (refreshToken: string) => Promise<string>;
    verifyAccessToken: (
        accessToken: string,
        logger: Logger,
        verifyOptions: VerifyAccessTokenOptions,
    ) => Promise<boolean>;

    wellKnownKeysEndpoint: string;
    refreshToken: string | undefined;
    accessTokenExpirySeconds: number;
}

const errorMessages = {
    noRefreshToken: 'Refresh token not found',
    noSession: 'No session found',
    newAccessTokenInvalid: 'New access token invalid',
};

export async function validateRequest(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: IncomingMessage & { session?: any },
    logger: Logger,
    options: ValidateRequestOptions,
): Promise<void> {
    const verifyOptions = {
        getWellKnownKeys: (): Promise<WellKnownEndpointKey[]> => getWellKnownKeys(options.wellKnownKeysEndpoint),
    };

    if (!req.session || !req.session.passport || !req.session.passport.user) {
        // find the access token from the cookie
        logger.info(errorMessages.noSession);
        return Promise.reject(errorMessages.noSession);
    } else {
        logger.info('Validating access token');
        const accessToken = await options.getUserAccessToken(req.session.id);
        const accessTokenVerified = await options.verifyAccessToken(accessToken, logger, verifyOptions);

        if (accessTokenVerified) {
            logger.info('Access token valid');
            return;
        }
    }

    logger.debug('Access token invalid');

    if (!options.refreshToken) {
        logger.info(errorMessages.noRefreshToken);
        return Promise.reject(errorMessages.noRefreshToken);
    }

    try {
        logger.debug('Requesting new access token using the refresh token');
        const newAccessToken = await options.refreshAccessToken(options.refreshToken);

        await options.setUserAccessToken(req.session.id, newAccessToken, options.accessTokenExpirySeconds);

        logger.debug('New access token downloaded');

        const accessTokenValidated = await options.verifyAccessToken(newAccessToken, logger, verifyOptions);

        if (!accessTokenValidated) {
            logger.info(errorMessages.newAccessTokenInvalid);
            return Promise.reject(errorMessages.newAccessTokenInvalid);
        }
    } catch (e) {
        logger.error(e);
        return Promise.reject(e);
    }
}
