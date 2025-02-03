import { ParsedUrlQuery } from 'querystring';

export interface PageInfo {
    totalRecords: number;
    totalPages: number;
    page: number;
    pageSize: number;
    startRecord?: number;
    endRecord?: number;
    groupCounts?: GroupCount[];
}

export interface GroupCount {
    id: string;
    count: number;
}

export interface PageResult<T> extends PageInfo {
    items: T[];
}

export interface PagedResult<T> {
    meta: PageInfo;
    items: T[];
}

export const getPageInfoFromQuery = (
    query: ParsedUrlQuery,
    defaultPageSize = 10,
): Pick<PageInfo, 'page' | 'pageSize'> => {
    const page = Number(query.page);
    const pageSize = Number(query.pageSize);

    return {
        page: page > 0 ? page : 1,
        pageSize: pageSize > 0 ? pageSize : defaultPageSize,
    };
};
