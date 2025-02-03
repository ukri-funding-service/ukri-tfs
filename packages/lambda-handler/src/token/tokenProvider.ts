/**
 * A TokenProvider returns an authorization token for a specific purpose.
 * This could be an OAuth token, a Basic token, etc
 */
export interface TokenProvider {
    getToken(): Promise<string>;
}
