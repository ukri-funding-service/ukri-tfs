import {
    AwardFunder,
    ExternalAwardStatus,
    OrganisationIdFilter,
    ExternalTaskTitleFilter,
    OverdueExternalTask,
    ExternalTask,
    overdueExternalTasks,
    mapSortFieldForAward,
    AwardSortFields,
} from '../searchService';
import { extractNumberReferenceFromSearch } from '../searchServiceHelpers';
import {
    OpensearchFieldSortQuery,
    OpensearchScriptSortQuery,
    OpensearchSortOrder,
    PaginationOptions,
    QueryMatch,
    QueryMatchBoolPrefix,
} from './openSearchQueryModels';
import {
    AwardFieldSortOptions,
    AwardFilter,
    AwardNumberQueries,
    AwardSearchBody,
    AwardTextQueries,
    AwardTextQueriesBase,
    appendFunderFilter,
    createAwardNumberSearchQuery,
    createAwardTextSearchQuery,
    generateQuery,
    appendDeletedAwardFilter,
} from './opensearchAwardQueryBuilderBase';

export type AwardExternalStatusFilter = {
    terms: {
        'externalStatus.keyword': ExternalAwardStatus[];
    };
};

export type AwardOrganisationIdFilter = {
    terms: {
        organisationId: number[];
    };
};

export type ExternalAwardQueryBuilderOptions = {
    pagination?: PaginationOptions;
    filters?: {
        externalTasks?: ExternalTaskTitleFilter[];
        funders?: AwardFunder[];
        externalStatuses?: ExternalAwardStatus[];
        organisationIds?: OrganisationIdFilter[];
        deleted?: boolean;
    };
    searchTerm?: string;
    sort?: AwardFieldSortOptions;
    external: true;
};

export type AwardTextQueriesExternal = [
    ...AwardTextQueriesBase,
    QueryMatch<'awardHolderFirstName'>,
    QueryMatchBoolPrefix<'awardHolderFirstName'>,
    QueryMatch<'awardHolderLastName'>,
    QueryMatchBoolPrefix<'awardHolderLastName'>,
];

export const taskSortScriptAscending = (): string => `
    long now = System.currentTimeMillis();
    long relevantDate = Long.MAX_VALUE;
    long offset = Long.MAX_VALUE / 2;
    for (int i = 0; i < doc['externalTasks.activateDate'].length; i++) {
        long activateDate = doc['externalTasks.activateDate'][i].getMillis();
        long sortDate = doc['externalTasks.slaDate'][i].getMillis();

        if (activateDate <= now && sortDate < relevantDate) {
            relevantDate = sortDate;
        }
    }
    if(relevantDate === Long.MAX_VALUE) {
        for (int i = 0; i < doc['thirdPartyExternalTasks.activateDate'].length; i++) {
            long activateDate = doc['thirdPartyExternalTasks.activateDate'][i].getMillis();
            long sortDate = activateDate + offset;
    
            if (activateDate <= now && sortDate < relevantDate) {
                relevantDate = sortDate;
            }
        }
    }
    return relevantDate;
`;

export const taskSortScriptDescending = (): string => `
    long now = System.currentTimeMillis();
    long relevantDate = 0;
    long offset = Long.MAX_VALUE / 2;
    for (int i = 0; i < doc['thirdPartyExternalTasks.activateDate'].length; i++) {
        long activateDate = doc['thirdPartyExternalTasks.activateDate'][i].getMillis();
        long sortDate = activateDate + offset;

        if (activateDate <= now && sortDate > relevantDate) {
            relevantDate = sortDate;
        }
    }

    if(relevantDate === 0) {
        for (int i = 0; i < doc['externalTasks.activateDate'].length; i++) {
            long activateDate = doc['externalTasks.activateDate'][i].getMillis();
            long sortDate = doc['externalTasks.slaDate'][i].getMillis();

            if (activateDate <= now && sortDate > relevantDate) {
                relevantDate = sortDate;
            }
        }
    } 
    return relevantDate;
`;

