import { describe, expect, it, jest } from '@jest/globals';
import { UserContext } from '@ukri-tfs/auth';
import { TfsRestClient } from '@ukri-tfs/http';
import { Logger } from '@ukri-tfs/logging';
import { PermissionService, PolicyManagementService } from './permissionService';
import { PermissionServiceFactory, PolicyManagementServiceFactory } from './permissionServiceFactory';

describe('PermissionServiceFactory tests', () => {
    const mockLogger: Logger = {
        audit: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
        debug: jest.fn(),
    };

    it('builds a PermissionService', () => {
        const factory = new PermissionServiceFactory(mockLogger);

        expect(factory.build({} as UserContext)).toBeInstanceOf(PermissionService);
    });

    it('builds a policyManagementService with provided policy service', () => {
        const factory = new PolicyManagementServiceFactory(mockLogger, {} as TfsRestClient);

        expect(factory.build({} as UserContext, 'scope')).toBeInstanceOf(PolicyManagementService);
    });
});
