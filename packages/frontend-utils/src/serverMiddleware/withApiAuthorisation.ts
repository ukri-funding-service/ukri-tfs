import { getUserContextFromRequestContext, RequestWithContext, RoleType, userHasRoles } from '@ukri-tfs/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { ForbiddenError, RequestWithAccessToken, RequestWithSession } from '../pageFunctions';

export type NextApiRequestWithContext = NextApiRequest &
    RequestWithSession &
    RequestWithContext &
    RequestWithAccessToken;

export type NextApiHandlerWithContext<T> = (req: NextApiRequestWithContext, res: NextApiResponse<T>) => Promise<void>;

export function withApiAuthorisation<T>(
    handler: NextApiHandlerWithContext<T>,
    rolesRequired: RoleType[],
): NextApiHandlerWithContext<T> {
    return async (req: NextApiRequestWithContext, res: NextApiResponse<T>) => {
        const userContext = getUserContextFromRequestContext(req.context);
        const user = await userContext.user;

        if (!user) {
            throw new ForbiddenError('No User found in user context');
        }

        if (!userHasRoles(user, rolesRequired)) {
            throw new ForbiddenError('User does not have the role required');
        }

        return handler(req, res);
    };
}
