import { NoopDatasource } from '../../../src';

describe('configuration/datasource - noopDatasource', () => {
    test('can get an instance', () => {
        expect(NoopDatasource.getInstance()).toBeInstanceOf(NoopDatasource);
    });

    test('doesnt have any identifiers', () => {
        expect(NoopDatasource.getInstance().has('some-key')).toEqual(false);
    });

    test('doesnt return any values', () => {
        expect(NoopDatasource.getInstance().get('NODE_ENV')).toBeUndefined();
    });
});
