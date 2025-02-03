import { KeyValuePairDatasource, KeyValuePairDatasourceBuilder } from '../../../src';

describe('configuration/datasource - keyValuePairDatasource', () => {
    describe('builder', () => {
        test('can build when no variables are defined', () => {
            const builder = new KeyValuePairDatasourceBuilder();

            expect(builder.build()).toBeInstanceOf(KeyValuePairDatasource);
        });

        test('can build when variables are added', () => {
            const builder = new KeyValuePairDatasourceBuilder();
            builder.add('x', 'xxx');
            builder.add('y', 'yyy');
            builder.add('z', 'zzz');

            expect(builder.build()).toBeInstanceOf(KeyValuePairDatasource);
        });

        test('provides a data source which has the expected data', () => {
            const builder = new KeyValuePairDatasourceBuilder();
            builder.add('x', 'xxx');
            builder.add('y', 'yyy');
            builder.add('z', 'zzz');

            const uut = builder.build();

            expect(uut.has('x'));
            expect(uut.has('y'));
            expect(uut.has('z'));

            expect(!uut.has('a'));
        });

        test('provides a data source which returns the expected data', () => {
            const builder = new KeyValuePairDatasourceBuilder();
            builder.add('x', 'xxx');
            builder.add('y', 'yyy');
            builder.add('z', 'zzz');

            const uut = builder.build();

            expect(uut.get('x')).toEqual('xxx');
            expect(uut.get('y')).toEqual('yyy');
            expect(uut.get('z')).toEqual('zzz');
        });
    });
});
