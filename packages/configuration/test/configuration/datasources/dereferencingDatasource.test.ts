import { KeyValuePairDatasource, NoopDatasource } from '../../../src';
import { DereferencingDatasource } from '../../../src/configuration/datasources/dereferencingDatasource';

describe('configuration/datasource - dereferencingDatasource', () => {
    // This datasource contains both identifiers which can be dererefenced (mapped), and identifiers which can't
    const refDatasource = new KeyValuePairDatasource({
        aKeyWithNoMapping: 'someReferenceId',
        aKeyWithAMapping: 'THIS_EXISTS',
    });

    // This datasource contains the dereferenced values.
    const valueDatasource = new KeyValuePairDatasource({ THIS_EXISTS: 'this is a valid value' });

    test('can instantiate', () => {
        expect(new DereferencingDatasource(NoopDatasource.getInstance(), NoopDatasource.getInstance())).toBeInstanceOf(
            DereferencingDatasource,
        );
    });

    describe('identifier is not defined in the reference datasource', () => {
        test('has(id)=false', () => {
            const datasource = new DereferencingDatasource(refDatasource, valueDatasource);

            expect(datasource.has('noSuchKey')).toEqual(false);
        });

        test('get(id)=undefined', () => {
            const datasource = new DereferencingDatasource(refDatasource, valueDatasource);

            expect(datasource.get('noSuchKey')).toBeUndefined();
        });
    });

    describe('identifier is defined in the reference datasource but is not mapped', () => {
        test('has(id)=false', () => {
            const datasource = new DereferencingDatasource(refDatasource, valueDatasource);

            expect(datasource.has('aKeyWithNoMapping')).toEqual(false);
        });

        test('get(id)=undefined', () => {
            const datasource = new DereferencingDatasource(refDatasource, valueDatasource);

            expect(datasource.get('aKeyWithNoMapping')).toBeUndefined();
        });
    });

    describe('identifier is defined in the reference datasource and is mapped', () => {
        test('has(id)=true', () => {
            const datasource = new DereferencingDatasource(refDatasource, valueDatasource);

            expect(datasource.has('aKeyWithAMapping')).toEqual(true);
        });

        test('get(id)=valid value', () => {
            const datasource = new DereferencingDatasource(refDatasource, valueDatasource);

            expect(datasource.get('aKeyWithAMapping')).toEqual('this is a valid value');
        });
    });
});
