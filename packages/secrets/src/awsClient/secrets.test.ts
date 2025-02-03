import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { describe, expect, it, jest } from '@jest/globals';
import { getValueFromSecretsManager } from './secrets';

describe('get secret', () => {
    it('should get secret from AWS', async () => {
        const mockLogger = {
            audit: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
            info: jest.fn(),
            warn: jest.fn(),
        };

        jest.spyOn(SecretsManagerClient.prototype, 'send').mockResolvedValue({
            SecretString: 'secret-value',
            ARN: 'secret-ARN',
            Name: 'secret-name',
            VersionId: 'secret-versionId',
            VersionStages: ['secret-versionStages'],
        } as never);

        const result = await getValueFromSecretsManager('secret-id', 'aws-region', mockLogger);

        expect(result).toBe('secret-value');
        expect(mockLogger.debug).toHaveBeenNthCalledWith(
            1,
            'getValueFromSecretsManager: Getting secret for secret-id and aws-region',
        );
        expect(mockLogger.debug).toHaveBeenNthCalledWith(
            2,
            'getValueFromSecretsManager: Secret retrieved. ARN: secret-ARN Version: secret-versionId Version Stages: ["secret-versionStages"] Name: secret-name',
        );
    });
});
