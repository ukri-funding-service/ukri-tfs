import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { isRequestAllowedByRole, isRequestSystemCall, RoleType, User } from '../../src/auth';
import { RequestContext } from '../../src/auth/context';
import { NoopLogger } from '@ukri-tfs/logging';

describe('isRequestAllowedByRole tests', async () => {
    chai.should();
    chai.use(chaiAsPromised);

    let requestContext: RequestContext;
    const allowedRoles = [RoleType.TfsAdmin];

    beforeEach(() => {
        requestContext = {
            service: 'TEST',
            correlationIds: {
                root: '123456',
                parent: '78910',
                current: '121314',
            },
            userData: {
                userId: '123',
            },
            logger: new NoopLogger(),
        } as RequestContext;
    });

    it('should return false if requestContext.userContext.user resolves to an undefined value', async () => {
        requestContext.userData.user = Promise.resolve(undefined);

        const result = isRequestAllowedByRole(requestContext, allowedRoles);

        return expect(result).to.eventually.be.false;
    });

    it('should return false if requestContext.userContext.user resolves to a user with no roles', async () => {
        requestContext.userData.user = Promise.resolve({
            id: 123,
            tfsId: '123456',
            cognitoId: '123456',
            personId: 123,
            displayName: 'Test User',
            roles: [],
        } as User);

        const result = isRequestAllowedByRole(requestContext, allowedRoles);

        return expect(result).to.eventually.be.false;
    });

    it('should return false if requestContext.userContext.user resolves to a user with no matching roles', async () => {
        requestContext.userData.user = Promise.resolve({
            id: 123,
            tfsId: '123456',
            cognitoId: '123456',
            personId: 123,
            displayName: 'Test User',
            roles: [
                {
                    id: 2,
                    name: RoleType.Applicant,
                    displayName: 'Applicant',
                },
            ],
        } as User);

        const result = isRequestAllowedByRole(requestContext, allowedRoles);

        return expect(result).to.eventually.be.false;
    });

    it('should return false if requestContext.userData.user resolves to a user with a matching role', async () => {
        requestContext.userData.user = Promise.resolve({
            id: 123,
            tfsId: '123456',
            cognitoId: '123456',
            personId: 123,
            displayName: 'Test User',
            roles: [
                {
                    id: 2,
                    name: RoleType.TfsAdmin,
                    displayName: 'TFS Admin',
                },
            ],
        } as User);

        const result = isRequestAllowedByRole(requestContext, allowedRoles);

        return expect(result).to.eventually.be.true;
    });
});

describe('isRequestSystemCall tests', async () => {
    let requestContext: RequestContext;

    beforeEach(() => {
        requestContext = {
            service: 'TEST',
            correlationIds: {
                root: '123456',
                parent: '78910',
                current: '121314',
            },
            userData: {
                userId: '123',
            },
            logger: new NoopLogger(),
        } as RequestContext;
    });

    it('should return false if requestContext.userContext.user resolves to an undefined value', async () => {
        requestContext.userData.user = Promise.resolve(undefined);

        const result = isRequestSystemCall(requestContext);

        return expect(result).to.eventually.be.false;
    });

    it('should return false if requestContext.userContext.user resolves to a user with no roles', async () => {
        requestContext.userData.user = Promise.resolve({
            id: 123,
            tfsId: '123456',
            cognitoId: '123456',
            personId: 123,
            displayName: 'Test User',
            roles: [],
        } as User);

        const result = isRequestSystemCall(requestContext);

        return expect(result).to.eventually.be.false;
    });

    it('should return false if requestContext.userContext.user resolves to a user with no matching roles', async () => {
        requestContext.userData.user = Promise.resolve({
            id: 123,
            tfsId: '123456',
            cognitoId: '123456',
            personId: 123,
            displayName: 'Test User',
            roles: [
                {
                    id: 2,
                    name: RoleType.Applicant,
                    displayName: 'Applicant',
                },
            ],
        } as User);

        const result = isRequestSystemCall(requestContext);

        return expect(result).to.eventually.be.false;
    });
});
