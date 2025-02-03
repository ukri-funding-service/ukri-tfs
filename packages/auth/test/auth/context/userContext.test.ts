import { Logger, NoopLogger } from '@ukri-tfs/logging';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { User } from '../../../src';
import {
    RequestContext,
    UserContext,
    getUserContextFromRequestContext,
    getUserDataFromRequestContextOrThrow,
    getUserIdFromUserContext,
} from '../../../src/auth/context';

describe('User context tests', async () => {
    chai.should();
    chai.use(chaiAsPromised);
    chai.use(sinonChai);

    const logger: Logger = new NoopLogger();

    afterEach(sinon.restore);

    const user = {
        id: 123,
        personId: 456,
        roles: [{ id: 1, name: 'TfsAdmin', displayName: 'Tfs Admin' }],
    } as User;

    const correlationIds = {
        root: 'CORRELATION_IDS_ROOT',
        parent: 'CORRELATION_IDS_PARENT',
        current: 'CORRELATION_IDS_CURRENT',
    };

    const requestContext: RequestContext = {
        logger: logger,
        correlationIds,
        userData: {
            userId: 'USER_ID',
            user: Promise.resolve(user),
        },
        service: 'TEST_SERVICE',
    };

    const userContext: UserContext = {
        service: 'TEST_SERVICE',
        correlationIds: correlationIds,
        userId: 'USER_ID',
        user: Promise.resolve(user),
    };

    describe('getUserContextFromRequestContext', () => {
        it('should return the User context from the provided Request context', () => {
            const response = getUserContextFromRequestContext(requestContext);

            expect(response.service).to.equal(requestContext.service);
            expect(response.correlationIds).to.deep.equal(requestContext.correlationIds);
            expect(response.userId).to.equal(requestContext.userData.userId);
            expect(response.user).to.deep.equal(requestContext.userData.user);
        });
    });

    describe('getUserDataFromRequestContextOrThrow', () => {
        it('should return the User data from the provided Request context', async () => {
            const response = await getUserDataFromRequestContextOrThrow(requestContext);

            expect(response).to.equal(user);
        });

        it('should throw when user context cannot be return the User context from the provided Request context', async () => {
            const requestContextWithoutUser: RequestContext = {
                ...requestContext,
                userData: {
                    userId: 'USER_ID',
                    user: Promise.resolve(undefined),
                },
            };

            await expect(getUserDataFromRequestContextOrThrow(requestContextWithoutUser)).to.eventually.be.rejectedWith(
                Error,
                'Missing user data',
            );
        });
    });

    describe('getUserIdFromUserContext', () => {
        it('should return the User context from the provided Request context', () => {
            const userID = getUserIdFromUserContext(userContext);

            expect(userID).to.equal(userContext.userId);
        });
    });
});
