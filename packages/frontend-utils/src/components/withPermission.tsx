import { getUserContextFromRequestContext, RequestWithContext } from '@ukri-tfs/auth';
import { PermissionServiceFactory } from '@ukri-tfs/permissions';
import { NextPage, NextPageContext } from 'next';
import React from 'react';

export interface WithPermissionProps {
    permissionDenied?: boolean;
}

export const withPermission = <T,>(
    WrappedComponent: NextPage<T>,
    permissionDeniedPage: JSX.Element,
    permissionServiceFactory: PermissionServiceFactory,
    action: string,
): React.ComponentType<T & WithPermissionProps> => {
    const WithPermission: NextPage<T & WithPermissionProps> = props => {
        if (props.permissionDenied) {
            return permissionDeniedPage;
        }
        return <WrappedComponent {...props} />;
    };

    WithPermission.getInitialProps = async (ctx: NextPageContext): Promise<T & WithPermissionProps> => {
        const userContext = getUserContextFromRequestContext((ctx.req as RequestWithContext).context);

        const permissionDenied = !(await permissionServiceFactory.build(userContext).userCanPerformAction(action));
        if (permissionDenied) {
            return { ...({} as T), permissionDenied };
        }

        return {
            permissionDenied,
            ...((WrappedComponent.getInitialProps ? await WrappedComponent.getInitialProps(ctx) : null) as T),
        };
    };

    return WithPermission;
};
