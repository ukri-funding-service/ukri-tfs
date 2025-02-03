import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Policy, User, UserContext } from '@ukri-tfs/auth';
import { TfsRestClient } from '@ukri-tfs/http';
import { PermissionService, PolicyData, PolicyManagementService } from './permissionService';

describe('Permission service', () => {
    const policyServiceMock = {
        get: jest.fn() as TfsRestClient['get'],
        put: jest.fn() as TfsRestClient['put'],
        post: jest.fn() as TfsRestClient['post'],
        delete: jest.fn() as TfsRestClient['delete'],
    } as TfsRestClient;

    const mockLogger = {
        audit: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
        debug: jest.fn(),
    };

    const action = 'manage-payment-detail-permission';
    const scope = 'payment-detail';

    const mockPolicy: Policy = {
        id: 'uuid',
        action: action,
        scope: scope,
    };

    const mockUser = {
        tfsId: 'fake-tfs-id',
        policies: [],
    } as unknown as User;

    let mockUserContext: UserContext;
    beforeEach(() => {
        mockUser.policies = [];
        mockUserContext = {
            userId: 'fake-tfs-id',
            user: mockUser,
            correlationIds: { root: 'root', current: 'current', parent: 'parent' },
        } as unknown as UserContext;
    });

    describe('userCanPerformAction', () => {
        it('should return false when policy does not exist on user', async () => {
            mockUser.policies = [];
            const permissionService = new PermissionService(mockUserContext, mockLogger);

            expect(await permissionService.userCanPerformAction(action)).toBe(false);
        });

        it('should return true when policy exists on user', async () => {
            mockUser.policies = [mockPolicy];
            const permissionService = new PermissionService(mockUserContext, mockLogger);

            expect(await permissionService.userCanPerformAction(action)).toBe(true);
        });

        it('should return false when user is undefined', async () => {
            mockUserContext.user = undefined;
            const permissionService = new PermissionService(mockUserContext, mockLogger);

            expect(await permissionService.userCanPerformAction(action)).toBe(false);
        });
    });

    describe('PermissionAndPolicyManagementService', () => {
        let permissionService: PolicyManagementService;
        beforeEach(() => {
            permissionService = new PolicyManagementService(
                mockUserContext,
                mockLogger,
                policyServiceMock,
                'test-scope',
            );
        });

        describe('assignPolicy', () => {
            it('should call post command to client api', async () => {
                await permissionService.assignPolicy({} as PolicyData, true);
                expect(policyServiceMock.post).toHaveBeenCalledWith(
                    mockUser.tfsId,
                    `/policy/scope/test-scope?uniquePolicy=true`,
                    {},
                );
            });

            it('should call post command to client api without unique policy', async () => {
                await permissionService.assignPolicy({} as PolicyData, false);
                expect(policyServiceMock.post).toHaveBeenCalledWith(
                    mockUser.tfsId,
                    `/policy/scope/test-scope?uniquePolicy=false`,
                    {},
                );
            });
        });
        describe('updatePolicy', () => {
            it('should call put command to client api', async () => {
                await permissionService.updatePolicyContext({ id: 'wibble', context: 'some-context' } as Policy);
                expect(policyServiceMock.put).toHaveBeenCalledWith(mockUser.tfsId, `/policy/wibble/scope/test-scope`, {
                    correlationIds: mockUserContext.correlationIds,
                    context: 'some-context',
                });
            });
        });

        describe('removePolicy', () => {
            it('should call put command to client api', async () => {
                await permissionService.removePolicy('wibble');
                expect(policyServiceMock.delete).toHaveBeenCalledWith(
                    mockUser.tfsId,
                    `/policy/wibble/scope/test-scope`,
                    {
                        correlationIds: mockUserContext.correlationIds,
                    },
                );
            });
        });

        describe('getPoliciesForPersonByScopeAndAction', () => {
            it('should call get command to client api', async () => {
                await permissionService.getPoliciesForPersonByScopeAndAction(34, 'test-action');
                expect(policyServiceMock.get).toHaveBeenCalledWith(
                    mockUser.tfsId,
                    `/policy?personId=34&action=test-action&scope=test-scope`,
                    {
                        correlationIds: mockUserContext.correlationIds,
                    },
                );
            });

            it('should call handle null vars', async () => {
                await permissionService.getPoliciesForPersonByScopeAndAction(0, '');
                expect(policyServiceMock.get).toHaveBeenCalledWith(mockUser.tfsId, `/policy?scope=test-scope`, {
                    correlationIds: mockUserContext.correlationIds,
                });
            });
        });
    });
});
