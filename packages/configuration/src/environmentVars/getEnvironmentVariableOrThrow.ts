export const getEnvironmentVariableOrThrow = (key: string): string => {
    const value = process.env[key];
    if (value) {
        return value;
    }

    throw new Error(`Environment variable ${key} not set`);
};
