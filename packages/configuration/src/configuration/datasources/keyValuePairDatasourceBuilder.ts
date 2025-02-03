import { KeyValuePairDatasource } from './keyValuePairDatasource';

/**
 * A fluent builder for KeyValuePairDatasources
 *
 * @example
 * const builder = new KeyValuePairDatasourceBuilder();
 *
 * const kvpDatasource = builder
 *  .add({key1: 'value-1'})
 *  .add({key2: undefined})
 *  .add({key3: 'value-3'})
 *  .build();
 */

export class KeyValuePairDatasourceBuilder {
    private keyValuePairs: Record<string, string | undefined> = {};

    /**
     * Add a key:value pair to the datasource. Use of an existing key
     * will cause the old value to be overwritten.
     *
     * @param key The key to set
     * @param value The value to assign (may be undefined, which has the effect of unsetting the key)
     */
    add(key: string, value: string | undefined): KeyValuePairDatasourceBuilder {
        this.keyValuePairs[key] = value;
        return this;
    }

    /**
     * Build an instance of {@link KeyValuePairDatasource} from the current builder state.
     *
     * @returns A newly constructed Datasource
     */
    build(): KeyValuePairDatasource {
        return new KeyValuePairDatasource(this.keyValuePairs);
    }
}
