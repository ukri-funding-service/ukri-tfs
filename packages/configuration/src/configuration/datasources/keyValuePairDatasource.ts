import { Datasource } from '../datasource';

/**
 * A Datasource which maintains a set of key->value pairs and resolves
 * values based on key string equality.
 */
export class KeyValuePairDatasource implements Datasource {
    constructor(private readonly keyValuePairs: Record<string, string | undefined>) {}

    has(identifier: string): boolean {
        return this.keyValuePairs[identifier] !== undefined;
    }

    get(identifier: string): string | undefined {
        return this.keyValuePairs[identifier];
    }
}
