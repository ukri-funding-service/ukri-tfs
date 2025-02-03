import { describe, expect, it } from '@jest/globals';
import { Builder } from './builder';
import { SecretProvider, SecretsManagerSecretProvider } from '@ukri-tfs/secrets';
import { Agent } from 'https';
import { AgentProvider } from '../../agent/agentProvider';
import { AgentProviderAcmPcaClient } from '../../agent/agentProviderAcmPcaClient';
import { Logger } from '@ukri-tfs/logging';
import { AgentProviderUnconfigured } from '../../agent/agentProviderUnconfigured';
import { AuthorizationProviderStub, type AuthorizationProvider } from '../../authorization';
import { AuthorizationProviderOAuth } from '../../oauth/authorizationProviderOAuth';

const stubSecretProvider: SecretProvider = {
    getSecret: (id: string): Promise<string> => Promise.resolve(`stub-secret-value-for-${id}`),
};

const stubAgent = new Agent({});
const stubAgentProvider: AgentProvider = {
    getAgent: (): Promise<Agent> => Promise.resolve(stubAgent),
};

const stubAuthorizationProvider: AuthorizationProvider = {
    getAuthorization: (): Promise<string> => Promise.resolve('Bearer token-for-testing'),
};

const emptyEnv: NodeJS.ProcessEnv = {};

const fullyPopulatedEnv: NodeJS.ProcessEnv = {
    CLIENT_CREDENTIALS_URL: '',
    CLIENT_CREDENTIALS_ID: '',
    CLIENT_CREDENTIALS_SECRET_NAME: '',
    CLIENT_CREDENTIALS_SCOPE: '',
    KEY_SECRET_NAME: '',
    CERTIFICATE_SECRET_NAME: '',
};

class MockLogger implements Logger {
    callLog = new Array<string>();

    constructor() {}

    reset = (): void => {
        this.callLog = new Array<string>();
    };

    audit = (...args: unknown[]): void => {
        this.callLog.push(`audit ${args.join(' ')}`);
    };
    debug = (...args: unknown[]): void => {
        this.callLog.push(`debug ${args.join(' ')}`);
    };
    info = (...args: unknown[]): void => {
        this.callLog.push(`info ${args.join(' ')}`);
    };
    warn = (...args: unknown[]): void => {
        this.callLog.push(`warn ${args.join(' ')}`);
    };
    error = (...args: unknown[]): void => {
        this.callLog.push(`error ${args.join(' ')}`);
    };
}

