export const getEnvironmentVariableOrUndefined = (key: string): string | undefined => {
    const value = process.env[key];
    if (value) {
        return value;
    }
    return undefined;
};
