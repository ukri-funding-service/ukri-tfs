export interface CertificateChainProvider {
    getCertificateChain(): Promise<string>;
}
