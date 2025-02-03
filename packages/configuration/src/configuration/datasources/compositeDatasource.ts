import { Datasource } from '..';

/**
 * A data source which is comprised of a set of children in priority
 * order. Closer to the start of the array is higher priority when
 * looking for an identifier.
 */
export class CompositeDatasource implements Datasource {
    /**
     *
     * @param datasources A list of Datasource objects to use for resolution.
     * The list is maintained in strict order and will always use the first match.
     */
    constructor(private readonly datasources: Array<Datasource>) {}

    has(identifier: string): boolean {
        return this.datasources.some(ds => ds.has(identifier));
    }

    get(identifier: string): string | undefined {
        let result = undefined;

        for (const ds of this.datasources) {
            if (ds.has(identifier)) {
                result = ds.get(identifier);
                break;
            }
        }

        return result;
    }
}
