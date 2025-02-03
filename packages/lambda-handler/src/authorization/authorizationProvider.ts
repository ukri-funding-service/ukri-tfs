export type AuthorizationProvider = {
    getAuthorization: () => Promise<string>;
};
