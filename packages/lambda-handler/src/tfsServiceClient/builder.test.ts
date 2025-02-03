import { describe, expect, it } from '@jest/globals';
import { SecretProvider } from '@ukri-tfs/secrets';
import { type FetchFunction } from './tfsFetchFunction';
// eslint-disable-next-line deprecate/import
import { NoopLogger } from '@ukri-tfs/logging';
import { Agent } from 'https';
import { AgentProvider } from '../agent/agentProvider';
import { type AuthorizationProvider } from '../authorization';
import { CorrelationIds } from '../correlationIds/correlationIds';
import { type EventHandlerConfig } from '../eventHandler/config/eventHandlerConfig';
import { Builder } from './builder';

const validUUID = '7683b7e8-6ca8-4ce3-b80f-cae6e96780a8';

const stubCorrelationIds: CorrelationIds = {
    current: validUUID,
    parent: validUUID,
    root: validUUID,
};

class StubSecretProvider implements SecretProvider {
    getSecret = async (): Promise<string> => Promise.resolve('some test secret');
}

class MockAuthorizationProvider implements AuthorizationProvider {
    getAuthorization = async (): Promise<string> => Promise.resolve('Bearer mock-token-for-testing');
}

class StubAgentProvider implements AgentProvider {
    private stubAgent = new Agent();
    getAgent = async (): Promise<Agent> => Promise.resolve(this.stubAgent);
}

const secretProviderStub = new StubSecretProvider();
const agentProviderStub = new StubAgentProvider();
const authorizationProviderStub = new MockAuthorizationProvider();

const stubLogger = new NoopLogger();

describe('packages/lambda-handler - tfsServiceClient/builder', () => {
    const stubEventHandlerConfig: EventHandlerConfig = {
        secretProvider: secretProviderStub,
        agentProvider: agentProviderStub,
        authorizationProvider: authorizationProviderStub,
    };

    describe('common', () => {
        it('should throw with no setup', async () => {
            const uut = new Builder(stubLogger);

            await expect(uut.build()).rejects.toThrowError();
        });

        it('should accept eventHandlerConfig', () => {
            expect(new Builder(stubLogger).withEventHandlerConfig(stubEventHandlerConfig)).toBeInstanceOf(Builder);
        });

        it('should accept fetch implementation', () => {
            const stubFetchFunction = {} as unknown as FetchFunction;
            expect(new Builder(stubLogger).withFetchFunction(stubFetchFunction)).toBeInstanceOf(Builder);
        });

        it('should accept correlationIds', () => {
            expect(new Builder(stubLogger).withCorrelationIds(stubCorrelationIds)).toBeInstanceOf(Builder);
        });
    });

    describe('authorized', () => {
        it('should reject with no setup', async () => {
            const uut = new Builder(stubLogger);

            await expect(uut.build()).rejects.toThrowError();
        });

        it('should build with required parameters', async () => {
            const uut = new Builder(stubLogger)
                .withCorrelationIds(stubCorrelationIds)
                .withEventHandlerConfig(stubEventHandlerConfig);

            await expect(uut.build()).resolves.toBeDefined();
        });

        it('should reject with missing eventHandlerConfig', async () => {
            const uut = new Builder(stubLogger).withCorrelationIds(stubCorrelationIds);

            await expect(uut.build()).rejects.toThrowError(new Error('eventHandlerConfig is a required parameter'));
        });

        it('should reject with missing correlation ids', async () => {
            const uut = new Builder(stubLogger).withEventHandlerConfig(stubEventHandlerConfig);

            await expect(uut.build()).rejects.toThrowError(new Error('correlationIds is a required parameter'));
        });
    });
});
