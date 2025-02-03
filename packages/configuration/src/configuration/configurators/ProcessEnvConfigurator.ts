import { config as dotenvConfig } from 'dotenv';
import { Datasource, KeyValuePairDatasource } from '../datasources';
import { IConfigurator } from './configurator';

export class ProcessEnvConfigurator implements IConfigurator {
    private env: NodeJS.ProcessEnv;

    /**
     *
     * @param env Optional environment to be used. If provided, it is used
     * INSTEAD OF the runtime process.env. If omitted, the dotenv utility is used to
     * build an environment by inialising from process.env and overriding with any
     * discovered .env files (see documentation of the dotenv module for resolution)
     */
    constructor(env?: NodeJS.ProcessEnv) {
        if (env === undefined) {
            dotenvConfig();
            this.env = { ...process.env };
        } else {
            this.env = { ...env };
        }
    }

    configure = (): Datasource => {
        return new KeyValuePairDatasource(this.env);
    };
}
