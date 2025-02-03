import { type SecretProvider, SecretsManagerSecretProviderBuilder } from '@ukri-tfs/secrets';
import { type AgentProvider, HttpsAgentConfig } from '../../agent/agentProvider';
import { AgentProviderAcmPcaClient } from '../../agent/agentProviderAcmPcaClient';
import { ConsoleLogger, type Logger } from '@ukri-tfs/logging';
import {
    AuthorizationProviderOAuth,
    ClientCredentialsFlowFetchImpl,
    type ClientCredentialsServerConfig,
} from '../../oauth';
import { CertificateChainProviderACMPCA } from '../../cert/certificateChainProviderAcmPca';
import { AgentProviderUnconfigured } from '../../agent/agentProviderUnconfigured';
import { TokenProviderClientCredentials } from '../../token/tokenProviderClientCredentials';
import { TokenProviderPreset } from '../../token/tokenProviderPreset';
import { type AuthorizationProvider, AuthorizationProviderStub } from '../../authorization';
import { EventHandlerConfig } from './eventHandlerConfig';

/**
 * Opinionated Builder for EventHandlerConfig.
 *
 * Without any other configuration, this Builder will use the NodeJS process env to
 * determine settings for the following components.
 *
 * TokenProvider: ClientCredentialsTokenProvider, using
 * - CLIENT_CREDENTIALS_URL
 * - CLIENT_CREDENTIALS_ID
 * - CLIENT_CREDENTIALS_SECRET_NAME
 *
 * SecretProvider: SecretsManagerSecretProvider
 *
 * AgentProvider: AgentProviderAcmPcaClient, using
 * - KEY_SECRET_NAME
 * - CERTIFICATE_SECRET_NAME
 *
 * OAuthClientScope:
 * - CLIENT_CREDENTIALS_SCOPE
 *
 * This env can also be passed in as a constructor parameter.
 *
 * Where these defaults are not appropriate, it is possible to provide specific
 * override implementation via the various with... setters.  It is also possible
 * to 'switch off' the use of the bespoke providers using the without... setters.
 *
 * For instance, to disable the setup of TFS private certificates in the HTTPS Agent
 * use builder.withoutPrivateCertificates()... and a vanilla HTTPS Agent will be
 * used instead. This might be appropriate if the config is being used to setup
 * a handler which does not need to communicate with the TFS APIs.
 */
export class Builder {
    private readonly logger: Logger;
    private readonly env: NodeJS.ProcessEnv;

    private oauthClientScope: string | undefined;
    private secretProvider: SecretProvider | undefined;
    private authorizationProvider: AuthorizationProvider | undefined;
    private agentProvider: AgentProvider | undefined;

    constructor(env?: NodeJS.ProcessEnv, logger: Logger = new ConsoleLogger(console)) {
        this.logger = logger;
        this.env = env ? env : process.env;
        this.oauthClientScope = this.env.CLIENT_CREDENTIALS_SCOPE;
    }

    withOAuthClientScope(oauthClientScope: string): Builder {
        this.oauthClientScope = oauthClientScope;
        return this;
    }

    withSecretProvider(secretProvider: SecretProvider): Builder {
        this.secretProvider = secretProvider;
        return this;
    }

    withAuthorizationProvider(authorizationProvider: AuthorizationProvider): Builder {
        this.authorizationProvider = authorizationProvider;
        return this;
    }

    withAgentProvider(agentProvider: AgentProvider): Builder {
        this.agentProvider = agentProvider;
        return this;
    }

    withoutOauth(): Builder {
        this.logger.info(`OAuth explicitly disabled, using StubAuthorizationProvider`);
        this.authorizationProvider = new AuthorizationProviderStub(this.logger);
        return this;
    }

    withoutPrivateCertificates(): Builder {
        this.logger.info(`Private Certificates explicitly omitted, AgentProvider will return unconfigured Agent`);
        this.agentProvider = new AgentProviderUnconfigured(this.logger);
        return this;
    }

