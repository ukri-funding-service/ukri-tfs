import { NoopLogger } from '@ukri-tfs/logging';
import { AgentProviderUnconfigured } from './agentProviderUnconfigured';
import { Agent } from 'https';

const stubLogger = new NoopLogger();

describe('packages/lambda-handler - tfsServiceClient/agentProviderUnconfigured', () => {
    describe('AgentProviderUncongured', () => {
        it('can be constructed', () => {
            expect(new AgentProviderUnconfigured(stubLogger)).toBeDefined;
        });

        it('returns an Https Agent', async () => {
            const uut = new AgentProviderUnconfigured(stubLogger);
            await expect(uut.getAgent()).resolves.toBeInstanceOf(Agent);
        });
    });
});
