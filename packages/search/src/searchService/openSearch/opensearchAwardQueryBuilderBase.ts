import { AwardFunder, AwardSortFields } from '../searchService';
import { searchHasReferenceNumber } from '../searchServiceHelpers';
import {
    OpensearchFieldSortQuery,
    OpensearchScriptSortQuery,
    OpensearchSortOrder,
    QueryMatch,
    QueryMatchAll,
    QueryMatchBoolPrefix,
    QueryTerm,
} from './openSearchQueryModels';
import {
    AwardExternalStatusFilter,
    AwardOrganisationIdFilter,
    AwardTextQueriesExternal,
    ExternalAwardQueryBuilderOptions,
    ExternalTaskFilterBool,
} from './opensearchExternalAwardQueryBuilder';

import {
    AwardAssignedFilterBool,
    InternalAwardQueryBuilderOptions,
    AwardInternalStatusFilter,
    InternalTaskFilterBool,
} from './opensearchInternalAwardQueryBuilder';

export type AwardFieldSortOptions = {
    sortField?: AwardSortFields;
    sortOrder?: OpensearchSortOrder;
};

export type AwardQueryBuilderOptions = ExternalAwardQueryBuilderOptions | InternalAwardQueryBuilderOptions;

export type AwardTextQueriesBase = [
    QueryMatch<'awardName'>,
    QueryMatchBoolPrefix<'awardName'>,
    QueryMatch<'organisationName'>,
    QueryMatchBoolPrefix<'organisationName'>,
    QueryMatch<'opportunityName'>,
    QueryMatchBoolPrefix<'opportunityName'>,
    QueryMatch<'applicationName'>,
    QueryMatchBoolPrefix<'applicationName'>,
    QueryMatch<'grantReference'>,
    QueryMatchBoolPrefix<'grantReference'>,
];

export type AwardTextQueries = AwardTextQueriesBase | AwardTextQueriesExternal;

type AwardFunderFilter = {
    terms: {
        'funder.keyword': AwardFunder[];
    };
};

export type AwardNotDeletedFilter = {
    bool: {
        should: [
            {
                bool: {
                    must_not: {
                        exists: {
                            field: 'deleted';
                        };
                    };
                };
            },
            {
                term: {
                    deleted: {
                        value: false;
                    };
                };
            },
        ];
    };
};
type AwardIsDeletedFilter = {
    bool: {
        should: [
            {
                term: {
                    deleted: {
                        value: true;
                    };
                };
            },
        ];
    };
};
export type AwardDeletedFilter = AwardNotDeletedFilter | AwardIsDeletedFilter;

export type AwardFilter =
    | AwardDeletedFilter
    | InternalTaskFilterBool
    | ExternalTaskFilterBool
    | AwardFunderFilter
    | AwardInternalStatusFilter
    | AwardExternalStatusFilter
    | AwardAssignedFilterBool
    | AwardOrganisationIdFilter;

type AwardTextOrNumberQuery = {
    bool: {
        must: {
            bool: {
                should: AwardTextQueries | AwardNumberQueries;
            };
        };
    };
};

type AwardTextOrNumberFilterQuery = {
    bool: {
        must: {
            bool: {
                should: AwardTextQueries | AwardNumberQueries;
            };
        };
        filter: AwardFilter[];
    };
};

export type AwardTextFilterQuery = {
    bool: {
        should: AwardTextQueries;
        filter: AwardFilter[];
    };
};

export type AwardFindAllQuery = QueryMatchAll;

export type AwardNumberQueries =
    | [QueryTerm<'awardReference'>]
    | [QueryTerm<'opportunityId'>]
    | [QueryTerm<'applicationId'>]
    | [QueryTerm<'awardReference'>, QueryTerm<'opportunityId'>, QueryTerm<'applicationId'>];

export type AwardNumberFilterQuery = {
    bool: {
        must: {
            bool: {
                should: AwardNumberQueries;
            };
        };
        filter: AwardFilter[];
    };
};

export type AwardFilterQuery = {
    bool: {
        filter: AwardFilter[];
    };
};

export type AwardQuery = AwardFindAllQuery | AwardFilterQuery | AwardTextOrNumberQuery | AwardTextOrNumberFilterQuery;

