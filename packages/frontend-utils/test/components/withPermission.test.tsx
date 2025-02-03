import { render } from '@testing-library/react';
import { Policy, RequestContext, RequestWithContext, User } from '@ukri-tfs/auth';
import { PermissionServiceFactory } from '@ukri-tfs/permissions';
import { expect } from 'chai';
import { IncomingMessage, ServerResponse } from 'http';
import 'mocha';
import { Socket } from 'net';
import { NextPage, NextPageContext } from 'next';
import React from 'react';
import { withPermission } from '../../src/components/withPermission';

const fn = () => {};
const mockLogger = {
    audit: fn,
    error: fn,
    warn: fn,
    info: fn,
    debug: fn,
};

describe('WithPermission', () => {
    // create generic wrappable page component
    type ExampleProps = {
        message: string;
    };
    const wrappedPageProps: ExampleProps = {
        message: 'default message',
    };
    const WrappedComponent: NextPage<ExampleProps> = props => {
        return <p>{props.message}</p>;
    };
    WrappedComponent.getInitialProps = (_ctx: NextPageContext) => Promise.resolve(wrappedPageProps);

    // permission denied page
    const PermissionDenied: React.ComponentType = () => {
        return <p>Permission Denied</p>;
    };

    // create users
    const unauthorisedUser = {
        id: 1,
        cognitoId: '',
        tfsId: 'TfsAdmin',
    } as User;

    const request = new IncomingMessage(new Socket());
    (request as RequestWithContext).context = {
        logger: {},
        service: 'frontend',
        userData: {
            user: Promise.resolve(unauthorisedUser),
            userId: '1234-1234-1234-1234',
        },
    } as RequestContext;
    const response = new ServerResponse(request);
    const documentContext = { req: request, res: response } as NextPageContext;
    const permissionServiceFactory = new PermissionServiceFactory(mockLogger);

    const renderNextPage = async (NP: NextPage, ctx: NextPageContext) =>
        render(<NP {...await NP.getInitialProps!(ctx)} />);

    beforeEach(() => {
        // jest.resetAllMocks();
    });

    describe('check the logged in user has the specified permission (policy)', () => {
        it('should render the WrappedComponent if the user has the policy', async () => {
            const action = 'view-secret-info';
            const ctx = {
                req: {
                    ...documentContext.req,
                    context: {
                        userData: {
                            user: Promise.resolve({
                                ...unauthorisedUser,
                                policies: [
                                    {
                                        action,
                                    } as Policy,
                                ],
                            }),
                        },
                    },
                },
                res: response,
            } as unknown as NextPageContext;

            const TestComponent = withPermission(
                WrappedComponent,
                <PermissionDenied />,
                permissionServiceFactory,
                action,
            ) as NextPage;
            expect(await TestComponent.getInitialProps!(ctx)).to.deep.equal({
                ...wrappedPageProps,
                permissionDenied: false,
            });

            const page = await renderNextPage(TestComponent, ctx);
            expect(page.container.textContent).to.equal('default message');
        });
        it('should render the PermissionDenied page if the user lacks the required policy', async () => {
            const action = 'view-secret-info';
            const TestComponent = withPermission(
                WrappedComponent,
                <PermissionDenied />,
                permissionServiceFactory,
                action,
            ) as NextPage;
            expect(await TestComponent.getInitialProps!(documentContext)).to.deep.equal({ permissionDenied: true });

            const page = await renderNextPage(TestComponent, documentContext);
            expect(page.container.textContent).to.equal('Permission Denied');
        });
    });
});
