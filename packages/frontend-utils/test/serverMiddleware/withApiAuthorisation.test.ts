/* eslint @typescript-eslint/no-explicit-any: 0 */
/* disabled to allow switching eslint warnings to errors */
import { RoleType, User } from '@ukri-tfs/auth';
import { expect, should, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { ServerResponse } from 'http';
import { describe } from 'mocha';
import { NextApiResponse } from 'next';
import { NextApiHandlerWithContext, NextApiRequestWithContext, withApiAuthorisation } from '../../src/serverMiddleware';

describe('with Api Authorisation tests', () => {
    should();
    use(chaiAsPromised);

    // create users
    const authorisedUser = {
        id: 1,
        cognitoId: '',
        tfsId: 'TfsAdmin',
        roles: [{ name: RoleType.TfsAdmin }],
    } as User;
    const unauthorisedUser = { id: 1, cognitoId: '', tfsId: 'TfsAdmin', roles: [] } as User;
    it('should throw error if user is not in the required role', async () => {
        // given a requestContext for an unauthorised user
        const request = {
            context: {
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
            },
        } as unknown as NextApiRequestWithContext;
        const response = new ServerResponse(request);
        const handler: NextApiHandlerWithContext<void> = async (_req, res) => {
            res.status(200);
        };

        const apiHandler = withApiAuthorisation(handler, [RoleType.TfsAdmin]);

        await expect(apiHandler(request, response as unknown as NextApiResponse)).to.eventually.be.rejected;
    });

    it('should add api authorization to handler and respond with correct status code', async () => {
        const request = {
            context: {
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
            },
        } as unknown as NextApiRequestWithContext;
        const response = new ServerResponse(request);

        const handler: NextApiHandlerWithContext<void> = async (_req, res) => {
            res.statusCode = 201;
        };
        const apiHandler = withApiAuthorisation(handler, [RoleType.TfsAdmin]);

        await apiHandler(request, response as unknown as NextApiResponse);
        expect(response.statusCode).to.equal(201);
    });
});
