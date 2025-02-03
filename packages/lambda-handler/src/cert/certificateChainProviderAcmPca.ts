import { ACMPCAClient } from '@aws-sdk/client-acm-pca';
import { CertificateChainProvider } from './certificateChainProvider';
import { getCACertificateChain } from './certs';
import { Logger } from '@ukri-tfs/logging';

export class CertificateChainProviderACMPCA implements CertificateChainProvider {
    readonly acmPcaClient: ACMPCAClient;

    constructor(private readonly logger: Logger) {
        const region = process.env.AWS_REGION || 'eu-west-2';

        this.logger.debug(`Constructing ACMPCAClient with region ${region}`);
        this.acmPcaClient = new ACMPCAClient({ region });
    }

    async getCertificateChain(): Promise<string> {
        return getCACertificateChain(this.acmPcaClient);
    }
}
