import { getEnvironmentVariableOrThrow } from '../../src';

describe('getEnvironmentVariableOrUndefined', () => {
    let originalEnv: NodeJS.ProcessEnv;
    beforeAll(() => {
        originalEnv = process.env;
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('gets environment variable when it exists', () => {
        process.env = { someVariableIWant: 'variable-value' };

        const variableValue = getEnvironmentVariableOrThrow('someVariableIWant');
        expect(variableValue).toEqual('variable-value');
    });
    it('gets undefined when environment variable does not exist', () => {
        const throwsError = () => getEnvironmentVariableOrThrow('someVariableIWant');
        const throwsAnotherError = () => getEnvironmentVariableOrThrow('someOtherVariableIWant');

        expect(throwsError).toThrow(new Error('Environment variable someVariableIWant not set'));
        expect(throwsAnotherError).toThrow(new Error('Environment variable someOtherVariableIWant not set'));
    });
});
