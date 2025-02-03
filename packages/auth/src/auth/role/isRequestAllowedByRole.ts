import { RequestContextLoggerBuilder } from '../../logging';
import { RequestContext } from '../context';
import { RoleType } from './roleType';
import { userHasRoles } from './userRoles';

export const isRequestAllowedByRole = async (
    requestContext: RequestContext,
    allowedRoles: RoleType[],
): Promise<boolean> => {
    const apiLogger = new RequestContextLoggerBuilder(requestContext).build();
    const userId = requestContext.userData.userId;
    try {
        const user = await requestContext.userData.user;

        if (user && user.roles && userHasRoles(user, allowedRoles)) {
            return true;
        }
    } catch (error) {
        if (error instanceof Error) {
            apiLogger.error(`Unable to authorize user ${userId}, caught error: ${error.message}`);
        } else {
            apiLogger.error(JSON.stringify(error));
        }
    }
    return false;
};

export const isRequestSystemCall = async (requestContext: RequestContext): Promise<boolean> => {
    const apiLogger = new RequestContextLoggerBuilder(requestContext).build();
    const userId = requestContext.userData.userId;
    try {
        const user = await requestContext.userData.user;

        if (user && user.roles && userHasRoles(user, [RoleType.System])) {
            return true;
        }
    } catch (error) {
        if (error instanceof Error) {
            apiLogger.error(`Unable to authorize accessor ${userId}, caught error: ${error.message}`);
        } else {
            apiLogger.error(JSON.stringify(error));
        }
    }
    return false;
};
