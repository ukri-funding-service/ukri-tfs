export type AccessTokenResponse = {
    access_token: string;
    expires_in: number;
    token_type: 'Bearer';
};

export const isAccessTokenResponse = (json: object | undefined): json is AccessTokenResponse => {
    if (json === undefined || typeof json !== 'object') return false;

    const asAccessTokenResponse = json as AccessTokenResponse;

    if (typeof asAccessTokenResponse.access_token === 'string' && asAccessTokenResponse.access_token.length > 0) {
        return true;
    }

    return false;
};

export const dumpRedactedToken = (token: AccessTokenResponse): string => {
    return `AccessToken[token=${token.access_token.length} chars, expires in=${token.expires_in}, type=${token.token_type}]`;
};