    build(): EventHandlerConfig {
        if (this.env.ACCESS_TOKEN_OVERRIDE !== undefined) {
            this.logger.warn('*** ACCESS_TOKEN_OVERRIDE is present. Using preset token from env ***');
            const tokenProvider = new TokenProviderPreset(this.env.ACCESS_TOKEN_OVERRIDE, this.logger);
            this.authorizationProvider = new AuthorizationProviderOAuth(
                tokenProvider,
                this.oauthClientScope || '',
                this.logger,
            );
            this.agentProvider = new AgentProviderUnconfigured(this.logger);
        }

        if (this.secretProvider === undefined) {
            this.logger.info(`No SecretProvider set so constructing SecretsManagerSecretProviderBuilder`);
            this.secretProvider = new SecretsManagerSecretProviderBuilder().withLogger(this.logger).build();
        }

        if (this.authorizationProvider === undefined) {
            this.logger.info(`No AuthorizationProvider set so constructing AuthorizationProviderOAuth`);
            validateIsDefined(this.oauthClientScope, 'oauthClientScope');

            const oauthClientFlow = new ClientCredentialsFlowFetchImpl(
                getClientCredentialsServerConfig(this.env),
                this.secretProvider,
                this.logger,
            );

            const tokenProvider = new TokenProviderClientCredentials(
                oauthClientFlow,
                this.oauthClientScope!,
                this.logger,
            );

            this.authorizationProvider = new AuthorizationProviderOAuth(
                tokenProvider,
                this.oauthClientScope!,
                this.logger,
            );
        }

        if (this.agentProvider === undefined) {
            this.logger.info(`No AgentProvider set so constructing AgentProviderAcmPcaClient`);

            const certChainProvider = new CertificateChainProviderACMPCA(this.logger);

            this.agentProvider = new AgentProviderAcmPcaClient(
                getAgentConfig(this.env),
                this.secretProvider,
                certChainProvider,
                this.logger,
            );
        }

        this.logger.debug(`Building EventHandlerConfig`);

        return {
            agentProvider: this.agentProvider,
            secretProvider: this.secretProvider,
            authorizationProvider: this.authorizationProvider,
        };
    }
}

export const getAgentConfig = (env: NodeJS.ProcessEnv): HttpsAgentConfig => {
    const keySecretName = env.KEY_SECRET_NAME!;
    const certificateSecretName = env.CERTIFICATE_SECRET_NAME!;

    validateIsDefined(keySecretName, 'keySecretName');
    validateIsDefined(certificateSecretName, 'certificateSecretName');

    const agentConfig: HttpsAgentConfig = {
        keySecretName,
        certificateSecretName,
    };

    return agentConfig;
};

export const getClientCredentialsServerConfig = (env: NodeJS.ProcessEnv): ClientCredentialsServerConfig => {
    const clientCredentialsUrl = env.CLIENT_CREDENTIALS_URL!;
    const clientCredentialsId = env.CLIENT_CREDENTIALS_ID!;
    const clientCredentialsSecretName = env.CLIENT_CREDENTIALS_SECRET_NAME!;

    validateIsDefined(clientCredentialsUrl, 'clientCredentialsUrl');
    validateIsDefined(clientCredentialsId, 'clientCredentialsId');
    validateIsDefined(clientCredentialsSecretName, 'clientCredentialsSecretName');

    const clientCredentialsConfig: ClientCredentialsServerConfig = {
        clientCredentialsUrl,
        clientCredentialsId,
        clientCredentialsSecretName,
    };

    return clientCredentialsConfig;
};

export const validateIsDefined = (value: unknown, name: string): void => {
    if (value === undefined) {
        throw new Error(
            `${name} is a required parameter. Possible an environment variable (${camelToSnakeCase(name)}) is not set`,
        );
    }
};

const camelToSnakeCase = (str: string) => {
    return str
        .replace(/[A-Z]/g, letter => `_${letter.toUpperCase()}`)
        .replace(/[a-z]/g, letter => letter.toUpperCase());
};
