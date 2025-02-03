import { describe, expect, it } from '@jest/globals';
import { Builder } from './builder';
import { NoopLogger } from '@ukri-tfs/logging';
import { SecretsManagerSecretProvider } from './secretsManagerSecretProvider';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

describe('packages/secrets - awsClient/builder', () => {
    const stubLogger = new NoopLogger();

    it('can be constructed', () => {
        expect(new Builder()).toBeDefined;
    });

    it('will throw on build if required parameters are missing', () => {
        expect(() => new Builder().build()).toThrowError();
    });

    it('will build a SecretsManagerSecretProvider given only required parameters', () => {
        const uut = new Builder().withLogger(stubLogger).build();

        expect(uut).toBeInstanceOf(SecretsManagerSecretProvider);
    });

    it('will accept a replacement SecretsManagerClient', () => {
        const client = new SecretsManagerClient({ region: 'us-west-1' });

        const uut = new Builder().withLogger(stubLogger).withClient(client).build();

        expect(uut).toBeInstanceOf(SecretsManagerSecretProvider);
    });
});
