import { Configuration, KeyValuePairDatasource } from '../../src';

describe('configuration - configuration', () => {
    describe('can configure with process.env', () => {
        const originalProcessEnv = { ...process.env };

        beforeAll(() => {
            process.env = { NODE_ENV: 'development', FOO: 'bar' };
        });

        afterAll(() => {
            process.env = { ...originalProcessEnv };
        });

        test('returns an environment map of one variable', () => {
            const configuration = new Configuration(
                {
                    someVariable: 'FOO',
                },
                {},
                new KeyValuePairDatasource(process.env),
            );

            const environmentVars = configuration.getConfigurationVariables();

            const expectedEnvironmentVariables = {
                someVariable: 'bar',
            };

            expect(environmentVars).toEqual(expectedEnvironmentVariables);
        });
    });
});
