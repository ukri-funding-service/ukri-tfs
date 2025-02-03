import {
    CompositeDatasource,
    Configuration,
    DuplicateConfigKeyError,
    EnvironmentVariableUndefinedError,
    KeyValuePairDatasource,
    NoopDatasource,
} from '../../src';

describe('configuration - configuration', () => {
    describe('non critical environment variables', () => {
        test('returns an environment map of no variables', () => {
            const dataSource = new KeyValuePairDatasource({});

            const configuration = new Configuration({}, {}, dataSource);
            const environmentVars = configuration.getConfigurationVariables();

            const expectedEnvironmentVariables = {};

            expect(environmentVars).toEqual(expectedEnvironmentVariables);
        });

        test('returns an environment map of one variable', () => {
            const dataSource = new KeyValuePairDatasource({ 'some-variable': 'some-value' });

            const configuration = new Configuration(
                {
                    someVariable: 'some-variable',
                },
                {},
                dataSource,
            );
            const environmentVars = configuration.getConfigurationVariables();

            const expectedEnvironmentVariables = {
                someVariable: 'some-value',
            };

            expect(environmentVars).toEqual(expectedEnvironmentVariables);
        });

        test('returns an environment map of multiple variables', () => {
            const dataSource = new KeyValuePairDatasource({
                'some-variable': 'some-value',
                'some-variable-two': 'some-value-two',
                'some-variable-three': 'some-value-three', // expect this one to be ignored
            });

            const configuration = new Configuration(
                {
                    someVariable: 'some-variable',
                    someVariableTwo: 'some-variable-two',
                },
                {},
                dataSource,
            );
            const environmentVars = configuration.getConfigurationVariables();

            const expectedEnvironmentVariables = {
                someVariable: 'some-value',
                someVariableTwo: 'some-value-two',
            };

            expect(environmentVars).toEqual(expectedEnvironmentVariables);
        });

        test('returns an environment map of multiple environment variables', () => {
            const dataSource = new KeyValuePairDatasource({
                'some-variable': 'some-value',
                'some-other-variable': 'some-other-value',
                'some-variable-three': 'some-value-three', // expect this one to be ignored
            });

            const configuration = new Configuration(
                {
                    someVariable: 'some-variable',
                    someOtherVariable: 'some-other-variable',
                },
                {},
                dataSource,
            );
            const environmentVars = configuration.getConfigurationVariables();

            const expectedEnvironmentVariables = {
                someVariable: 'some-value',
                someOtherVariable: 'some-other-value',
            };

            expect(environmentVars).toEqual(expectedEnvironmentVariables);
        });
    });

    describe('critical environment variables', () => {
        test("critical environment variable throws if it's not defined", () => {
            expect(
                () =>
                    new Configuration(
                        {},
                        {
                            someUndefinedVariable: 'some-undefined-variable',
                        },
                        NoopDatasource.getInstance(),
                    ),
            ).toThrow(
                new EnvironmentVariableUndefinedError('The environment variable some-undefined-variable was undefined'),
            );
        });

        test("two critical environment variables throw if they're not defined", () => {
            expect(
                () =>
                    new Configuration(
                        {},
                        {
                            someUndefinedVariable: 'some-undefined-variable',
                            someOtherUndefinedVariable: 'some-other-undefined-variable',
                        },
                        NoopDatasource.getInstance(),
                    ),
            ).toThrow(
                new EnvironmentVariableUndefinedError(
                    'The environment variables some-undefined-variable and some-other-undefined-variable were undefined',
                ),
            );
        });

        test("three critical environment variables throw if they're not defined", () => {
            expect(
                () =>
                    new Configuration(
                        {},
                        {
                            someUndefinedVariable: 'some-undefined-variable',
                            someOtherUndefinedVariable: 'some-other-undefined-variable',

                            someFinalUndefinedVariable: 'some-final-undefined-variable',
                        },
                        NoopDatasource.getInstance(),
                    ),
            ).toThrow(
                new EnvironmentVariableUndefinedError(
                    'The environment variables some-undefined-variable, some-other-undefined-variable and some-final-undefined-variable were undefined',
                ),
            );
        });

        test('gets a critical environment variable', () => {
            const dataSource = new KeyValuePairDatasource({
                'some-critical-variable': 'some-value',
            });
            const config = new Configuration({}, { someMustHaveVariable: 'some-critical-variable' }, dataSource);

            const expectedEnvironmentVariables = {
                someMustHaveVariable: 'some-value',
            };

            expect(config.getConfigurationVariables()).toEqual(expectedEnvironmentVariables);
        });

        test('gets a critical environment variable from the second data source', () => {
            const dataSourceOne = new KeyValuePairDatasource({
                'some-critical-variable': 'some-value',
            });

            const dataSourceTwo = new KeyValuePairDatasource({
                'some-other-critical-variable': 'some-value',
            });

            const dataSource = new CompositeDatasource([dataSourceOne, dataSourceTwo]);

            const config = new Configuration(
                {},
                {
                    someMustHaveVariable: 'some-critical-variable',
                    someOtherMustHaveVariable: 'some-other-critical-variable',
                },
                dataSource,
            );

            const expectedEnvironmentVariables = {
                someMustHaveVariable: 'some-value',
                someOtherMustHaveVariable: 'some-value',
            };

            expect(config.getConfigurationVariables()).toEqual(expectedEnvironmentVariables);
        });

        test('gets multiple critical environment variables', () => {
            const dataSource = new KeyValuePairDatasource({
                'some-must-have-variable': 'some-value',
                'some-other-must-have-variable': 'some-other-value',
            });

            const config = new Configuration(
                {},
                {
                    someMustHaveVariable: 'some-must-have-variable',
                    someOtherMustHaveVariable: 'some-other-must-have-variable',
                },
                dataSource,
            );

            const expectedEnvironmentVariables = {
                someMustHaveVariable: 'some-value',
                someOtherMustHaveVariable: 'some-other-value',
            };

            expect(config.getConfigurationVariables()).toEqual(expectedEnvironmentVariables);
        });
    });

    describe('getConfigurationVariable', () => {
        test('get single environment variable', () => {
            const dataSource = new KeyValuePairDatasource({
                'some-critical-variable': 'some-critical-value',
            });

            const config = new Configuration({}, { someMustHaveVariable: 'some-critical-variable' }, dataSource);

            const criticalVariable = config.getConfigurationVariable('someMustHaveVariable');
            expect(criticalVariable).toBe('some-critical-value');
        });
    });

    describe('getConfigurationVariableOrUndefined', () => {
        test('getConfigurationVariableOrUndefined that exists', () => {
            const dataSource = new KeyValuePairDatasource({
                'some-non-critical-variable': 'some-non-critical-value',
            });

            const config = new Configuration({ someCanHaveVariable: 'some-non-critical-variable' }, {}, dataSource);

            const nonCriticalVariable = config.getConfigurationVariableOrUndefined('someCanHaveVariable');
            expect(nonCriticalVariable).toBe('some-non-critical-value');
        });

        test("getConfigurationVariableOrUndefined that doesn't exist", () => {
            const config = new Configuration(
                { someCanHaveVariable: 'some-non-critical-variable' },
                {},
                new KeyValuePairDatasource({}),
            );

            const nonCriticalVariable = config.getConfigurationVariableOrUndefined('someCanHaveVariable');
            expect(nonCriticalVariable).toBeUndefined();
        });
    });

    describe('duplicates', () => {
        test('throws duplicate error if multiple things are defined with the same value', () => {
            const dataSource = new KeyValuePairDatasource({
                'some-non-critical-variable': 'some-non-critical-value',
                'some-name-two': 'some-critical-value',
            });

            expect(
                () =>
                    new Configuration({ variableName: 'some-name-one' }, { variableName: 'some-name-two' }, dataSource),
            ).toThrow(new DuplicateConfigKeyError('Two or more variables have been defined with the same name.'));
        });
    });

    describe('prioritisation', () => {
        test('prioritises the first data source', () => {
            const dataSourceOne = new KeyValuePairDatasource({
                'some-variable-name': 'the-value-i-want-to-have-priority',
            });

            const dataSourceTwo = new KeyValuePairDatasource({
                'some-variable-name': 'some-other-value',
            });

            const dataSource = new CompositeDatasource([dataSourceOne, dataSourceTwo]);

            const config = new Configuration(
                {},
                {
                    variableName: 'some-variable-name',
                },
                dataSource,
            );

            const expectedEnvironmentVariables = {
                variableName: 'the-value-i-want-to-have-priority',
            };

            expect(config.getConfigurationVariables()).toEqual(expectedEnvironmentVariables);
        });
    });
});
