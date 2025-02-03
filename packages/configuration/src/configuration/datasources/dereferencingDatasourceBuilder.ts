import { Datasource } from '../datasource';
import { DereferencingDatasource } from './dereferencingDatasource';

/**
 * A fluent builder for DereferencingDatasources
 *
 * @example
 * const builder = new DereferencingDatasourceBuilder();
 *
 * const datasource = builder
 *   .withMappingDatasource(configKeysToEnvVarsDatasource)
 *   .withValueDatasource(envVarsDatasource)
 *   .build();
 */
export class DereferencingDatasourceBuilder {
    private mappingDatasource: Datasource | undefined;
    private valueDatasource: Datasource | undefined;

    constructor() {}

    /**
     * Add a mapping datasource to the builder. Repeated invocation will
     * cause previous mapping datasource to be replaced.
     *
     * @param ds The datasource to use for identifier mapping
     * @returns This builder
     */
    withMappingDatasource(ds: Datasource): DereferencingDatasourceBuilder {
        this.mappingDatasource = ds;
        return this;
    }

    /**
     * Add a value datasource to the builder. Repeated invocation will
     * cause previous value datasource to be replaced.
     *
     * @param ds The datasource to use for mapped identifier values
     * @returns This builder
     */
    withValueDatasource(ds: Datasource): DereferencingDatasourceBuilder {
        this.valueDatasource = ds;
        return this;
    }

    /**
     * Build an instance of {@link DereferencingDatasource} from the current builder state.
     *
     * @returns A newly constructed Datasource
     * @throws Error if either the mapping datasource or the value datasource
     * have not been provided
     */
    build(): DereferencingDatasource {
        if (this.mappingDatasource === undefined) {
            throw new Error('A Mapping Datasource is required');
        }

        if (this.valueDatasource === undefined) {
            throw new Error('A Value Datasource is required');
        }

        return new DereferencingDatasource(this.mappingDatasource, this.valueDatasource);
    }
}
