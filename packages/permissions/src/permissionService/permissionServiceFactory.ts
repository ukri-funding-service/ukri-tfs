import { UserContext } from '@ukri-tfs/auth';
import { TfsRestClient } from '@ukri-tfs/http';
import { Logger } from '@ukri-tfs/logging';
import { PermissionService, PolicyManagementService } from './permissionService';

export class PermissionServiceFactory {
    constructor(private logger: Logger) {}

    build(userContext: UserContext): PermissionService {
        return new PermissionService(userContext, this.logger);
    }
}

export class PolicyManagementServiceFactory {
    constructor(private logger: Logger, private policyServiceClient: TfsRestClient) {}

    build(userContext: UserContext, scope: string): PolicyManagementService {
        return new PolicyManagementService(userContext, this.logger, this.policyServiceClient, scope);
    }
}
