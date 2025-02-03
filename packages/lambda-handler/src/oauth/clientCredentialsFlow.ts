import { AccessTokenResponse } from './accessToken';

export interface ClientCredentialsFlow {
    getAccessToken(scope: string): Promise<AccessTokenResponse>;
}
