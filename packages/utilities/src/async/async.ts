/* istanbul ignore next */
export const dangerousSleep = async (ms = 75): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
