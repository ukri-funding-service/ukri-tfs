import { ApplicationFieldEnum, ApplicationStatusEnum, ReviewStatusEnum } from '../searchService';
import {
    OpensearchAggs,
    OpensearchFieldSortQuery,
    PaginationOptions,
    QueryMatch,
    QueryMatchBoolPrefix,
    SortOptions,
} from './openSearchQueryModels';

export interface ApplicationFilters {
    opportunityId?: number;
    opportunityApplicationWorkflowComponentId?: number;
    applicationStatuses?: ApplicationStatusEnum[];
    reviewStatuses?: ReviewStatusEnum[];
}

interface MatchDisplayId {
    term: {
        displayId: {
            value: string;
            case_insensitive: true;
        };
    };
}

interface MatchId {
    term: {
        id: {
            value: string;
        };
    };
}

interface ApplicationQueryBuilderOptions {
    pagination?: PaginationOptions;
    sort?: SortOptions;
    filters?: ApplicationFilters;
    searchTerm?: string;
    bucketAggregationIdentifiers?: ApplicationFieldEnum[];
}

type BoolQueryShouldOptions = QueryMatch<'name'> | QueryMatchBoolPrefix<'name'> | MatchDisplayId | MatchId;

export interface ApplicationSearchFilterTerm {
    opportunityId?: number;
    opportunityApplicationWorkflowComponentId?: number;
}

export interface ApplicationSearchFilterTerms {
    'applicationStatus.keyword'?: ApplicationStatusEnum[];
    'reviewStatus.keyword'?: ReviewStatusEnum[];
}

export interface ApplicationSearchFilter {
    term?: ApplicationSearchFilterTerm;
    terms?: ApplicationSearchFilterTerms;
}

interface ApplicationBoolQuery {
    filter?: ApplicationSearchFilter[];
    must?: {
        bool: {
            should: BoolQueryShouldOptions[];
        };
    };
}

type ApplicationSearchQuery = {
    bool: ApplicationBoolQuery;
};

export interface ApplicationSearchBody {
    aggs: OpensearchAggs;
    query: ApplicationSearchQuery;
    sort: OpensearchFieldSortQuery;
    size: number;
    from: number;
}

export const reduceBucketAggregationIdentifierToApplicationAggs = (
    aggs: OpensearchAggs,
    bucketAggregationIdentifier: ApplicationFieldEnum,
): OpensearchAggs => {
    switch (bucketAggregationIdentifier) {
        case ApplicationFieldEnum.ReviewStatus:
            aggs['reviewStatuses'] = {
                terms: {
                    field: 'reviewStatus.keyword',
                    size: Object.keys(ReviewStatusEnum).length,
                },
            };
            break;
    }

    return aggs;
};

export const buildApplicationSearchFilters = (applicationFilters: ApplicationFilters): ApplicationSearchFilter[] => {
    const filters: ApplicationSearchFilter[] = [];

    if (applicationFilters.opportunityId) {
        filters.push({
            term: {
                opportunityId: applicationFilters.opportunityId,
            },
        });
    }

    if (applicationFilters.opportunityApplicationWorkflowComponentId) {
        filters.push({
            term: {
                opportunityApplicationWorkflowComponentId: applicationFilters.opportunityApplicationWorkflowComponentId,
            },
        });
    }

    if (applicationFilters.applicationStatuses && applicationFilters.applicationStatuses.length) {
        filters.push({
            terms: {
                'applicationStatus.keyword': applicationFilters.applicationStatuses,
            },
        });
    }

    if (applicationFilters.reviewStatuses && applicationFilters.reviewStatuses.length) {
        filters.push({
            terms: {
                'reviewStatus.keyword': applicationFilters.reviewStatuses,
            },
        });
    }

    return filters;
};

export const applicationsSearchBodyBuilder = (
    queryBuilderOptions: ApplicationQueryBuilderOptions,
): ApplicationSearchBody => {
    const applicationBoolQuery: ApplicationBoolQuery = {};

    if (queryBuilderOptions.filters) {
        applicationBoolQuery.filter = buildApplicationSearchFilters(queryBuilderOptions.filters);
    }

    if (queryBuilderOptions.searchTerm) {
        const idCheck: MatchDisplayId | MatchId = isNaN(parseInt(queryBuilderOptions.searchTerm))
            ? {
                  term: {
                      displayId: {
                          value: queryBuilderOptions.searchTerm,
                          case_insensitive: true,
                      },
                  },
              }
            : {
                  term: {
                      id: {
                          value: queryBuilderOptions.searchTerm,
                      },
                  },
              };

        applicationBoolQuery.must = {
            bool: {
                should: [
                    {
                        match: {
                            name: {
                                query: queryBuilderOptions.searchTerm,
                                operator: 'and',
                                fuzziness: 'AUTO',
                            },
                        },
                    },
                    {
                        match_bool_prefix: {
                            name: {
                                query: queryBuilderOptions.searchTerm,
                                operator: 'and',
                                fuzziness: 'AUTO',
                            },
                        },
                    },
                    { ...idCheck },
                ],
            },
        };
    }

    let applicationAggs: OpensearchAggs = {};
    if (queryBuilderOptions.bucketAggregationIdentifiers) {
        applicationAggs = queryBuilderOptions.bucketAggregationIdentifiers.reduce(
            reduceBucketAggregationIdentifierToApplicationAggs,
            {},
        );
    }

    return {
        aggs: applicationAggs,
        query: {
            bool: applicationBoolQuery,
        },
        from: queryBuilderOptions.pagination?.from ?? 0,
        size: queryBuilderOptions.pagination?.size ?? 10000,
        sort: {
            [queryBuilderOptions.sort?.sortField ?? 'id']: {
                order: queryBuilderOptions.sort?.sortOrder ?? 'asc',
            },
        },
    };
};
