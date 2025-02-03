import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { describe, expect, it, beforeEach } from '@jest/globals';
import { NoopLogger } from '@ukri-tfs/logging';
import { SecretsManagerSecretProvider } from './secretsManagerSecretProvider';

// Ignored because this is a false positive - only the actual 'aws-sdk' import
// is not allowed
// eslint-disable-next-line deprecate/import
import { mockClient, AwsClientStub } from 'aws-sdk-client-mock';

describe('packages/secrets - awsClient/secretsManagerSecretProvider', () => {
    describe('getSecret', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let secretsManagerClientMock: AwsClientStub<SecretsManagerClient>;

        beforeEach(() => {
            secretsManagerClientMock = mockClient(SecretsManagerClient);
        });

        it('should get secret from AWS', async () => {
            secretsManagerClientMock.on(GetSecretValueCommand).resolves({
                SecretString: 'secret-value',
                ARN: 'secret-ARN',
                Name: 'secret-name',
                VersionId: 'secret-versionId',
                VersionStages: ['secret-versionStages'],
            });

            const uut = new SecretsManagerSecretProvider(new SecretsManagerClient(), new NoopLogger());

            const result = await uut.getSecret('secret-id');

            expect(result).toBe('secret-value');
        });

        it('should reject when AWS rejects', async () => {
            secretsManagerClientMock.on(GetSecretValueCommand).rejects(new Error('undefined error for test purposes'));
            const uut = new SecretsManagerSecretProvider(new SecretsManagerClient(), new NoopLogger());

            await expect(uut.getSecret('secret-id')).rejects.toEqual(Error('undefined error for test purposes'));
        });
    });
});
