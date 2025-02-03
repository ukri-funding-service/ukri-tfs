/* eslint @typescript-eslint/no-explicit-any: 0 */
/* disabled to allow switching eslint warnings to errors */
import { render } from '@testing-library/react';
import { RequestContext, RoleType, User } from '@ukri-tfs/auth';
import { expect, should, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { IncomingMessage, ServerResponse } from 'http';
import { describe } from 'mocha';
import { Socket } from 'net';
import { NextPage, NextPageContext } from 'next';
import React from 'react';
import sinon from 'sinon';
import { withPageAuthorisation } from '../../src/components';
import { AppRequest } from '../../src/pageFunctions';

describe('withPageAuthorisation tests', () => {
    should();
    use(chaiAsPromised);

    // create generic wrapped component
    const wrappedComponent: NextPage<{}> = () => {
        return <p>Success</p>;
    };

    // create users
    const authorisedUser = {
        id: 1,
        cognitoId: '',
        tfsId: 'TfsAdmin',
        roles: [{ name: RoleType.TfsAdmin }],
    } as User;
    const unauthorisedUser = { id: 1, cognitoId: '', tfsId: 'TfsAdmin', roles: [] } as User;

    let request: IncomingMessage;
    let response: ServerResponse;
    let documentContext: NextPageContext;

    beforeEach(() => {
        request = new IncomingMessage(new Socket());
        (request as any).context = {};
        response = new ServerResponse(request);
        documentContext = { req: request, res: response } as NextPageContext;
        wrappedComponent.getInitialProps = undefined;
    });

    it('should throw error if user is not in the required role', () => {
        // given a requestContext for an unauthorised user
        (request as AppRequest).context = {
            logger: {},
            service: 'frontend',
            userData: {
                user: Promise.resolve(unauthorisedUser),
                userId: '1234-1234-1234-1234',
            },
            correlationIds: {
                root: '1234-1234-1234-1234',
                parent: '1234-1234-1234-1234',
                current: '1234-1234-1234-1234',
            },
        } as RequestContext;
        response = new ServerResponse(request);
        documentContext = { req: request, res: response } as NextPageContext;

        // when the component is created
        const TestComponent = withPageAuthorisation(wrappedComponent, [RoleType.TfsAdmin]) as any;

        // then the component should throw
        return expect(TestComponent.getInitialProps!(documentContext)).to.eventually.be.rejected;
    });

    it('should render component if user is in the required role', () => {
        // given a requestContext for an authorised user
        (request as AppRequest).context = {
            logger: {},
            service: 'frontend',
            userData: {
                user: Promise.resolve(authorisedUser),
                userId: '1234-1234-1234-1234',
            },
            correlationIds: {
                root: '1234-1234-1234-1234',
                parent: '1234-1234-1234-1234',
                current: '1234-1234-1234-1234',
            },
        } as RequestContext;
        response = new ServerResponse(request);
        documentContext = { req: request, res: response } as NextPageContext;

        // and a getInitialProps call that returns a success message
        wrappedComponent.getInitialProps = async (_ctx: NextPageContext) => Promise.resolve({ message: 'success' });

        // when the component is created
        const TestComponent = withPageAuthorisation(wrappedComponent, [RoleType.TfsAdmin]) as NextPage;

        // then the component should resolve
        return expect(TestComponent.getInitialProps!(documentContext)).to.eventually.eql({
            message: 'success',
        });
    });

    it('should request initial props of component if they are provided', () => {
        // given a requestContext for an authorised user
        (request as AppRequest).context = {
            logger: {},
            service: 'frontend',
            userData: {
                user: Promise.resolve(authorisedUser),
                userId: '1234-1234-1234-1234',
            },
            correlationIds: {
                root: '1234-1234-1234-1234',
                parent: '1234-1234-1234-1234',
                current: '1234-1234-1234-1234',
            },
        } as RequestContext;
        response = new ServerResponse(request);
        documentContext = { req: request, res: response } as NextPageContext;

        // and a getInitialProps call
        const propsSpy = sinon.spy();
        wrappedComponent.getInitialProps = propsSpy();

        // when the component is created
        const TestComponent = withPageAuthorisation(wrappedComponent, [RoleType.TfsAdmin]) as any;

        // and mounted
        render(<TestComponent />);

        // then the getInitialProps function should be called once
        return expect(propsSpy.calledOnce).to.be.true;
    });

    it('should return null as props of component if they not provided', async () => {
        // given a requestContext for an authorised user
        (request as AppRequest).context = {
            logger: {},
            service: 'frontend',
            userData: {
                user: Promise.resolve(authorisedUser),
                userId: '1234-1234-1234-1234',
            },
            correlationIds: {
                root: '1234-1234-1234-1234',
                parent: '1234-1234-1234-1234',
                current: '1234-1234-1234-1234',
            },
        } as RequestContext;
        response = new ServerResponse(request);
        documentContext = { req: request, res: response } as NextPageContext;
        const emptyWrappedComponent: NextPage<{}> = () => {
            return <p>Success</p>;
        };

        // and no getInitialProps
        emptyWrappedComponent.getInitialProps = undefined;

        // when the page is loaded
        const TestComponent = withPageAuthorisation(emptyWrappedComponent, [RoleType.TfsAdmin]) as NextPage;

        // then getInitialProps will return null
        return expect(TestComponent.getInitialProps!(documentContext)).to.eventually.eql(null);
    });
});
