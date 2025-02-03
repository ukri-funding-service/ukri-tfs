import { Policy, UserContext } from '@ukri-tfs/auth';
import { TfsRestClient } from '@ukri-tfs/http';
import { Logger } from '@ukri-tfs/logging';
import { CorrelationIds } from '@ukri-tfs/tfs-request';

export interface PermissionServiceOperations {
    userCanPerformAction: (action: string) => Promise<boolean>;
}

export interface PolicyManagementServiceOperations extends PermissionServiceOperations {
    assignPolicy: (policyData: PolicyData, uniquePolicy: boolean) => Promise<Policy>;
    updatePolicyContext: (policy: Policy) => Promise<Policy>;
    removePolicy: (policyId: string) => Promise<boolean>;
    getPoliciesForPersonByScopeAndAction: (personId: number, action: string) => Promise<Policy[]>;
}

export declare type PolicyData = {
    personId: number;
    action: string;
    scope: string;
    context: string | undefined;
};
export class PermissionService implements PermissionServiceOperations {
    constructor(protected userContext: UserContext, protected logger: Logger) {}

    async userCanPerformAction(action: string): Promise<boolean> {
        const user = await this.userContext.user;
        const policy = user?.policies?.some((p: Policy) => p.action === action);

        this.logger.audit(`User ${user?.tfsId} can${policy ? '' : ' not'} perform ${action}`);

        return !!policy;
    }
}

export class PolicyManagementService extends PermissionService implements PolicyManagementServiceOperations {
    private loggedInUserId: string;
    private correlationIds: CorrelationIds;

    constructor(
        userContext: UserContext,
        logger: Logger,
        private policyServiceClient: TfsRestClient,
        private scope: string,
    ) {
        super(userContext, logger);
        this.correlationIds = userContext.correlationIds;
        this.loggedInUserId = userContext.userId;
    }

    async assignPolicy(policyData: PolicyData, uniquePolicy: boolean): Promise<Policy> {
        const uniquePolicyString = uniquePolicy ? 'true' : 'false';
        return this.policyServiceClient.post(
            this.loggedInUserId,
            `/policy/scope/${this.scope}?uniquePolicy=${uniquePolicyString}`,
            policyData,
        );
    }

    async updatePolicyContext(policy: Policy): Promise<Policy> {
        const url = `/policy/${policy.id}/scope/${this.scope}`;

        return this.policyServiceClient.put(this.loggedInUserId, url, {
            correlationIds: this.correlationIds,
            context: policy.context,
        });
    }

    async removePolicy(policyId: string): Promise<boolean> {
        const url = `/policy/${policyId}/scope/${this.scope}`;

        return this.policyServiceClient.delete(this.loggedInUserId, url, {
            correlationIds: this.correlationIds,
        });
    }

    async getPoliciesForPersonByScopeAndAction(personId: number, action: string): Promise<Policy[]> {
        const urlParams = new URLSearchParams();
        personId && urlParams.set('personId', personId.toString());
        action && urlParams.set('action', action);

        urlParams.set('scope', this.scope);
        const url = `/policy?${urlParams}`;

        return this.policyServiceClient.get(this.loggedInUserId, url, {
            correlationIds: this.correlationIds,
        });
    }
}
