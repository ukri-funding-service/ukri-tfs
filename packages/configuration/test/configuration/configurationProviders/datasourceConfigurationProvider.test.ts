import {
    DatasourceConfigurationProvider,
    EnvironmentVariableUndefinedError,
    KeyValuePairDatasource,
    NoopDatasource,
    SchemaSpecification,
} from '../../../src';

describe('configuration - DatasourceConfigurationProvider', () => {
    describe('non critical environment variables', () => {
        type MySchema = {
            someOptionalVariable?: string;
            someOtherOptionalVariable?: string;
        };

        const spec: SchemaSpecification<MySchema> = {
            someOptionalVariable: { isRequired: false },
            someOtherOptionalVariable: { isRequired: false },
        };

        test('returns an environment map of no variables', () => {
            const configuration = new DatasourceConfigurationProvider<MySchema>(spec, NoopDatasource.getInstance());
            const environmentVars = configuration.getConfigurationVariables();

            const expectedEnvironmentVariables = {};

            expect(environmentVars).toEqual(expectedEnvironmentVariables);
        });

        test('returns an environment map of one variable', () => {
            const dataSource = new KeyValuePairDatasource({
                someOptionalVariable: 'some-value',
                otherVariable: 'this-should-not-be-output-as-it-isnt-in-the-schema-spec',
            });

            const configuration = new DatasourceConfigurationProvider<MySchema>(spec, dataSource);
            const environmentVars = configuration.getConfigurationVariables();

            const expectedEnvironmentVariables = {
                someOptionalVariable: 'some-value',
            };

            expect(environmentVars).toEqual(expectedEnvironmentVariables);
        });

        test('returns an environment map of multiple variables', () => {
            const dataSource = new KeyValuePairDatasource({
                someVariable: 'some-value', // expect this one to be ignored
                someOptionalVariable: 'some-value-two',
                someVariableThree: 'some-value-three', // expect this one to be ignored
                someOtherOptionalVariable: 'some-value-four',
            });

            const configuration = new DatasourceConfigurationProvider<MySchema>(spec, dataSource);
            const environmentVars = configuration.getConfigurationVariables();

            const expectedEnvironmentVariables = {
                someOptionalVariable: 'some-value-two',
                someOtherOptionalVariable: 'some-value-four',
            };

            expect(environmentVars).toEqual(expectedEnvironmentVariables);
        });
    });

    describe('critical environment variables', () => {
        type MySchema = {
            someVariable: string;
            someVariableTwo: string;
            someOptionalVariable?: string;
        };
        const spec: SchemaSpecification<MySchema> = {
            someVariable: { isRequired: true },
            someVariableTwo: { isRequired: true },
            someOptionalVariable: { isRequired: false },
        };

        test("critical environment variable throws if it's not defined", () => {
            expect(() => new DatasourceConfigurationProvider<MySchema>(spec, NoopDatasource.getInstance())).toThrow(
                EnvironmentVariableUndefinedError,
            );
        });

        test('gets a critical environment variable', () => {
            const dataSource = new KeyValuePairDatasource({
                someVariable: 'first',
                someVariableTwo: 'second',
            });

            const config = new DatasourceConfigurationProvider<MySchema>(spec, dataSource);

            const expectedEnvironmentVariables = {
                someVariable: 'first',
                someVariableTwo: 'second',
            };

            expect(config.getConfigurationVariables()).toEqual(expectedEnvironmentVariables);
        });
    });

    describe('getConfigurationVariable', () => {
        type MySchema = {
            someVariable: string;
        };
        const spec: SchemaSpecification<MySchema> = {
            someVariable: { isRequired: true },
        };

        test('get single environment variable', () => {
            const dataSource = new KeyValuePairDatasource({
                someVariable: 'some-critical-value',
            });

            const config = new DatasourceConfigurationProvider<MySchema>(spec, dataSource);

            expect(config.getConfigurationVariable('someVariable')).toBe('some-critical-value');
        });
    });

    describe('getConfigurationVariableOrUndefined', () => {
        type MySchema = {
            someVariable: string;
            someOptionalVariable?: string;
            someOtherOptionalVariable?: string;
        };
        const spec: SchemaSpecification<MySchema> = {
            someVariable: { isRequired: true },
            someOptionalVariable: { isRequired: false },
            someOtherOptionalVariable: { isRequired: false },
        };

        test('getConfigurationVariableOrUndefined that exists', () => {
            const dataSource = new KeyValuePairDatasource({
                someVariable: 'some-value',
                someOptionalVariable: 'some-non-critical-value',
            });

            const config = new DatasourceConfigurationProvider<MySchema>(spec, dataSource);

            expect(config.getConfigurationVariableOrUndefined('someOptionalVariable')).toBe('some-non-critical-value');
        });

        // This test is not possible because the type checking rejects a config variable name
        // that is not defined in the schema. For the avoidance of doubt, this is a good thing.
        //
        // test("getConfigurationVariableOrUndefined that doesn't exist", () => {
        //     const datasource = new KeyValuePairDatasource({
        //         someVariable: 'some-value',
        //         someOtherVariable: 'some-other-value',
        //         someVariableThree: undefined, // expect this one to be ignored
        //     });
        //     const config = new DatasourceConfigurationProvider<MySchema>(spec, datasource);

        //     // TODO would like this to be picked up by compiler as not in schema
        //     const nonCriticalVariable = config.getConfigurationVariableOrUndefined('someVariableFour');
        //     expect(nonCriticalVariable).toBeUndefined();
        // });
    });
});
