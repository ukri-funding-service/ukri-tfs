/**
 * Abstract interface for any object which provides access
 * to a secret with a unique id.
 */
export interface SecretProvider {
    /**
     * Get the value of the secret with the given id.
     * @param id The unique identifier for the secret
     */
    getSecret(id: string): Promise<string>;
}
