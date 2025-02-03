import { getUserContextFromRequestContext, RoleType, userHasRoles } from '@ukri-tfs/auth';
import { NextPage, NextPageContext } from 'next';
import React from 'react';
import { AppRequest, ForbiddenError } from '../pageFunctions';

export function withPageAuthorisation<T extends JSX.IntrinsicAttributes>(
    WrappedComponent: NextPage<T>,
    rolesRequired: RoleType[],
): React.ComponentType<T> {
    const WithAuthorisation: NextPage<T> = props => <WrappedComponent {...props} />;

    WithAuthorisation.getInitialProps = async (ctx: NextPageContext): Promise<T> => {
        const userContext = getUserContextFromRequestContext((ctx.req as AppRequest).context);
        const user = await userContext.user;

        if (!user) {
            throw new ForbiddenError('No User found in user context');
        }

        if (!userHasRoles(user, rolesRequired)) {
            throw new ForbiddenError('User does not have the role required');
        }

        return (WrappedComponent.getInitialProps ? await WrappedComponent.getInitialProps(ctx) : null) as T;
    };

    return WithAuthorisation;
}
