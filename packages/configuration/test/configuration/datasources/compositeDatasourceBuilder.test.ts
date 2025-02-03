import { CompositeDatasource, CompositeDatasourceBuilder, NoopDatasource } from '../../../src';

describe('configuration/datasource - compositeDatasourceBuilder', () => {
    test('can instantiate', () => {
        expect(new CompositeDatasourceBuilder()).toBeInstanceOf(CompositeDatasourceBuilder);
    });

    test('throws if no datasource is provided and build is called', () => {
        const builder = new CompositeDatasourceBuilder();

        expect(() => builder.build()).toThrow();
    });

    test('builds a CompositeDatasource when a single datasource is provided', () => {
        const builder = new CompositeDatasourceBuilder().add(NoopDatasource.getInstance());

        expect(builder.build()).toBeInstanceOf(CompositeDatasource);
    });

    test('builds a CompositeDatasource when multiple datasources are provided', () => {
        const builder = new CompositeDatasourceBuilder()
            .add(NoopDatasource.getInstance())
            .add(NoopDatasource.getInstance())
            .add(NoopDatasource.getInstance())
            .add(NoopDatasource.getInstance());

        expect(builder.build()).toBeInstanceOf(CompositeDatasource);
    });
});
