import {
    GetSecretValueCommand,
    GetSecretValueCommandOutput,
    SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { Logger } from '@ukri-tfs/logging';
import { SecretProvider } from '../secretProvider';

export const stringifyMetadata = (result: GetSecretValueCommandOutput): string => {
    return `ARN: ${result.ARN}
        Version: ${result.VersionId}
        Version Stages: ${JSON.stringify(result.VersionStages, null, 0)}
        Name: ${result.Name}`;
};

/**
 * Implementation of SecretProvider using AWS Secrets Manager
 * @see SecretProvider
 */
export class SecretsManagerSecretProvider implements SecretProvider {
    constructor(private readonly secretsManager: SecretsManagerClient, private readonly logger: Logger) {}

    async getSecret(id: string): Promise<string> {
        this.logger.debug(`getSecret: Getting secret for ${id}`);

        const result = await this.secretsManager.send(new GetSecretValueCommand({ SecretId: id }));

        this.logger.debug(`getSecret: Secret retrieved. ${stringifyMetadata(result)}`);

        return result.SecretString!;
    }
}
