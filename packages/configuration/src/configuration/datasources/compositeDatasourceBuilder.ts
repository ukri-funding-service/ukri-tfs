import { Datasource } from '../datasource';
import { CompositeDatasource } from './compositeDatasource';

/**
 * A fluent builder for CompositeDatasources
 *
 * @example
 * const builder = new CompositeDatasourceBuilder();
 *
 * const datasource = builder
 *   .add(customDatasource)
 *   .add(baseDatasource)
 *   .add(defaultsDatasource)
 *   .build();
 */
export class CompositeDatasourceBuilder {
    private datasources: Datasource[] = [];

    constructor() {}

    /**
     * Adds a datasource at the end of the datasource list.
     * @param ds A Datasource to be added to the composite
     * @returns
     */
    add(ds: Datasource): CompositeDatasourceBuilder {
        this.datasources.push(ds);
        return this;
    }

    /**
     * Build an instance of {@link CompositeDatasource} from the current builder state.
     *
     * @returns A newly constructed Datasource
     * @throws Error if no datasources have been provided
     */
    build(): CompositeDatasource {
        if (this.datasources.length === 0) {
            throw new Error('At least one Datasource is required');
        }

        return new CompositeDatasource(this.datasources);
    }
}
