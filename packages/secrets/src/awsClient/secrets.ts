import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { Logger } from '@ukri-tfs/logging';

export async function getValueFromSecretsManager(secretId: string, region: string, logger: Logger): Promise<string> {
    logger.debug(`getValueFromSecretsManager: Getting secret for ${secretId} and ${region}`);

    const client = new SecretsManagerClient({ region });
    const command = new GetSecretValueCommand({ SecretId: secretId });

    const result = await client.send(command);

    logger.debug(
        `getValueFromSecretsManager: Secret retrieved. ARN: ${result.ARN} Version: ${
            result.VersionId
        } Version Stages: ${JSON.stringify(result.VersionStages, null, 0)} Name: ${result.Name}`,
    );

    return result.SecretString!;
}
