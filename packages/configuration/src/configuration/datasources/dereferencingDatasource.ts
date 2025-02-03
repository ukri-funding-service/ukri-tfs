import { Datasource } from '..';

/**
 * A data source which dereferences the identifier into a second datasource
 * to return the mapped value.
 *
 * This allows, for instance, dereferencing of environment variable names into a
 * KeyValuePairDatasource which contains environment variable values.
 *
 * @example
 * mappingDatasource = { 'myConfigKey' : 'ENV_VAR_FOR_CONFIG_KEY' }
 * valueDatasource = { 'ENV_VAR_FOR_CONFIG_KEY' : 'the value to be returned' }
 *
 * dereferencingDatasource = new DereferencingDatasource(mappingDatasource, valueDatasource)
 *
 * dereferencingDatasource.get('myConfigKey') -> 'the value to be returned'
 */
export class DereferencingDatasource implements Datasource {
    /**
     *
     * @param referenceDatasource A datasource containing dereference mappings from an identifier
     * to a value in the value datasource.
     * @param valueDatasource A datasource containing the dereferenced values. In order to be accessible, an
     * identifier in this datasource must exactly equal a value in the referenceDatasource.
     */
    constructor(private readonly referenceDatasource: Datasource, private readonly valueDatasource: Datasource) {}

    has(identifier: string): boolean {
        if (!this.referenceDatasource.has(identifier)) {
            return false;
        }

        return this.valueDatasource.has(this.referenceDatasource.get(identifier)!);
    }

    get(identifier: string): string | undefined {
        if (!this.has(identifier)) {
            return undefined;
        }

        return this.valueDatasource.get(this.referenceDatasource.get(identifier)!);
    }
}