export const receivedDateSortScript = (sortOrder: OpensearchSortOrder): string => `
    long now = System.currentTimeMillis();
    long relevantDate = '${sortOrder}' == 'asc' ? Long.MAX_VALUE : 0;

    def activateDatePaths = ['externalTasks.activateDate', 'thirdPartyExternalTasks.activateDate'];

    for (def path : activateDatePaths) {
        if (doc.containsKey(path)) {
            for (def date : doc[path]) {
                long sortDate = date.getMillis();

                if (sortDate <= now) {
                    if ('${sortOrder}' == 'asc' && sortDate < relevantDate) {
                        relevantDate = sortDate;
                    } else if ('${sortOrder}' == 'desc' && sortDate > relevantDate) {
                        relevantDate = sortDate;
                    }
                }
            }
        }
    }
    
    return relevantDate;
`;

export const externalAwardsSearchBodyBuilder = (
    queryBuilderOptions: ExternalAwardQueryBuilderOptions,
): AwardSearchBody => {
    let should: AwardTextQueries | AwardNumberQueries | null = null;

    const filter: AwardFilter[] = [];
    const {
        searchTerm = null,
        filters: { externalTasks = [], funders = [], externalStatuses = [], organisationIds = [], deleted = false } = {
            externalTasks: [],
            funders: [],
            externalStatuses: [],
            organisationIds: [],
            deleted: false,
        },
        sort: { sortField = 'task', sortOrder = 'asc' } = { sortField: 'task', sortOrder: 'asc' },
        pagination: { from = 0, size = 10000 } = { from: 0, size: 10000 },
    } = queryBuilderOptions;

    if (searchTerm) {
        const numberFromSearch = extractNumberReferenceFromSearch(searchTerm);

        if (!numberFromSearch) {
            should = createExternalTextSearchQuery(searchTerm);
        } else {
            should = createAwardNumberSearchQuery(searchTerm, numberFromSearch);
        }
    }
    appendDeletedAwardFilter(filter, deleted);
    appendTaskFilter(filter, externalTasks);
    appendFunderFilter(filter, funders);
    appendStatusFilter(filter, externalStatuses);
    appendOrganisationIdFilter(filter, organisationIds);

    const query = generateQuery(should, filter);

    const sort = createSort(sortField, sortOrder);

    return { query, from, size, sort };
};

const createExternalTextSearchQuery = (searchTerm: string): AwardTextQueriesExternal => {
    const textSearchQuery = createAwardTextSearchQuery(searchTerm);

    const extendedSearchQuery: AwardTextQueriesExternal = [
        ...textSearchQuery,
        {
            match: {
                awardHolderFirstName: {
                    query: searchTerm,
                    operator: 'and',
                    fuzziness: 'AUTO',
                },
            },
        },
        {
            match_bool_prefix: {
                awardHolderFirstName: {
                    query: searchTerm,
                    operator: 'and',
                    fuzziness: 'AUTO',
                },
            },
        },
        {
            match: {
                awardHolderLastName: {
                    query: searchTerm,
                    operator: 'and',
                    fuzziness: 'AUTO',
                },
            },
        },
        {
            match_bool_prefix: {
                awardHolderLastName: {
                    query: searchTerm,
                    operator: 'and',
                    fuzziness: 'AUTO',
                },
            },
        },
    ];
    return extendedSearchQuery;
};

const appendStatusFilter = (filter: AwardFilter[], statuses: ExternalAwardStatus[]) => {
    if (statuses.length) {
        filter.push({
            terms: {
                'externalStatus.keyword': statuses,
            },
        });
    }
};

const appendOrganisationIdFilter = (filter: AwardFilter[], organisationIds: OrganisationIdFilter[]) => {
    if (organisationIds.length) {
        filter.push({
            terms: {
                organisationId: organisationIds,
            },
        });
    }
};

