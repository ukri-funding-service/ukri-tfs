import { DereferencingDatasource, DereferencingDatasourceBuilder, NoopDatasource } from '../../../src';

describe('configuration/datasource - dereferencingDatasourceBuilder', () => {
    test('can instantiate', () => {
        expect(new DereferencingDatasourceBuilder()).toBeInstanceOf(DereferencingDatasourceBuilder);
    });

    test('throws if neither datasource is provided and build is called', () => {
        const builder = new DereferencingDatasourceBuilder();

        expect(() => builder.build()).toThrow();
    });

    test('throws if only value datasource is provided and build is called', () => {
        const builder = new DereferencingDatasourceBuilder().withValueDatasource(NoopDatasource.getInstance());

        expect(() => builder.build()).toThrow();
    });

    test('throws if only mapping datasource is provided and build is called', () => {
        const builder = new DereferencingDatasourceBuilder().withMappingDatasource(NoopDatasource.getInstance());

        expect(() => builder.build()).toThrow();
    });

    test('builds a DereferencingDatasource when both datasources are provided', () => {
        const builder = new DereferencingDatasourceBuilder()
            .withMappingDatasource(NoopDatasource.getInstance())
            .withValueDatasource(NoopDatasource.getInstance());

        expect(builder.build()).toBeInstanceOf(DereferencingDatasource);
    });
});
