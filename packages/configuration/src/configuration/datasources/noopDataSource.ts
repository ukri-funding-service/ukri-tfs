/* instanbul ignore file */

import { Datasource } from '..';

export class NoopDatasource implements Datasource {
    private static instance: NoopDatasource = new NoopDatasource();

    private constructor() {}

    static getInstance(): NoopDatasource {
        return this.instance;
    }

    has(_identifier: string): boolean {
        return false;
    }

    get(_identifier: string): string | undefined {
        return undefined;
    }
}
