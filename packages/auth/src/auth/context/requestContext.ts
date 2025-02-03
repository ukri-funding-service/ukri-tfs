import { Logger } from '@ukri-tfs/logging';
import { CorrelationIds, generateCorrelationId, getTfsUserIdFromHeader } from '@ukri-tfs/tfs-request';
import { IncomingMessage } from 'http';
import { User } from '..';
import { UserData } from './userData';

/**
 * Entry point request context
 */
//This interface cannot change unless agreed upon by TFS and tech leads
export interface RequestContext {
    service: string;
    correlationIds: CorrelationIds;
    userData: UserData;
    logger: Logger;
}

export type WithContext<T> = T & { context: RequestContext };

export type RequestWithContext = WithContext<IncomingMessage>;

export const TEMPORARY_BLANK_REQ_CTXT_TO_BE_REMOVED: RequestContext = {} as RequestContext;
export type GetUserFunction = (
    loggedInUserId: string | undefined,
    userToGetId: string,
    correlationIds: CorrelationIds,
) => Promise<User | undefined>;

export type GetUserIdFunction = (req: IncomingMessage) => string | undefined;
export const anonymousUser = 'anon';

async function getUser(
    getUserFn: GetUserFunction,
    loggedInUserId: string | undefined,
    correlationIds: CorrelationIds,
    userToGetId?: string,
): Promise<User | undefined> {
    if (userToGetId === anonymousUser) {
        return undefined;
    } else if (userToGetId) {
        return getUserFn(loggedInUserId, userToGetId, correlationIds);
    } else {
        throw new Error('Missing credentials');
    }
}

export async function withUser(requestContext: RequestContext, getUserFn: GetUserFunction): Promise<RequestContext> {
    const userId = requestContext.userData.userId;
    let cachedUser: Promise<User | undefined>;
    return {
        ...requestContext,
        userData: {
            userId,
            get user() {
                if (!cachedUser) {
                    cachedUser = getUser(getUserFn, userId, requestContext.correlationIds, userId);
                }
                return cachedUser;
            },
        },
    };
}

export async function createRequestContext(
    req: IncomingMessage,
    service: string,
    correlationIds: CorrelationIds,
    logger: Logger,
    getUserFn: GetUserFunction,
    getUserIdFn?: GetUserIdFunction,
): Promise<RequestContext> {
    /*
        API userIds are found within request.headers, APP userIds are found within request.session.
        By default, this function uses the API style, but services can pass in their own functions to pull
        the userId from the request.
    */
    const userId = getUserIdFn ? getUserIdFn(req) : getTfsUserIdFromHeader(req);
    if (userId === undefined) {
        throw new Error('Missing credentials');
    }
    return withUser(
        {
            service,
            correlationIds,
            userData: { userId, user: Promise.resolve(undefined) },
            logger,
        },
        getUserFn,
    );
}

export function createInternalRequestContext(
    service: string,
    messageIdForCorrelation: string,
    logger: Logger,
): RequestContext {
    /*
        This function is to be used for sessions initiated by internal calls. Such as messages relayed over asynchronous queues.
        userId: The userId should be whatever user the service treats anonymous internal calls as.
        messageIdForCorrelation: The provided messageId should be the id of the message that initiated the call. As it will be used for correlation.
        logger: A ConsoleLogger should be provided.
    */
    return {
        service,
        correlationIds: {
            root: 'Internal call',
            current: messageIdForCorrelation,
            parent: '',
        },
        userData: {
            userId: anonymousUser,
            user: Promise.resolve(undefined),
        },
        logger: logger,
    };
}

export function createInternalRequestContextWithCorrelationIds(
    service: string,
    previousCorrelationIds: CorrelationIds,
    logger: Logger,
): RequestContext {
    /*
        This function is to be used for sessions initiated by internal calls. Such as messages relayed over asynchronous queues.
        userId: The userId should be whatever user the service treats anonymous internal calls as.
        messageIdForCorrelation: The provided messageId should be the id of the message that initiated the call. As it will be used for correlation.
        logger: A ConsoleLogger should be provided.
    */
    return {
        service,
        correlationIds: {
            root: previousCorrelationIds.root,
            parent: previousCorrelationIds.current,
            current: generateCorrelationId(),
        },
        userData: {
            userId: anonymousUser,
            user: Promise.resolve(undefined),
        },
        logger: logger,
    };
}

export const getUserIdFromRequestContext = (requestContext: RequestContext): string => {
    return requestContext.userData.userId || anonymousUser;
};

export const getUserFromRequestContext = async (requestContext: RequestContext): Promise<User | undefined> => {
    return requestContext.userData.user;
};

export const getNonAnonTfsIdFromRequestOrThrow = (req: RequestContext): string => {
    const tfsUserId = getUserIdFromRequestContext(req);
    if (tfsUserId === anonymousUser) {
        throw new Error('Invalid UserID');
    }

    return tfsUserId;
};

export const getTfsIdFromRequestOrAnonId = getUserIdFromRequestContext;
