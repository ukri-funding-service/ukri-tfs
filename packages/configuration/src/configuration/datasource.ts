/**
 * A Datasource is a provider of values indexed by an identifier.
 * Values may be undefined.
 */
export type Datasource = {
    /**
     * Returns true if the DataSource has a value for the
     * given identifier. If the identifier is unknown, or
     * it's value is explicitly 'undefined' then return false
     *
     * @param identifier The identifier for the value
     */
    has(identifier: string): boolean;

    /**
     * Returns the value for the given identifier, or undefined
     * if it is unknown.  If the identifier is unknown, or
     * it's value is explicitly 'undefined' then return undefined
     *
     * @param identifier The identifier for the value
     */
    get(identifier: string): string | undefined;
};
