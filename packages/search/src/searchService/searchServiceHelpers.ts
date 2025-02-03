export const calculatePaginationFrom = (page?: number, pageSize?: number): number => {
    if (page && page > 1 && pageSize && pageSize > 0) {
        return (page - 1) * pageSize;
    }

    return 0;
};

const numberReferenceRegex = /^\s*(?:UKRI|APP|OPP)?\s*0*(\d+)\s*$/i;

export const extractNumberReferenceFromSearch = (search: string): number | undefined => {
    const match = search.match(numberReferenceRegex);
    if (match && match.length > 1) {
        const firstCapturingGroup = Number(match[1]);
        return firstCapturingGroup;
    }
    return undefined;
};

export const searchHasReferenceNumber = (search: string, reference: 'UKRI' | 'APP' | 'OPP'): boolean => {
    const regexNumberHasPrefix = new RegExp(`^${reference}[0-9]+`, 'i');
    const match = search.match(regexNumberHasPrefix);
    return !!match;
};