describe('packages/lambda-handler - eventHandler/builder', () => {
    describe('construction', () => {
        it('is constructable with empty environment', () => {
            expect(new Builder({})).toBeDefined;
        });

        it('is constructable with non-empty environment', () => {
            expect(new Builder({ someProperty: 'someValue' })).toBeDefined;
        });

        it('is constructable with missing environment', () => {
            expect(new Builder()).toBeDefined;
        });
    });

    describe('build with valid parameters from env', () => {
        const uut = new Builder(fullyPopulatedEnv).withOAuthClientScope('test-scope');

        it('will return a config with a secret provider', async () => {
            expect(uut.build()).toHaveProperty('secretProvider', expect.anything());
        });

        it('will return a config with a secret provider of SecretsManagerSecretProvider type', async () => {
            const config = uut.build();
            expect(config.secretProvider instanceof SecretsManagerSecretProvider).toBeTruthy;
        });

        it('will return a config with an agent provider', async () => {
            expect(uut.build()).toHaveProperty('agentProvider', expect.anything());
        });

        it('will return a config with a agent provider of AgentProviderAcmPcaClient type', async () => {
            const config = uut.build();
            expect(config.agentProvider instanceof AgentProviderAcmPcaClient).toBeTruthy;
        });

        it('will return a config with an authorization provider', async () => {
            expect(uut.build()).toHaveProperty('authorizationProvider', expect.anything());
        });

        it('will return a config with an authorizationProvider provider of AuthorizationProviderOAuth type', async () => {
            const config = uut.build();
            expect(config.authorizationProvider instanceof AuthorizationProviderOAuth).toBeTruthy;
        });
    });

    describe('build with OAuth explicitly omitted', () => {
        const uut = new Builder(fullyPopulatedEnv).withoutOauth();

        it('will return a config with a secret provider', async () => {
            expect(uut.build()).toHaveProperty('secretProvider', expect.anything());
        });

        it('will return a config with a secret provider of SecretsManagerSecretProvider type', async () => {
            const config = uut.build();
            expect(config.secretProvider).toBeInstanceOf(SecretsManagerSecretProvider);
        });

        it('will return a config with an agent provider', async () => {
            expect(uut.build()).toHaveProperty('agentProvider', expect.anything());
        });

        it('will return a config with a agent provider of AgentProviderAcmPcaClient type', async () => {
            const config = uut.build();
            expect(config.agentProvider).toBeInstanceOf(AgentProviderAcmPcaClient);
        });

        it('will return a config with an authorization provider', async () => {
            expect(uut.build()).toHaveProperty('authorizationProvider', expect.anything());
        });

        it('will return a config with an authorizationProvider provider of AuthorizationProviderStub type', async () => {
            const config = uut.build();
            expect(config.authorizationProvider).toBeInstanceOf(AuthorizationProviderStub);
        });

        it('will log that oauth is omitted', async () => {
            const mockLogger = new MockLogger();
            const uutWithMockLogger = new Builder(fullyPopulatedEnv, mockLogger).withoutOauth();
            uutWithMockLogger.build();

            expect(mockLogger.callLog).toContain('info OAuth explicitly disabled, using StubAuthorizationProvider');
        });
    });

    describe('build with Private Certificates explicitly omitted', () => {
        const uut = new Builder(fullyPopulatedEnv).withoutPrivateCertificates();

        it('will return a config with a secret provider', async () => {
            expect(uut.build()).toHaveProperty('secretProvider', expect.anything());
        });

        it('will return a config with a secret provider of SecretsManagerSecretProvider type', async () => {
            const config = uut.build();
            expect(config.secretProvider).toBeInstanceOf(SecretsManagerSecretProvider);
        });

        it('will return a config with an agent provider', async () => {
            expect(uut.build()).toHaveProperty('agentProvider', expect.anything());
        });

        it('will return a config with a agent provider of AgentProviderUnconfigured type', async () => {
            const config = uut.build();
            expect(config.agentProvider).toBeInstanceOf(AgentProviderUnconfigured);
        });

        it('will return a config with an authorization provider', async () => {
            expect(uut.build()).toHaveProperty('authorizationProvider', expect.anything());
        });

        it('will return a config with an authorization provider of AuthorizationProviderOAuth type', async () => {
            const config = uut.build();
            expect(config.authorizationProvider).toBeInstanceOf(AuthorizationProviderOAuth);
        });

        it('will log that private certificates are omitted', async () => {
            const mockLogger = new MockLogger();
            const uutWithMockLogger = new Builder(fullyPopulatedEnv, mockLogger).withoutPrivateCertificates();
            uutWithMockLogger.build();

            expect(mockLogger.callLog).toContain(
                'info Private Certificates explicitly omitted, AgentProvider will return unconfigured Agent',
            );
        });
    });
    describe('build with valid parameters from setters, no env', () => {
        const uut = new Builder(emptyEnv)
            .withOAuthClientScope('test-scope')
            .withSecretProvider(stubSecretProvider)
            .withAuthorizationProvider(stubAuthorizationProvider)
            .withAgentProvider(stubAgentProvider);

        it('will return a config with a secret provider', async () => {
            expect(uut.build()).toHaveProperty('secretProvider', stubSecretProvider);
        });

        it('will return a config with an agent provider', async () => {
            expect(uut.build()).toHaveProperty('agentProvider', stubAgentProvider);
        });

        it('will return a config with an authorization provider', async () => {
            expect(uut.build()).toHaveProperty('authorizationProvider', stubAuthorizationProvider);
        });
    });

    describe('build with valid parameters from both setters and env', () => {
        /* Define a partial env containing only values required to build TokenProvider */
        const partialEnv: NodeJS.ProcessEnv = {
            CLIENT_CREDENTIALS_URL: '',
            CLIENT_CREDENTIALS_ID: '',
            CLIENT_CREDENTIALS_SECRET_NAME: '',
        };

        const uut = new Builder(partialEnv)
            .withOAuthClientScope('test-scope')
            .withSecretProvider(stubSecretProvider)
            /* No authorization provider, that should be build from env */
            .withAgentProvider(stubAgentProvider);

        it('will return a config with a secret provider', async () => {
            expect(uut.build()).toHaveProperty('secretProvider', stubSecretProvider);
        });

        it('will return a config with an agent provider', async () => {
            expect(uut.build()).toHaveProperty('agentProvider', stubAgentProvider);
        });

        it('will return a config with a token provider of AuthorizationProviderOAuth type', async () => {
            const config = uut.build();
            expect(config.authorizationProvider).toBeInstanceOf(AuthorizationProviderOAuth);
        });
    });

    describe('build with valid parameters and unsafe token override in env', () => {
        /* Define a partial env containing only values required to build TokenProvider */
        const partialEnv: NodeJS.ProcessEnv = {
            ACCESS_TOKEN_OVERRIDE: 'test-override-token',
        };

        const mockLogger = new MockLogger();

        const uut = new Builder(partialEnv, mockLogger)
            .withOAuthClientScope('test-scope')
            .withSecretProvider(stubSecretProvider)
            .withAuthorizationProvider(stubAuthorizationProvider)
            .withAgentProvider(stubAgentProvider);

        afterEach(mockLogger.reset);

        it('will return a config with a secret provider', async () => {
            expect(uut.build()).toHaveProperty('secretProvider', stubSecretProvider);
        });

        it('will return a config with an agent provider', async () => {
            expect(uut.build()).toHaveProperty('agentProvider');
        });

        it('will return a config with an authorization provider which resolves to the overridden token', async () => {
            const config = uut.build();

            await expect(config.authorizationProvider.getAuthorization()).resolves.toEqual(
                'Bearer test-override-token',
            );
        });

        it('will log the fact that a dangerous override is taking place', async () => {
            uut.build();

            expect(mockLogger.callLog).toContain(
                'warn *** ACCESS_TOKEN_OVERRIDE is present. Using preset token from env ***',
            );
        });

        it('will handle a missing client scope', () => {
            const uutWithouClientScope = new Builder(partialEnv, mockLogger)
                .withSecretProvider(stubSecretProvider)
                .withAuthorizationProvider(stubAuthorizationProvider)
                .withAgentProvider(stubAgentProvider);

            uutWithouClientScope.build(); // This would be an error for a vanilla build

            expect(mockLogger.callLog).toContain(
                'warn *** ACCESS_TOKEN_OVERRIDE is present. Using preset token from env ***',
            );
        });
    });

    describe('build with missing parameters', () => {
        describe('agentProvider required parameters', () => {
            it('will throw an Error on missing keySecretName', async () => {
                const uutWithMissingEnv = new Builder({
                    // KEY_SECRET_NAME missing, require for agent provider
                    CERTIFICATE_SECRET_NAME: '',
                });

                uutWithMissingEnv
                    .withOAuthClientScope('some-scope')
                    .withAuthorizationProvider(stubAuthorizationProvider)
                    /* Agent provider missing, to be build by builder */
                    .withOAuthClientScope('some-scope')
                    .withSecretProvider(stubSecretProvider);

                expect(() => uutWithMissingEnv.build()).toThrowError(/keySecretName is a required parameter/);
            });

            it('will throw an Error on missing certificateSecretName', async () => {
                const uutWithMissingEnv = new Builder({
                    KEY_SECRET_NAME: '',
                    // CERTIFICATE_SECRET_NAME missing, require for agent provider
                });

                uutWithMissingEnv
                    .withOAuthClientScope('some-scope')
                    .withAuthorizationProvider(stubAuthorizationProvider)
                    /* Agent provider missing, to be build by builder */
                    .withOAuthClientScope('some-scope')
                    .withSecretProvider(stubSecretProvider);

                expect(() => uutWithMissingEnv.build()).toThrowError(/certificateSecretName is a required parameter/);
            });
        });

        describe('tokenProvider required parameters', () => {
            it('will throw an Error on missing clientCredentialsUrl', async () => {
                const uutWithMissingEnv = new Builder({
                    // CLIENT_CREDENTIALS_URL missing, require for token provider
                    CLIENT_CREDENTIALS_ID: '',
                    CLIENT_CREDENTIALS_SECRET_NAME: '',
                });

                uutWithMissingEnv
                    .withOAuthClientScope('some-scope')
                    /* Token provider missing, to be build by builder */
                    .withOAuthClientScope('some-scope')
                    .withSecretProvider(stubSecretProvider)
                    .withAgentProvider(stubAgentProvider);

                expect(() => uutWithMissingEnv.build()).toThrowError(/clientCredentialsUrl is a required parameter/);
            });

            it('will throw an Error on missing clientCredentialsId', async () => {
                const uutWithMissingEnv = new Builder({
                    CLIENT_CREDENTIALS_URL: '',
                    // CLIENT_CREDENTIALS_ID missing, require for token provider
                    CLIENT_CREDENTIALS_SECRET_NAME: '',
                });

                uutWithMissingEnv
                    .withOAuthClientScope('some-scope')
                    /* Token provider missing, to be build by builder */
                    .withSecretProvider(stubSecretProvider)
                    .withAgentProvider(stubAgentProvider);

                expect(() => uutWithMissingEnv.build()).toThrowError(/clientCredentialsId is a required parameter/);
            });

            it('will throw an Error on missing clientCredentialsSecretName', async () => {
                const uutWithMissingEnv = new Builder({
                    CLIENT_CREDENTIALS_URL: '',
                    CLIENT_CREDENTIALS_ID: '',
                    // CLIENT_CREDENTIALS_SECRET_NAME missing, require for token provider
                });

                uutWithMissingEnv
                    .withOAuthClientScope('some-scope')
                    /* Token provider missing, to be build by builder */
                    .withSecretProvider(stubSecretProvider)
                    .withAgentProvider(stubAgentProvider);

                expect(() => uutWithMissingEnv.build()).toThrowError(
                    /clientCredentialsSecretName is a required parameter/,
                );
            });
        });
    });

    describe('logging of provider construction', () => {
        const mockLogger = new MockLogger();

        new Builder(fullyPopulatedEnv, mockLogger).build();

        it('logs construction of an agent provider', () => {
            expect(mockLogger.callLog).toContain('info No AgentProvider set so constructing AgentProviderAcmPcaClient');
        });

        it('logs construction of an authorization provider', () => {
            expect(mockLogger.callLog).toContain(
                'info No AuthorizationProvider set so constructing AuthorizationProviderOAuth',
            );
        });

        it('logs construction of a secret provider', () => {
            expect(mockLogger.callLog).toContain(
                'info No SecretProvider set so constructing SecretsManagerSecretProviderBuilder',
            );
        });
    });
});
