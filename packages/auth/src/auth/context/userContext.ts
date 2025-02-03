import { CorrelationIds } from '@ukri-tfs/tfs-request';
import { User } from '..';
import { RequestContext, anonymousUser } from './requestContext';

/**
 * Request and User data for communication between service layers
 */
export interface UserContext {
    service: string;
    correlationIds: CorrelationIds;
    userId: string;
    user?: Promise<User | undefined>;
}

/**
 * Returns a DefaultUserContext built from a RequestContext object.
 * @param requestContext RequestContext object
 */
export const getUserContextFromRequestContext = (requestContext: RequestContext): UserContext => {
    return {
        service: requestContext.service,
        correlationIds: requestContext.correlationIds,
        userId: requestContext.userData.userId || anonymousUser,
        user: requestContext.userData.user,
    };
};

export const getUserDataFromRequestContextOrThrow = async (requestContext: RequestContext): Promise<User> => {
    const userData = await requestContext.userData.user;

    if (userData === undefined) {
        throw new Error('Missing user data');
    }

    return userData;
};

export const getUserIdFromUserContext = (userContext: UserContext): string => {
    return userContext.userId || anonymousUser;
};
