import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { Logger } from '@ukri-tfs/logging';
import { SecretsManagerSecretProvider } from './secretsManagerSecretProvider';

/**
 * The default region for AWS clients.
 */
const DEFAULT_REGION = 'eu-west-2';

/**
 * Builds an instance of SecretsManagerSecretProvider with the provided configuration.
 * If not specified, a default SecretsManagerClient client will be instantiated with the region configured to
 * the DEFAULT_REGION.
 */
export class Builder {
    private client: SecretsManagerClient = new SecretsManagerClient({ region: DEFAULT_REGION });
    private logger: Logger | undefined;

    withClient(client: SecretsManagerClient): Builder {
        this.client = client;
        return this;
    }

    withLogger(logger: Logger): Builder {
        this.logger = logger;
        return this;
    }

    build(): SecretsManagerSecretProvider {
        if (this.logger === undefined) {
            throw new Error('logger is required');
        }

        return new SecretsManagerSecretProvider(this.client, this.logger);
    }
}
