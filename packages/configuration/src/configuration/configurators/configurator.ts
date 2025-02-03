import { Datasource } from '../datasource';

export interface IConfigurator {
    configure: () => Datasource;
}
