import { type SecretProvider } from '@ukri-tfs/secrets';
import { type AgentProvider } from '../../agent';
import { type AuthorizationProvider } from '../../authorization';

export type EventHandlerConfig = {
    secretProvider: SecretProvider;
    authorizationProvider: AuthorizationProvider;
    agentProvider: AgentProvider;
};
