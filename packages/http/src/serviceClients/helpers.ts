import { AccessTokenProvider, createAccessTokenProvider, getUserIdFromUserContext, UserContext } from '@ukri-tfs/auth';
import { Logger } from '@ukri-tfs/logging';
import { CorrelationIds } from '@ukri-tfs/tfs-request';

let cachedAccessTokenProvider: AccessTokenProvider | undefined | null = null;

const getAccessTokenProvider = (logger: Logger) => {
    if (cachedAccessTokenProvider === null) {
        cachedAccessTokenProvider =
            process.env.REQUIRE_ACCESS_TOKEN === 'true'
                ? createAccessTokenProvider(
                      logger,
                      process.env.CLIENT_CREDENTIALS_SCOPE,
                      process.env.CLIENT_CREDENTIALS_URL,
                      process.env.CLIENT_CREDENTIALS_ID,
                      process.env.CLIENT_CREDENTIALS_SECRET,
                  )
                : undefined;
    }
    return cachedAccessTokenProvider;
};

export const getCommonClientHeaders = async (
    userContext: UserContext,
    acceptVersion: string,
    logger: Logger,
): Promise<Record<string, string>> => {
    const accessTokenProvider = getAccessTokenProvider(logger);

    const headers: Record<string, string> = {
        'x-tfsUserId': getUserIdFromUserContext(userContext),
        'accept-version': acceptVersion,
        Authorization: accessTokenProvider ? `Bearer ${await accessTokenProvider.getAccessToken()}` : '',
    };

    if (userContext.correlationIds) {
        headers['x-rootcorrelationid'] = userContext.correlationIds.root;
        headers['x-correlationid'] = userContext.correlationIds.current;
    }

    return headers;
};

export const getCommonClientHeadersForUserId = async (
    userId: string,
    correlationIds: CorrelationIds,
    acceptVersion: string,
    logger: Logger,
): Promise<Record<string, string>> => {
    const accessTokenProvider = getAccessTokenProvider(logger);

    const headers: Record<string, string> = {
        'x-tfsUserId': userId,
        'accept-version': acceptVersion,
        Authorization: accessTokenProvider ? `Bearer ${await accessTokenProvider.getAccessToken()}` : '',
    };

    headers['x-rootcorrelationid'] = correlationIds.root;
    headers['x-correlationid'] = correlationIds.current;

    return headers;
};
