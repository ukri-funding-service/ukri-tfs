import { SecretProvider } from '@ukri-tfs/secrets';
import { HttpsAgentConfig } from './agentProvider';
import { AgentProviderAcmPcaClient } from './agentProviderAcmPcaClient';
import { CertificateChainProvider } from '../cert/certificateChainProvider';
import { Logger, NoopLogger } from '@ukri-tfs/logging';
import * as agentMocks from './agentProviderAcmPcaClient';
import { Agent } from 'https';

const stubAgentConfig: HttpsAgentConfig = {
    keySecretName: 'test-key-secret-name',
    certificateSecretName: 'test-certificate-secret-name',
};

const stubSecretProvider: SecretProvider = {
    getSecret: (): Promise<string> => Promise.resolve('stub-secret-value'),
};

const stubCertChainProvider: CertificateChainProvider = {
    getCertificateChain: (): Promise<string> => Promise.resolve('stub-cert-chain'),
};

const stubLogger = new NoopLogger();
const stubAgent = new Agent();

describe('packages/lambda-handler - tfsServiceClient/agentProviderAcmPcaClient', () => {
    describe('AgentProviderAcmPcaClient', () => {
        let spiedBuildAgent: jest.SpiedFunction<typeof agentMocks['buildAgent']>;

        beforeEach(() => {
            spiedBuildAgent = jest.spyOn(agentMocks, 'buildAgent').mockImplementation(() => Promise.resolve(stubAgent));
        });

        afterEach(jest.resetAllMocks);

        it('can be constructed', () => {
            expect(
                new AgentProviderAcmPcaClient(stubAgentConfig, stubSecretProvider, stubCertChainProvider, stubLogger),
            ).toBeDefined;
        });

        it('returns an Agent', async () => {
            const uut = new AgentProviderAcmPcaClient(
                stubAgentConfig,
                stubSecretProvider,
                stubCertChainProvider,
                stubLogger,
            );

            await expect(uut.getAgent()).resolves.toBeInstanceOf(Agent);
        });

        it('delegates to the buildAgent method', async () => {
            const uut = new AgentProviderAcmPcaClient(
                stubAgentConfig,
                stubSecretProvider,
                stubCertChainProvider,
                stubLogger,
            );

            await uut.getAgent();

            expect(spiedBuildAgent).toHaveBeenCalledTimes(1);
        });

        it('delegates to the buildAgent method the key secret name', async () => {
            const uut = new AgentProviderAcmPcaClient(
                stubAgentConfig,
                stubSecretProvider,
                stubCertChainProvider,
                stubLogger,
            );

            await uut.getAgent();

            expect(spiedBuildAgent.mock.calls[0][0]).toEqual('test-key-secret-name');
        });

        it('delegates to the buildAgent method the cert secret name', async () => {
            const uut = new AgentProviderAcmPcaClient(
                stubAgentConfig,
                stubSecretProvider,
                stubCertChainProvider,
                stubLogger,
            );

            await uut.getAgent();

            expect(spiedBuildAgent.mock.calls[0][1]).toEqual('test-certificate-secret-name');
        });

        it('delegates to the buildAgent method the cert chain provider', async () => {
            const uut = new AgentProviderAcmPcaClient(
                stubAgentConfig,
                stubSecretProvider,
                stubCertChainProvider,
                stubLogger,
            );

            await uut.getAgent();

            expect(spiedBuildAgent.mock.calls[0][2]).toBe(stubSecretProvider);
        });

        it('delegates to the buildAgent method the logger', async () => {
            const uut = new AgentProviderAcmPcaClient(
                stubAgentConfig,
                stubSecretProvider,
                stubCertChainProvider,
                stubLogger,
            );

            await uut.getAgent();

            expect(spiedBuildAgent.mock.calls[0][3]).toBe(stubCertChainProvider);
        });

        it('logs that it is constructing an agent', async () => {
            const loggerMock: Logger = {
                audit: jest.fn(),
                debug: jest.fn(),
                info: jest.fn(),
                warn: jest.fn(),
                error: jest.fn(),
            };

            const uut = new AgentProviderAcmPcaClient(
                stubAgentConfig,
                stubSecretProvider,
                stubCertChainProvider,
                loggerMock,
            );

            await uut.getAgent();

            expect(loggerMock.debug).toHaveBeenCalledTimes(1);
            expect((loggerMock.debug as jest.Mock<Logger['debug']>).mock.calls[0][0]).toMatch(
                /AgentProviderAcmPcaClient building agent/,
            );
        });
    });
});
