export type ClientCredentialsServerConfig = {
    clientCredentialsUrl: string;
    clientCredentialsId: string;
    clientCredentialsSecretName: string;
    accessTokenOverride?: string; // Deprecated: to be removed
};
