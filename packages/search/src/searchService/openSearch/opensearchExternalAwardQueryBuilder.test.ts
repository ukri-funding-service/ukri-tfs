import { describe, expect, it } from '@jest/globals';
import { AwardFunder, ExternalAwardStatus, AwardSortFields, ExternalTask } from '../searchService';
import {
    taskSortScriptAscending,
    taskSortScriptDescending,
    externalAwardsSearchBodyBuilder,
    receivedDateSortScript,
} from './opensearchExternalAwardQueryBuilder';

describe('externalAwardsSearchBodyBuilder', () => {
    const awardNotDeletedFilter = {
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
                            value: false,
                        },
                    },
                },
            ],
        },
    };

    const defaultSortParamsAsc = () => {
        return {
            _script: {
                order: 'asc',
                script: {
                    lang: 'painless',
                    source: taskSortScriptAscending(),
                },
                type: 'number',
            },
        };
    };

    const defaultSortParamsDesc = () => {
        return {
            _script: {
                order: 'desc',
                script: {
                    lang: 'painless',
                    source: taskSortScriptDescending(),
                },
                type: 'number',
            },
        };
    };
    const from = 10;
    const size = 20;
    const sortField = 'task';
    const sortOrder = 'desc';

    it('should build the default award search body', () => {
        const expectedAwardSearchBody = {
            from: 0,
            query: { bool: { filter: [{ ...awardNotDeletedFilter }] } },
            size: 10000,
            sort: [defaultSortParamsAsc()],
        };

        const result = externalAwardsSearchBodyBuilder({ external: true });

        expect(result).toEqual(expectedAwardSearchBody);
    });

    it('should build award search body for deleted awards', () => {
        const expectedAwardSearchBody = {
            from: 0,
            query: {
                bool: {
                    filter: [
                        {
                            bool: {
                                should: [
                                    {
                                        term: {
                                            deleted: {
                                                value: true,
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
            size: 10000,
            sort: [defaultSortParamsAsc()],
        };

        const result = externalAwardsSearchBodyBuilder({ external: true, filters: { deleted: true } });

        expect(result).toEqual(expectedAwardSearchBody);
    });

    it('should build query with default sort and pagination', () => {
        const expectedAwardSearchBody = {
            from: 0,
            query: { bool: { filter: [{ ...awardNotDeletedFilter }] } },
            size: 10000,
            sort: [defaultSortParamsAsc()],
        };

        const result = externalAwardsSearchBodyBuilder({ sort: {}, pagination: {}, external: true });

        expect(result).toEqual(expectedAwardSearchBody);
    });

    it('should build a text search query', () => {
        const searchTerm = 'search term';

        const expectedQuery = {
            from,
            query: {
                bool: {
                    must: {
                        bool: {
                            should: [
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
                                            fuzziness: 'AUTO',
                                            operator: 'and',
                                            query: 'search term',
                                        },
                                    },
                                },
                                {
                                    match_bool_prefix: {
                                        grantReference: {
                                            fuzziness: 'AUTO',
                                            operator: 'and',
                                            query: 'search term',
                                        },
                                    },
                                },
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
                            ],
                        },
                    },
                    filter: [{ ...awardNotDeletedFilter }],
                },
            },
            size,
            sort: [defaultSortParamsDesc()],
        };

        const opensearchQuery = externalAwardsSearchBodyBuilder({
            searchTerm,
            pagination: { from, size },
            sort: { sortOrder },
            external: true,
        });

        expect(opensearchQuery).toStrictEqual(expectedQuery);
    });

    it('should build a number search query', () => {
        const searchTerm = '10';
        const expectedQuery = {
            from,
            query: {
                bool: {
                    must: {
                        bool: {
                            should: [
                                {
                                    term: {
                                        awardReference: {
                                            value: 10,
                                        },
                                    },
                                },
                                {
                                    term: {
                                        opportunityId: {
                                            value: 10,
                                        },
                                    },
                                },
                                {
                                    term: {
                                        applicationId: {
                                            value: 10,
                                        },
                                    },
                                },
                            ],
                        },
                    },

                    filter: [{ ...awardNotDeletedFilter }],
                },
            },
            size,
            sort: [defaultSortParamsDesc()],
        };

        const opensearchQuery = externalAwardsSearchBodyBuilder({
            searchTerm,
            pagination: { from, size },
            sort: { sortField, sortOrder },
            external: true,
        });

        expect(opensearchQuery).toStrictEqual(expectedQuery);
    });

    it('should build a award reference search query when searching with UKRI number', () => {
        const searchTerm = 'UKRI10';
        const expectedQuery = {
            from,
            query: {
                bool: {
                    must: {
                        bool: {
                            should: [
                                {
                                    term: {
                                        awardReference: {
                                            value: 10,
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    filter: [{ ...awardNotDeletedFilter }],
                },
            },
            size,
            sort: [defaultSortParamsDesc()],
        };

        const opensearchQuery = externalAwardsSearchBodyBuilder({
            searchTerm,
            pagination: { from, size },
            sort: { sortField, sortOrder },
            external: true,
        });

        expect(opensearchQuery).toStrictEqual(expectedQuery);
    });

    it('should build an application id search query when searching with APP number', () => {
        const searchTerm = 'APP123';
        const expectedQuery = {
            from,
            query: {
                bool: {
                    must: {
                        bool: {
                            should: [
                                {
                                    term: {
                                        applicationId: {
                                            value: 123,
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    filter: [{ ...awardNotDeletedFilter }],
                },
            },
            size,
            sort: [defaultSortParamsDesc()],
        };

        const opensearchQuery = externalAwardsSearchBodyBuilder({
            searchTerm,
            pagination: { from, size },
            sort: { sortField, sortOrder },
            external: true,
        });

        expect(opensearchQuery).toStrictEqual(expectedQuery);
    });

    it('should build an opportunity id search query when searching with OPP number', () => {
        const searchTerm = 'OPP123';
        const expectedQuery = {
            from,
            query: {
                bool: {
                    must: {
                        bool: {
                            should: [
                                {
                                    term: {
                                        opportunityId: {
                                            value: 123,
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    filter: [{ ...awardNotDeletedFilter }],
                },
            },
            size,
            sort: [defaultSortParamsDesc()],
        };

        const opensearchQuery = externalAwardsSearchBodyBuilder({
            searchTerm,
            pagination: { from, size },
            sort: { sortField, sortOrder },
            external: true,
        });

        expect(opensearchQuery).toStrictEqual(expectedQuery);
    });

    it('should build an external task filter search query with change request filter', () => {
        const searchTerm = '';
        const filters = {
            externalTasks: ['Offer response', 'Ready to start', 'Change request'] as ExternalTask[],
        };
        const expectedQuery = {
            from,
            query: {
                bool: {
                    filter: [
                        { ...awardNotDeletedFilter },
                        {
                            bool: {
                                should: [
                                    {
                                        bool: {
                                            filter: [
                                                {
                                                    term: {
                                                        'externalTasks.title.keyword': 'Offer response',
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
                                                        'externalTasks.overdueDate': {
                                                            gt: 'now',
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        bool: {
                                            filter: [
                                                {
                                                    term: {
                                                        'externalTasks.title.keyword': 'Ready to start',
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
                                                        'externalTasks.overdueDate': {
                                                            gt: 'now',
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        bool: {
                                            filter: [
                                                {
                                                    range: {
                                                        'thirdPartyExternalTasks.activateDate': {
                                                            lt: 'now',
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
            size,
            sort: [defaultSortParamsDesc()],
        };

        const opensearchQuery = externalAwardsSearchBodyBuilder({
            searchTerm,
            filters,
            pagination: { from, size },
            sort: { sortField, sortOrder },
            external: true,
        });

        expect(opensearchQuery).toStrictEqual(expectedQuery);
    });

    it('should build an external task filter search query for overdue external tasks', () => {
        const searchTerm = '';
        const filters = {
            externalTasks: ['Offer response overdue', 'Start overdue'] as ExternalTask[],
        };
        const expectedQuery = {
            from,
            query: {
                bool: {
                    filter: [
                        { ...awardNotDeletedFilter },
                        {
                            bool: {
                                should: [
                                    {
                                        bool: {
                                            filter: [
                                                {
                                                    term: {
                                                        'externalTasks.overdueTitle.keyword': 'Offer response overdue',
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
                                                        'externalTasks.overdueDate': {
                                                            lt: 'now',
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        bool: {
                                            filter: [
                                                {
                                                    term: {
                                                        'externalTasks.overdueTitle.keyword': 'Start overdue',
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
                                                        'externalTasks.overdueDate': {
                                                            lt: 'now',
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
            size,
            sort: [defaultSortParamsDesc()],
        };

        const opensearchQuery = externalAwardsSearchBodyBuilder({
            searchTerm,
            filters,
            pagination: { from, size },
            sort: { sortField, sortOrder },
            external: true,
        });

        expect(opensearchQuery).toStrictEqual(expectedQuery);
    });

    it('should build a funders filter search query without search term', () => {
        const searchTerm = '';
        const filters = {
            funders: ['AHRC'] as AwardFunder[],
        };
        const expectedQuery = {
            from,
            query: {
                bool: {
                    filter: [
                        { ...awardNotDeletedFilter },
                        {
                            terms: {
                                'funder.keyword': ['AHRC'],
                            },
                        },
                    ],
                },
            },
            size,
            sort: [defaultSortParamsDesc()],
        };

        const opensearchQuery = externalAwardsSearchBodyBuilder({
            searchTerm,
            filters,
            pagination: { from, size },
            sort: { sortField, sortOrder },
            external: true,
        });

        expect(opensearchQuery).toStrictEqual(expectedQuery);
    });

    it('should build a organisationId filter search query without search term', () => {
        const searchTerm = '';
        const filters = {
            organisationIds: [444, 555],
        };
        const expectedQuery = {
            from,
            query: {
                bool: {
                    filter: [
                        { ...awardNotDeletedFilter },
                        {
                            terms: {
                                organisationId: [444, 555],
                            },
                        },
                    ],
                },
            },
            size,
            sort: [defaultSortParamsDesc()],
        };

        const opensearchQuery = externalAwardsSearchBodyBuilder({
            searchTerm,
            filters,
            pagination: { from, size },
            sort: { sortField, sortOrder },
            external: true,
        });

        expect(opensearchQuery).toStrictEqual(expectedQuery);
    });

    it('should build a status filter search query without search term', () => {
        const searchTerm = '';
        const filters = {
            externalStatuses: ['Announced'] as ExternalAwardStatus[],
        };
        const expectedQuery = {
            from,
            query: {
                bool: {
                    filter: [
                        { ...awardNotDeletedFilter },
                        {
                            terms: {
                                'externalStatus.keyword': ['Announced'],
                            },
                        },
                    ],
                },
            },
            size,
            sort: [defaultSortParamsDesc()],
        };

        const opensearchQuery = externalAwardsSearchBodyBuilder({
            searchTerm,
            filters,
            pagination: { from, size },
            sort: { sortField, sortOrder },
            external: true,
        });

        expect(opensearchQuery).toStrictEqual(expectedQuery);
    });

    it.each([
        { querySortField: 'awardReferenceAndName', expectedSortField: 'awardReference' },
        { querySortField: 'organisation', expectedSortField: 'organisationName.keyword' },
        { querySortField: 'funder', expectedSortField: 'funder.keyword' },
        { querySortField: 'endDate', expectedSortField: 'endDate' },
    ])(
        'should build query with $querySortField sort field as $expectedSortField sort',
        ({ querySortField, expectedSortField }) => {
            const searchTerm = '';

            const expectedQuery = {
                from,
                query: {
                    bool: { filter: [{ ...awardNotDeletedFilter }] },
                },
                size,
                sort: [
                    {
                        [expectedSortField]: {
                            order: sortOrder,
                        },
                    },
                ],
            };

            const opensearchQuery = externalAwardsSearchBodyBuilder({
                searchTerm,
                pagination: { from, size },
                sort: { sortField: querySortField as AwardSortFields, sortOrder },
                external: true,
            });

            expect(opensearchQuery).toStrictEqual(expectedQuery);
        },
    );

    it('should build query with sort field as tasks.activateDate sort when sorting by received date', () => {
        const searchTerm = '';

        const expectedQuery = {
            from,
            query: {
                bool: { filter: [{ ...awardNotDeletedFilter }] },
            },
            size,
            sort: [
                {
                    _script: {
                        order: sortOrder,
                        script: {
                            lang: 'painless',
                            source: receivedDateSortScript(sortOrder),
                        },
                        type: 'number',
                    },
                },
            ],
        };

        const opensearchQuery = externalAwardsSearchBodyBuilder({
            searchTerm,
            pagination: { from, size },
            sort: { sortField: 'receivedDate' as AwardSortFields, sortOrder },
            external: true,
        });

        expect(opensearchQuery).toStrictEqual(expectedQuery);
    });

    it('should generate painless script that sorts by externalTasks', () => {
        const filterScript = receivedDateSortScript(sortOrder);

        expect(filterScript).toContain('externalTasks');
        expect(filterScript).not.toContain('tasks');
    });

    it('should build query with task sort field as tasks.slaDate sort', () => {
        const searchTerm = '';

        const expectedQuery = {
            from,
            query: {
                bool: { filter: [{ ...awardNotDeletedFilter }] },
            },
            size,
            sort: [defaultSortParamsDesc()],
        };

        const opensearchQuery = externalAwardsSearchBodyBuilder({
            searchTerm,
            pagination: { from, size },
            sort: { sortField: 'task' as AwardSortFields, sortOrder },
            external: true,
        });

        expect(opensearchQuery).toStrictEqual(expectedQuery);
    });

    it.each([{ querySortField: 'startDate', expectedSortFields: ['earliestStartDate', 'actualStartDate'] }])(
        'should build query with $querySortField sort field as $expectedSortFields sort',
        ({ querySortField, expectedSortFields }) => {
            const searchTerm = '';

            const expectedQuery = {
                from,
                query: {
                    bool: { filter: [{ ...awardNotDeletedFilter }] },
                },
                size,
                sort: expectedSortFields.map(field => ({
                    [field]: {
                        order: sortOrder,
                    },
                })),
            };

            const opensearchQuery = externalAwardsSearchBodyBuilder({
                searchTerm,
                pagination: { from, size },
                sort: { sortField: querySortField as AwardSortFields, sortOrder },
                external: true,
            });

            expect(opensearchQuery).toStrictEqual(expectedQuery);
        },
    );

    it('should build query with status sort field as script sort', () => {
        const searchTerm = '';

        const expectedQuery = {
            from,
            query: {
                bool: { filter: [{ ...awardNotDeletedFilter }] },
            },
            size,
            sort: [
                {
                    _script: {
                        type: 'number',
                        script: {
                            lang: 'painless',
                            source: `params._source['externalStatus'] == 'Awaiting acceptance'? 1 : params._source['externalStatus'] == 'Returned for amendments'? 2: params._source['externalStatus'] == 'Announced'? 3: params._source['externalStatus'] == 'Active'? 4: params._source['status'] == 'Awaiting completion'? 5: params._source['status'] == 'Reconciling'? 6: params._source['externalStatus'] == 'Suspended'? 7: params._source['externalStatus'] == 'Awaiting termination'? 8: params._source['externalStatus'] == 'Transfer initiated'? 9 : 10`,
                        },
                        order: sortOrder,
                    },
                },
            ],
        };

        const opensearchQuery = externalAwardsSearchBodyBuilder({
            searchTerm,
            pagination: { from, size },
            sort: { sortField: 'status', sortOrder },
            external: true,
        });

        expect(opensearchQuery).toStrictEqual(expectedQuery);
    });
});
