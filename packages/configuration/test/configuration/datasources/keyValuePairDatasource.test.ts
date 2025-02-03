import { KeyValuePairDatasource } from '../../../src';

describe('configuration/datasource - keyValuePairDatasource', () => {
    describe('no pairs defined', () => {
        test('has(id)=false ', () => {
            const kvpDatasource = new KeyValuePairDatasource({});

            expect(kvpDatasource.has('some-key')).toEqual(false);
        });

        test('get(id)=undefined ', () => {
            const kvpDatasource = new KeyValuePairDatasource({});

            expect(kvpDatasource.get('some-key')).toBeUndefined();
        });
    });

    describe('pairs defined', () => {
        const kvpDatasource = new KeyValuePairDatasource({ key1: 'value-1', key2: 'value-2', key3: 'value-3' });

        test('has(id)=false for non-existent key', () => {
            expect(kvpDatasource.has('some-key')).toEqual(false);
        });

        test('get(id)=undefined for non-existent key', () => {
            expect(kvpDatasource.get('some-key')).toBeUndefined();
        });

        test('has(id)=true for existent key', () => {
            expect(kvpDatasource.has('key3')).toEqual(true);
        });

        test('get(id)=valid value for existent key', () => {
            expect(kvpDatasource.get('key3')).toEqual('value-3');
        });
    });

    describe('pairs defined include undefined values', () => {
        const kvpDatasource = new KeyValuePairDatasource({ key1: 'value-1', key2: undefined, key3: 'value3' });

        test('has(id)=false for existent key with undefined value', () => {
            expect(kvpDatasource.has('key2')).toEqual(false);
        });

        test('get(id)=undefined value for existent key with undefined value', () => {
            expect(kvpDatasource.get('key2')).toBeUndefined();
        });
    });
});
