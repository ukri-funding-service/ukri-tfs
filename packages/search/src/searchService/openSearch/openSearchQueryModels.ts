export interface PaginationOptions {
    from?: number;
    size?: number;
}

export interface SortOptions {
    sortField?: string;
    sortOrder?: OpensearchSortOrder;
}

export type QueryMatchParameters = {
    query: string;
    operator: 'and' | 'or';
    fuzziness: 'AUTO' | '0' | '1' | '2' | '3' | '4' | '5';
};

export type QueryTermParameters = {
    value: string | number;
};

export type QueryMatch<T extends string> = {
    match: {
        [key in T]: QueryMatchParameters;
    };
};

export type QueryMatchBoolPrefix<T extends string> = {
    match_bool_prefix: {
        [key in T]: QueryMatchParameters;
    };
};

export type QueryMatchAll = {
    match_all: {};
};

export type QueryTerm<T extends string> = {
    term: {
        [key in T]: QueryTermParameters;
    };
};

export type OpensearchSortOrder = 'asc' | 'desc';

export interface OpensearchFieldSortQuery {
    [key: string]: {
        order: OpensearchSortOrder;
    };
}

export interface OpensearchAggsTerms {
    field: string;
    size: number;
}

export interface OpensearchAggs {
    [key: string]: {
        terms: OpensearchAggsTerms;
    };
}

export type OpensearchScriptSortQuery = {
    _script: {
        order: OpensearchSortOrder;
        type: 'string' | 'number';
        script: {
            lang: 'painless';
            source: string;
        };
    };
};
