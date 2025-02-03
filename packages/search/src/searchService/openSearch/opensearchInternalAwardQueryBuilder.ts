import {
    AssignedFilter,
    AwardFunder,
    AwardSortFields,
    AwardTask,
    InternalAwardStatus,
    mapSortFieldForAward,
} from '../searchService';
import { extractNumberReferenceFromSearch } from '../searchServiceHelpers';
import {
    OpensearchFieldSortQuery,
    OpensearchScriptSortQuery,
    OpensearchSortOrder,
    PaginationOptions,
} from './openSearchQueryModels';
import {
    AwardFieldSortOptions,
    AwardFilter,
    AwardNumberQueries,
    AwardSearchBody,
    AwardTextQueries,
    appendFunderFilter,
    createAwardNumberSearchQuery,
    createAwardTextSearchQuery,
    generateQuery,
    appendDeletedAwardFilter,
} from './opensearchAwardQueryBuilderBase';

export type AwardInternalStatusFilter = {
    terms: {
        'status.keyword': InternalAwardStatus[];
    };
};

type InternalTaskFilter = [
    {
        term: { 'tasks.title.keyword': AwardTask };
    },
    {
        range: {
            'tasks.activateDate': {
                lt: 'now';
            };
        };
    },
];

type InternalTaskShould = { bool: { filter: InternalTaskFilter } };

export type InternalTaskFilterBool = {
    bool: {
        should: InternalTaskShould[];
    };
};

type AwardAssignedExistFilter = {
    exists: {
        field: 'assignedPersonId';
    };
};

type AwardAssignedValueFilter = {
    match: {
        assignedPersonId: number;
    };
};

type AwardAssignedEmptyFilter = {
    bool: { must_not: { exists: { field: 'assignedPersonId' } } };
};

export type AwardAssignedFilter = AwardAssignedValueFilter | AwardAssignedExistFilter | AwardAssignedEmptyFilter;

export type AwardAssignedFilterBool = {
    bool: {
        should: AwardAssignedFilter[];
    };
};

export type InternalAwardQueryBuilderOptions = {
    pagination?: PaginationOptions;
    filters?: {
        tasks?: AwardTask[];
        funders?: AwardFunder[];
        statuses?: InternalAwardStatus[];
        assigned?: AssignedFilter[];
        deleted?: boolean;
    };
    searchTerm?: string;
    sort?: AwardFieldSortOptions;
    external: false;
};

export const activateDateFilterScript = (
    sortProperty: 'slaDate' | 'activateDate',
    sortOrder: OpensearchSortOrder,
): string => `
    long now = System.currentTimeMillis();
    long relevantDate = '${sortOrder}' == 'asc' ? Long.MAX_VALUE : 0;
    for (int i = 0; i < doc['tasks.activateDate'].length; i++) {
        long activateDate = doc['tasks.activateDate'][i].getMillis();
        long sortDate = doc['tasks.${sortProperty}'][i].getMillis();

        if (activateDate <= now) {
            if ('${sortOrder}' == 'asc' && sortDate < relevantDate) {
                relevantDate = sortDate;
            } else if ('${sortOrder}' == 'desc' && sortDate > relevantDate) {
                relevantDate = sortDate;
            }
        }
    }
    return relevantDate;
`;

export const internalAwardsSearchBodyBuilder = (
    queryBuilderOptions: InternalAwardQueryBuilderOptions,
): AwardSearchBody => {
    let should: AwardTextQueries | AwardNumberQueries | null = null;

    const filter: AwardFilter[] = [];
    const {
        searchTerm = null,
        filters: { tasks = [], funders = [], statuses = [], assigned = [], deleted = false } = {
            tasks: [],
            funders: [],
            statuses: [],
            assigned: [],
            organisationIds: [],
            deleted: false,
        },
        sort: { sortField = 'task', sortOrder = 'asc' } = { sortField: 'task', sortOrder: 'asc' },
        pagination: { from = 0, size = 10000 } = { from: 0, size: 10000 },
    } = queryBuilderOptions;

    if (searchTerm) {
        const numberFromSearch = extractNumberReferenceFromSearch(searchTerm);

        if (!numberFromSearch) {
            should = createAwardTextSearchQuery(searchTerm);
        } else {
            should = createAwardNumberSearchQuery(searchTerm, numberFromSearch);
        }
    }
    appendDeletedAwardFilter(filter, deleted);
    appendTaskFilter(filter, tasks);
    appendFunderFilter(filter, funders);
    appendStatusFilter(filter, statuses);
    appendAssignedFilter(filter, assigned);

    const query = generateQuery(should, filter);

    const sort = createSort(sortField, sortOrder);

    return { query, from, size, sort };
};

export const appendStatusFilter = (filter: AwardFilter[], statuses: InternalAwardStatus[]): void => {
    if (statuses.length) {
        filter.push({
            terms: {
                'status.keyword': statuses,
            },
        });
    }
};

const appendAssignedFilter = (filter: AwardFilter[], assignedQueryFilters: AssignedFilter[]) => {
    if (assignedQueryFilters.length > 0) {
        const mappedAssignedQueryFilters: AwardAssignedFilter[] = assignedQueryFilters.map(assignedQueryFilter => {
            if (assignedQueryFilter === 'assigned') {
                return {
                    exists: {
                        field: 'assignedPersonId',
                    },
                };
            } else if (assignedQueryFilter === 'unassigned') {
                return {
                    bool: { must_not: { exists: { field: 'assignedPersonId' } } },
                };
            } else {
                return {
                    match: {
                        assignedPersonId: assignedQueryFilter,
                    },
                };
            }
        });
        filter.push({
            bool: {
                should: mappedAssignedQueryFilters,
            },
        });
    }
};

const appendTaskFilter = (filter: AwardFilter[], tasks: AwardTask[]) => {
    if (tasks.length) {
        const should: InternalTaskShould[] = [];

        tasks.forEach((task: AwardTask) => {
            should.push({
                bool: {
                    filter: [
                        {
                            term: { 'tasks.title.keyword': task },
                        },
                        {
                            range: {
                                'tasks.activateDate': {
                                    lt: 'now',
                                },
                            },
                        },
                    ],
                },
            });
        });
        filter.push({ bool: { should } });
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
                        source: `params._source['status'] == 'Draft'? 1 : params._source['status'] == 'Awaiting authorisation'? 2: params._source['status'] == 'Awaiting acceptance'? 3: params._source['status'] == 'Announced'? 4: params._source['status'] == 'Active'? 5: params._source['status'] == 'Awaiting completion'? 6: params._source['status'] == 'Reconciling'? 7: params._source['status'] == 'Suspended'? 8: params._source['status'] == 'Awaiting termination'? 9: params._source['status'] == 'Transfer initiated'? 10 : 11`,
                    },
                },
            },
        ];
    } else if (sortField === 'receivedDate' || sortField === 'task') {
        return [
            {
                _script: {
                    order: sortOrder,
                    type: 'number',
                    script: {
                        lang: 'painless',
                        source: activateDateFilterScript(
                            sortField === 'receivedDate' ? 'activateDate' : 'slaDate',
                            sortOrder,
                        ),
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
