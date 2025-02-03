import { ProcessEnvConfigurator } from '../../../src';

describe('packages/configuration - configuration/configurators/processEnvConfigurator', () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeAll(() => {
        originalEnv = { ...process.env };
    });

    afterEach(() => {
        process.env = { ...originalEnv };
    });

    describe('construct from dotenv', () => {
        test('process env datasource contains keys defined in process.env', () => {
            process.env = { xyz: '123' };
            const datasource = new ProcessEnvConfigurator().configure();

            expect(datasource.has('xyz')).toBeTruthy();
        });

        test('process env datasource dereferences keys from process.env', () => {
            process.env = { xyz: '123' };
            const datasource = new ProcessEnvConfigurator().configure();

            expect(datasource.get('xyz')).toEqual('123');
        });
    });

    describe('construct from static env', () => {
        test('process env datasource contains keys from provided env', () => {
            const datasource = new ProcessEnvConfigurator({ xyz: '456' }).configure();

            expect(datasource.has('xyz')).toBeTruthy();
        });

        test('process env datasource dereferences keys from provided env', () => {
            const datasource = new ProcessEnvConfigurator({ xyz: '456' }).configure();

            expect(datasource.get('xyz')).toEqual('456');
        });

        test('process env datasource utilises ignores process.env when constructed with a provided env', () => {
            process.env = { xyz: '123' };
            const datasource = new ProcessEnvConfigurator({}).configure();

            expect(datasource.has('xyz')).toBeFalsy();
        });
    });
});
