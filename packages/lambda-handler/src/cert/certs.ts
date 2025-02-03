import {
    ACMPCAClient,
    GetCertificateAuthorityCertificateCommand,
    ListCertificateAuthoritiesCommand,
} from '@aws-sdk/client-acm-pca'; // TODO abstract this concrete impl

export async function getCACertificateChain(acmPcaClient: ACMPCAClient): Promise<string> {
    const result = await acmPcaClient.send(new ListCertificateAuthoritiesCommand({}));

    const subordinateCA = result.CertificateAuthorities?.find(ca => {
        return ca.Status === 'ACTIVE' && ca.Type === 'SUBORDINATE';
    });

    if (!subordinateCA || !subordinateCA.Arn) {
        throw new Error('Subordinate CA or ARN not found');
    }

    const r = await acmPcaClient.send(
        new GetCertificateAuthorityCertificateCommand({ CertificateAuthorityArn: subordinateCA.Arn }),
    );

    if (!r.CertificateChain) {
        throw new Error('CA Certificate Chain not found');
    }

    return r.CertificateChain;
}
