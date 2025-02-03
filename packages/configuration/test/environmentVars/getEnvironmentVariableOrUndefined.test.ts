import { getEnvironmentVariableOrUndefined } from '../../src';

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

        const variableValue = getEnvironmentVariableOrUndefined('someVariableIWant');
        expect(variableValue).toEqual('variable-value');
    });
    it('gets undefined when environment variable does not exist', () => {
        const variableValue = getEnvironmentVariableOrUndefined('someVariableIWant');
        expect(variableValue).toBeUndefined();
    });
});
