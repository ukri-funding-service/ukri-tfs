export const assertQueryAsString = (query: string | string[] | undefined): string => {
    if (typeof query !== 'string') {
        throw new Error('Passed query value is not a string');
    }
    return query;
};
