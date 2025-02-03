import { Agent } from 'https';
import { Logger } from '@ukri-tfs/logging';
import { AgentProvider } from './agentProvider';

/**
 * An agent which always returns a vanilla Agent instance with no certificate
 * configuration. This can be used to make calls to external
 * services only as it lacks the private certificate information
 * to interact with TFS APIs.
 */
export class AgentProviderUnconfigured implements AgentProvider {
    readonly agent: Agent;

    constructor(private readonly logger: Logger) {
        this.agent = new Agent();
    }

    getAgent(): Promise<Agent> {
        this.logger.debug('AgentProviderStub resolving unconfigured agent');
        return Promise.resolve(this.agent);
    }
}
