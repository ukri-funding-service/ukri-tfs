import { Logger, NoopLogger } from '@ukri-tfs/logging';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { IncomingMessage } from 'http';
import { describe } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { User } from '../../../src/auth';
import {
    RequestContext,
    anonymousUser,
    createRequestContext,
    getNonAnonTfsIdFromRequestOrThrow,
    getTfsIdFromRequestOrAnonId,
    withUser,
} from '../../../src/auth/context';

describe('Request context tests', async () => {
    chai.should();
    chai.use(chaiAsPromised);
    chai.use(sinonChai);

    const logger: Logger = new NoopLogger();

    afterEach(sinon.restore);

    describe('withUser', async () => {
        const userId = '123';

        const requestContext: RequestContext = {
            logger: logger,
            correlationIds: {
                root: '123456',
                parent: '78910',
                current: '121314',
            },
            userData: {
                userId: userId,
                user: Promise.resolve(undefined),
            },
            service: 'TEST',
        };

        const requestContextWithAnonymousUserId = {
            logger: logger,
            correlationIds: {
                root: '123456',
                parent: '78910',
                current: '121314',
            },
            userData: {
                userId: anonymousUser,
            },
            service: 'TEST',
        } as RequestContext;

        const requestContextWithoutUserId = {
            logger: logger,
            correlationIds: {
                root: '123456',
                parent: '78910',
                current: '121314',
            },
            userData: {
                userId: undefined,
            },
            service: 'TEST',
        } as RequestContext;

        const user = {
            id: 123,
            personId: 456,
            roles: [{ id: 1, name: 'TfsAdmin', displayName: 'Tfs Admin' }],
        } as User;

        const getUserByTfsId = sinon.stub().returns(user);

        it('should throw an error and not call getUserByTfsId given no userId', async () => {
            const requestContextResult = await withUser(requestContextWithoutUserId, getUserByTfsId);

            await expect(requestContextResult.userData.user).to.eventually.be.rejectedWith(
                Error,
                'Missing credentials',
            );

            expect(getUserByTfsId).not.to.have.been.called;
        });

        it('should not call getUserByTfsId given an anonymous userId', async () => {
            await withUser(requestContextWithAnonymousUserId, getUserByTfsId);

            expect(getUserByTfsId).not.to.have.been.called;
        });

        it('should call getUserByTfsId exactly once given a valid userId', async () => {
            await withUser(requestContext, getUserByTfsId).then(ctx => ctx.userData.user);

            expect(getUserByTfsId).to.have.been.calledOnce;
        });

        it('should call getUserByTfsId with the supplied UserContext and user ID', async () => {
            await withUser(requestContext, getUserByTfsId);

            expect(getUserByTfsId).to.have.been.calledOnceWith(userId, userId);
        });

        it('should throw an error given getUserByTfsId throws an error', async () => {
            const getUserByTfsIdThrowsError = sinon.stub().rejects(new Error("That didn't work"));

            const resultUser = await withUser(requestContext, getUserByTfsIdThrowsError);

            await expect(resultUser.userData.user).to.be.rejectedWith("That didn't work");
        });

        it('should return a requestContext containing an undefined user object given an anonymous userId', async () => {
            const requestContextResult = await withUser(requestContextWithAnonymousUserId, getUserByTfsId);
            const userResult = await requestContextResult.userData.user;

            expect(userResult).to.be.undefined;
        });

        it('should return a requestContext containing the user object returned by getUserByTfsId', async () => {
            const requestContextResult = await withUser(requestContext, getUserByTfsId);
            const userResult = await requestContextResult.userData.user;

            expect(userResult).to.equal(user);
        });

        describe('requestContext - getNonAnonTfsIdFromRequestOrThrow', () => {
            it('should get tfs id when the request is valid', () => {
                const tfsId = getNonAnonTfsIdFromRequestOrThrow(requestContext);

                expect(tfsId).to.equal(userId);
            });
            it('should throw when there is no tfsId', () => {
                const call = () => getNonAnonTfsIdFromRequestOrThrow(requestContextWithoutUserId);

                expect(call).to.throw('Invalid UserID');
            });
        });

        describe('requestContext - getTfsIdFromRequestOrAnon', () => {
            it('should get tfs id when the request is valid', () => {
                const tfsId = getTfsIdFromRequestOrAnonId(requestContext);

                expect(tfsId).to.equal(userId);
            });
            it('should return anon where there is no tfsId', () => {
                const tfsId = getTfsIdFromRequestOrAnonId(requestContextWithoutUserId);

                expect(tfsId).to.equal('anon');
            });
        });
    });

    describe('createRequestContext', () => {
        it('should return a requestContext object containing the relevant information', async () => {
            const userIdHeader = '123';
            const req = {
                method: 'GET',
                url: '/uri-for-unit-test',
                headers: {
                    'x-tfsuserid': userIdHeader,
                },
            } as unknown as IncomingMessage;
            const service = 'ADMIN';
            const correlationIds = {
                root: '123456',
                parent: '78910',
                current: '121314',
            };
            const user = { id: 123 } as User;
            const getUserFn = sinon.stub().returns(user);

            const result = await createRequestContext(req, service, correlationIds, logger, getUserFn);

            expect(result.service).to.equal(service);
            expect(result.correlationIds).to.equal(correlationIds);
            expect(result.logger).to.equal(logger);
            expect(result.userData.userId).to.equal(userIdHeader);
            expect(result.userData.user).to.eventually.equal(user);
        });
    });
});
