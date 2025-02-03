import { Logger } from '@ukri-tfs/logging';
import { SecretProvider } from '@ukri-tfs/secrets';
import { Agent } from 'https';
import { CertificateChainProvider } from '../cert/certificateChainProvider';
import { AgentProvider, HttpsAgentConfig } from './agentProvider';

export class AgentProviderAcmPcaClient implements AgentProvider {
    constructor(
        private readonly config: HttpsAgentConfig,
        private readonly secretProvider: SecretProvider,
        private readonly certChainProvider: CertificateChainProvider,
        private readonly logger: Logger,
    ) {}

    getAgent(): Promise<Agent> {
        this.logger.debug('AgentProviderAcmPcaClient building agent');

        return buildAgent(
            this.config.keySecretName,
            this.config.certificateSecretName,
            this.secretProvider,
            this.certChainProvider,
        );
    }
}

// Removing this from coverage as it is purely aggregating other calls which are covered
/* istanbul ignore next */
export const buildAgent = async (
    keySecretName: string,
    certificateSecretName: string,
    secretProvider: SecretProvider,
    certChainProvider: CertificateChainProvider,
): Promise<Agent> => {
    const key = await secretProvider.getSecret(keySecretName);
    const certificate = await secretProvider.getSecret(certificateSecretName);
    const certificateAuthorityCertificate = await certChainProvider.getCertificateChain();

    return new Agent({
        ca: certificateAuthorityCertificate,
        key: key,
        cert: certificate,
    });
};
