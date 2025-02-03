import { Agent } from 'https';

export type HttpsAgentConfig = {
    keySecretName: string;
    certificateSecretName: string;
};

export type AgentProvider = {
    getAgent(): Promise<Agent>;
};
