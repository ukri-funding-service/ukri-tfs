import {
    ACMPCAClient,
    GetCertificateAuthorityCertificateCommand,
    ListCertificateAuthoritiesCommand,
} from '@aws-sdk/client-acm-pca'; // TODO abstract this concrete impl
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getCACertificateChain } from './certs';

// Ignored because this is a false positive - only the actual 'aws-sdk' import
// is not allowed
// eslint-disable-next-line deprecate/import
import { AwsClientStub, mockClient } from 'aws-sdk-client-mock';

describe('packages/lambda-handler - tfsServiceClient/certs', () => {
    let acmPcaClientMock: AwsClientStub<ACMPCAClient>;

    beforeEach(() => {
        acmPcaClientMock = mockClient(ACMPCAClient);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should get ca cert chain from AWS', async () => {
        acmPcaClientMock
            .on(ListCertificateAuthoritiesCommand)
            .resolves({
                CertificateAuthorities: [{ Status: 'ACTIVE', Type: 'SUBORDINATE', Arn: 'some-arn' }],
            })
            .on(GetCertificateAuthorityCertificateCommand)
            .resolves({ CertificateChain: 'some-cert-chain' });

        const result = await getCACertificateChain(new ACMPCAClient({ region: 'eu-west-2' }));

        expect(result).toBe('some-cert-chain');

        const commandCalls = acmPcaClientMock.commandCalls(GetCertificateAuthorityCertificateCommand);

        expect(commandCalls.length).toEqual(1);
        expect(commandCalls[0].args[0]).toMatchObject({
            input: { CertificateAuthorityArn: 'some-arn' },
        });
    });

    it('should throw error when no certificate authority is found', async () => {
        acmPcaClientMock.on(ListCertificateAuthoritiesCommand).resolves({});
        const acmPcaClient = new ACMPCAClient({ region: 'eu-west-2' });

        await expect(getCACertificateChain(acmPcaClient)).rejects.toThrow('Subordinate CA or ARN not found');
    });

    it('should throw error when no relevant certificate authority is found', async () => {
        acmPcaClientMock.on(ListCertificateAuthoritiesCommand).resolves({
            CertificateAuthorities: [{ Status: 'EXPIRED', Type: 'SUBORDINATE', Arn: 'some-arn' }],
        });

        const acmPcaClient = new ACMPCAClient({ region: 'eu-west-2' });

        await expect(getCACertificateChain(acmPcaClient)).rejects.toThrow('Subordinate CA or ARN not found');
    });

    it('should throw error when no chain present', async () => {
        acmPcaClientMock
            .on(ListCertificateAuthoritiesCommand)
            .resolves({
                CertificateAuthorities: [{ Status: 'ACTIVE', Type: 'SUBORDINATE', Arn: 'some-arn' }],
            })
            .on(GetCertificateAuthorityCertificateCommand)
            .resolves({});

        const acmPcaClient = new ACMPCAClient({ region: 'eu-west-2' });

        await expect(getCACertificateChain(acmPcaClient)).rejects.toThrow('CA Certificate Chain not found');
    });
});