export type AwardSearchBody = {
    query: AwardQuery;
    sort: OpensearchFieldSortQuery[] | OpensearchScriptSortQuery[];
    size: number;
    from: number;
};

export type TasksField = 'tasks' | 'externalTasks';

export const createAwardTextSearchQuery = (searchTerm: string): AwardTextQueriesBase => {
    return [
        {
            match: {
                awardName: {
                    query: searchTerm,
                    operator: 'and',
                    fuzziness: 'AUTO',
                },
            },
        },
        {
            match_bool_prefix: {
                awardName: {
                    query: searchTerm,
                    operator: 'and',
                    fuzziness: 'AUTO',
                },
            },
        },
        {
            match: {
                organisationName: {
                    query: searchTerm,
                    operator: 'and',
                    fuzziness: 'AUTO',
                },
            },
        },
        {
            match_bool_prefix: {
                organisationName: {
                    query: searchTerm,
                    operator: 'and',
                    fuzziness: 'AUTO',
                },
            },
        },
        {
            match: {
                opportunityName: {
                    query: searchTerm,
                    operator: 'and',
                    fuzziness: 'AUTO',
                },
            },
        },
        {
            match_bool_prefix: {
                opportunityName: {
                    query: searchTerm,
                    operator: 'and',
                    fuzziness: 'AUTO',
                },
            },
        },
        {
            match: {
                applicationName: {
                    query: searchTerm,
                    operator: 'and',
                    fuzziness: 'AUTO',
                },
            },
        },
        {
            match_bool_prefix: {
                applicationName: {
                    query: searchTerm,
                    operator: 'and',
                    fuzziness: 'AUTO',
                },
            },
        },
        {
            match: {
                grantReference: {
                    query: searchTerm,
                    operator: 'and',
                    fuzziness: 'AUTO',
                },
            },
        },
        {
            match_bool_prefix: {
                grantReference: {
                    query: searchTerm,
                    operator: 'and',
                    fuzziness: 'AUTO',
                },
            },
        },
    ];
};

export const createAwardNumberSearchQuery = (searchTerm: string, numberFromSearch: number): AwardNumberQueries => {
    if (searchHasReferenceNumber(searchTerm, 'UKRI')) {
        return [
            {
                term: {
                    awardReference: {
                        value: numberFromSearch,
                    },
                },
            },
        ];
    } else if (searchHasReferenceNumber(searchTerm, 'APP')) {
        return [
            {
                term: {
                    applicationId: {
                        value: numberFromSearch,
                    },
                },
            },
        ];
    } else if (searchHasReferenceNumber(searchTerm, 'OPP')) {
        return [
            {
                term: {
                    opportunityId: {
                        value: numberFromSearch,
                    },
                },
            },
        ];
    } else {
        return [
            {
                term: {
                    awardReference: {
                        value: numberFromSearch,
                    },
                },
            },
            {
                term: {
                    opportunityId: {
                        value: numberFromSearch,
                    },
                },
            },
            {
                term: {
                    applicationId: {
                        value: numberFromSearch,
                    },
                },
            },
        ];
    }
};

export const appendFunderFilter = (filter: AwardFilter[], funders: AwardFunder[]): void => {
    if (funders.length) {
        filter.push({
            terms: {
                'funder.keyword': funders,
            },
        });
    }
};

export const appendDeletedAwardFilter = (filter: AwardFilter[], deleted: boolean): void => {
    if (!deleted) {
        filter.push({
            bool: {
                should: [
                    {
                        bool: {
                            must_not: {
                                exists: {
                                    field: 'deleted',
                                },
                            },
                        },
                    },
                    {
                        term: {
                            deleted: {
                                value: deleted,
                            },
                        },
                    },
                ],
            },
        });
    } else {
        filter.push({
            bool: {
                should: [
                    {
                        term: {
                            deleted: {
                                value: deleted,
                            },
                        },
                    },
                ],
            },
        });
    }
};

export const generateQuery = (
    should: AwardTextQueries | AwardNumberQueries | null,
    filter: AwardFilter[],
): AwardQuery => {
    if (should) {
        return {
            bool: {
                must: {
                    bool: {
                        should,
                    },
                },
                filter: filter,
            },
        };
    }

    return {
        bool: {
            filter: filter,
        },
    };
};
