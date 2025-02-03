import { CompositeDatasource, KeyValuePairDatasource, NoopDatasource } from '../../../src';

describe('configuration/datasource - compositeDatasource', () => {
    test('can instantiate with no data sources', () => {
        expect(new CompositeDatasource([])).toBeInstanceOf(CompositeDatasource);
    });

    test('can instantiate with single data source', () => {
        expect(new CompositeDatasource([NoopDatasource.getInstance()])).toBeInstanceOf(CompositeDatasource);
    });

    test('can instantiate with several data sources', () => {
        expect(
            new CompositeDatasource([
                NoopDatasource.getInstance(),
                NoopDatasource.getInstance(),
                NoopDatasource.getInstance(),
            ]),
        ).toBeInstanceOf(CompositeDatasource);
    });

    test('data source with lowest index is prioritised when key exists in multiple data sources', () => {
        const ds1 = new KeyValuePairDatasource({ nokey: 'nothing to see here' });
        const ds2 = new KeyValuePairDatasource({ key: 'should pick me' });
        const ds3 = new KeyValuePairDatasource({ key: 'should NOT pick me' });

        const datasource = new CompositeDatasource([ds1, ds2, ds3]);

        expect(datasource.has('key'));
        expect(datasource.get('key')).toEqual('should pick me');
    });
});