type ExternalThirdPartyTaskFilter = [
    {
        range: {
            'thirdPartyExternalTasks.activateDate': {
                lt: 'now';
            };
        };
    },
];

type ExternalOverdueUnderdueFilter = [
    {
        term:
            | {
                  'externalTasks.title.keyword': ExternalTask;
              }
            | {
                  'externalTasks.overdueTitle.keyword': OverdueExternalTask;
              };
    },
    {
        range: {
            'externalTasks.activateDate': {
                lt: 'now';
            };
        };
    },
    {
        range: {
            'externalTasks.overdueDate':
                | {
                      lt: 'now';
                  }
                | {
                      gt: 'now';
                  };
        };
    },
];

type ExternalTaskFilter = {
    bool: {
        filter: ExternalThirdPartyTaskFilter | ExternalOverdueUnderdueFilter;
    };
};

export type ExternalTaskFilterBool = {
    bool: {
        should: ExternalTaskFilter[];
    };
};

const appendTaskFilter = (filter: AwardFilter[], tasks: ExternalTaskTitleFilter[]) => {
    if (tasks.length) {
        const should: ExternalTaskFilter[] = [];

        tasks.forEach((task: ExternalTaskTitleFilter) => {
            let filterClause: ExternalThirdPartyTaskFilter | ExternalOverdueUnderdueFilter;
            if (task === 'Change request') {
                filterClause = [
                    {
                        range: {
                            'thirdPartyExternalTasks.activateDate': {
                                lt: 'now',
                            },
                        },
                    },
                ];
            } else {
                const isOverdue = overdueExternalTasks.includes(task);
                filterClause = [
                    {
                        term: isOverdue
                            ? {
                                  'externalTasks.overdueTitle.keyword': task,
                              }
                            : {
                                  'externalTasks.title.keyword': task,
                              },
                    },
                    {
                        range: {
                            'externalTasks.activateDate': {
                                lt: 'now',
                            },
                        },
                    },
                    {
                        range: {
                            'externalTasks.overdueDate': isOverdue
                                ? {
                                      lt: 'now',
                                  }
                                : {
                                      gt: 'now',
                                  },
                        },
                    },
                ];
            }
            should.push({
                bool: {
                    filter: filterClause,
                },
            });
        });
        filter.push({ bool: { should: should } });
    }
};

const createSort = (
    sortField: AwardSortFields,
    sortOrder: OpensearchSortOrder,
): OpensearchFieldSortQuery[] | OpensearchScriptSortQuery[] => {
    if (sortField === 'status') {
        return [
            {
                _script: {
                    order: sortOrder,
                    type: 'number',
                    script: {
                        lang: 'painless',
                        source: `params._source['externalStatus'] == 'Awaiting acceptance'? 1 : params._source['externalStatus'] == 'Returned for amendments'? 2: params._source['externalStatus'] == 'Announced'? 3: params._source['externalStatus'] == 'Active'? 4: params._source['status'] == 'Awaiting completion'? 5: params._source['status'] == 'Reconciling'? 6: params._source['externalStatus'] == 'Suspended'? 7: params._source['externalStatus'] == 'Awaiting termination'? 8: params._source['externalStatus'] == 'Transfer initiated'? 9 : 10`,
                    },
                },
            },
        ];
    } else if (sortField === 'receivedDate') {
        return [
            {
                _script: {
                    order: sortOrder,
                    type: 'number',
                    script: {
                        lang: 'painless',
                        source: receivedDateSortScript(sortOrder),
                    },
                },
            },
        ];
    } else if (sortField === 'task') {
        return [
            {
                _script: {
                    order: sortOrder,
                    type: 'number',
                    script: {
                        lang: 'painless',
                        source: sortOrder === 'asc' ? taskSortScriptAscending() : taskSortScriptDescending(),
                    },
                },
            },
        ];
    } else {
        const sortFields = mapSortFieldForAward[sortField];
        return sortFields.map(field => ({
            [field]: {
                order: sortOrder,
            },
        }));
    }
};
