import { describe, expect, it } from '@jest/globals';
import { AwardTask, AwardFunder, InternalAwardStatus, AwardSortFields, AssignedFilter } from '../searchService';
import { activateDateFilterScript, internalAwardsSearchBodyBuilder } from './opensearchInternalAwardQueryBuilder';

const defaultSortParams = (sortOrder: 'asc' | 'desc' = 'desc') => {
    return {
        _script: {
            order: sortOrder,
            script: {
                lang: 'painless',
                source: activateDateFilterScript('slaDate', sortOrder),
            },
            type: 'number',
        },
    };
};
describe('internalAwardsSearchBodyBuilder', () => {
    const from = 10;
    const size = 20;
    const sortField = 'task';
    const sortOrder = 'desc';
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

    it('should build the default award search body', () => {
        const expectedAwardSearchBody = {
            from: 0,
            query: { bool: { filter: [{ ...awardNotDeletedFilter }] } },
            size: 10000,
            sort: [defaultSortParams('asc')],
        };

        const result = internalAwardsSearchBodyBuilder({ external: false });

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
            sort: [defaultSortParams('asc')],
        };

        const result = internalAwardsSearchBodyBuilder({ external: false, filters: { deleted: true } });

        expect(result).toEqual(expectedAwardSearchBody);
    });

    it('should build query with default sort and pagination', () => {
        const expectedAwardSearchBody = {
            from: 0,
            query: { bool: { filter: [{ ...awardNotDeletedFilter }] } },
            size: 10000,
            sort: [defaultSortParams('asc')],
        };

        const result = internalAwardsSearchBodyBuilder({ sort: {}, pagination: {}, external: false });

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
                            ],
                        },
                    },
                    filter: [{ ...awardNotDeletedFilter }],
                },
            },
            size,
            sort: [defaultSortParams()],
        };

        const opensearchQuery = internalAwardsSearchBodyBuilder({
            searchTerm,
            pagination: { from, size },
            sort: { sortOrder },
            external: false,
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
            sort: [defaultSortParams()],
        };

        const opensearchQuery = internalAwardsSearchBodyBuilder({
            searchTerm,
            pagination: { from, size },
            sort: { sortField, sortOrder },
            external: false,
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
            sort: [defaultSortParams()],
        };

        const opensearchQuery = internalAwardsSearchBodyBuilder({
            searchTerm,
            pagination: { from, size },
            sort: { sortField, sortOrder },
            external: false,
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
            sort: [defaultSortParams()],
        };

        const opensearchQuery = internalAwardsSearchBodyBuilder({
            searchTerm,
            pagination: { from, size },
            sort: { sortField, sortOrder },
            external: false,
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
            sort: [defaultSortParams()],
        };

        const opensearchQuery = internalAwardsSearchBodyBuilder({
            searchTerm,
            pagination: { from, size },
            sort: { sortField, sortOrder },
            external: false,
        });

        expect(opensearchQuery).toStrictEqual(expectedQuery);
    });

    it('should build a task filter search query without search term', () => {
        const searchTerm = '';
        const filters = {
            tasks: ['Set-up'] as AwardTask[],
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
                                                        'tasks.title.keyword': 'Set-up',
                                                    },
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
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
            size,
            sort: [defaultSortParams()],
        };

        const opensearchQuery = internalAwardsSearchBodyBuilder({
            searchTerm,
            filters,
            pagination: { from, size },
            sort: { sortField, sortOrder },
            external: false,
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
            sort: [defaultSortParams()],
        };

        const opensearchQuery = internalAwardsSearchBodyBuilder({
            searchTerm,
            filters,
            pagination: { from, size },
            sort: { sortField, sortOrder },
            external: false,
        });

        expect(opensearchQuery).toStrictEqual(expectedQuery);
    });

    it('should build a status filter search query without search term', () => {
        const searchTerm = '';
        const filters = {
            statuses: ['Draft'] as InternalAwardStatus[],
        };
        const expectedQuery = {
            from,
            query: {
                bool: {
                    filter: [
                        { ...awardNotDeletedFilter },
                        {
                            terms: {
                                'status.keyword': ['Draft'],
                            },
                        },
                    ],
                },
            },
            size,
            sort: [defaultSortParams()],
        };

        const opensearchQuery = internalAwardsSearchBodyBuilder({
            searchTerm,
            filters,
            pagination: { from, size },
            sort: { sortField, sortOrder },
            external: false,
        });

        expect(opensearchQuery).toStrictEqual(expectedQuery);
    });

    it('should build a filter search query with search term', () => {
        const searchTerm = 'search term';
        const filters = {
            tasks: ['Set-up'] as AwardTask[],
        };
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
                            ],
                        },
                    },
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
                                                        'tasks.title.keyword': 'Set-up',
                                                    },
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
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
            size,
            sort: [defaultSortParams()],
        };

        const opensearchQuery = internalAwardsSearchBodyBuilder({
            searchTerm,
            filters,
            pagination: { from, size },
            sort: { sortField, sortOrder },
            external: false,
        });

        expect(opensearchQuery).toStrictEqual(expectedQuery);
    });

    it('should build a filter search query with number search ', () => {
        const searchTerm = '10';
        const filters = {
            tasks: ['Set-up'] as AwardTask[],
        };
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
                                                        'tasks.title.keyword': 'Set-up',
                                                    },
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
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
            size,
            sort: [defaultSortParams()],
        };

        const opensearchQuery = internalAwardsSearchBodyBuilder({
            searchTerm,
            filters,
            pagination: { from, size },
            sort: { sortField, sortOrder },
            external: false,
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

            const opensearchQuery = internalAwardsSearchBodyBuilder({
                searchTerm,
                pagination: { from, size },
                sort: { sortField: querySortField as AwardSortFields, sortOrder },
                external: false,
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
                            source: activateDateFilterScript('activateDate', sortOrder),
                        },
                        type: 'number',
                    },
                },
            ],
        };

        const opensearchQuery = internalAwardsSearchBodyBuilder({
            searchTerm,
            pagination: { from, size },
            sort: { sortField: 'receivedDate' as AwardSortFields, sortOrder },
            external: false,
        });

        expect(opensearchQuery).toStrictEqual(expectedQuery);
    });

    it('should build query with task sort field as tasks.slaDate sort', () => {
        const searchTerm = '';

        const expectedQuery = {
            from,
            query: {
                bool: { filter: [{ ...awardNotDeletedFilter }] },
            },
            size,
            sort: [defaultSortParams()],
        };

        const opensearchQuery = internalAwardsSearchBodyBuilder({
            searchTerm,
            pagination: { from, size },
            sort: { sortField: 'task' as AwardSortFields, sortOrder },
            external: false,
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

            const opensearchQuery = internalAwardsSearchBodyBuilder({
                searchTerm,
                pagination: { from, size },
                sort: { sortField: querySortField as AwardSortFields, sortOrder },
                external: false,
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
                            source: `params._source['status'] == 'Draft'? 1 : params._source['status'] == 'Awaiting authorisation'? 2: params._source['status'] == 'Awaiting acceptance'? 3: params._source['status'] == 'Announced'? 4: params._source['status'] == 'Active'? 5: params._source['status'] == 'Awaiting completion'? 6: params._source['status'] == 'Reconciling'? 7: params._source['status'] == 'Suspended'? 8: params._source['status'] == 'Awaiting termination'? 9: params._source['status'] == 'Transfer initiated'? 10 : 11`,
                        },
                        order: sortOrder,
                    },
                },
            ],
        };

        const opensearchQuery = internalAwardsSearchBodyBuilder({
            searchTerm,
            pagination: { from, size },
            sort: { sortField: 'status', sortOrder },
            external: false,
        });

        expect(opensearchQuery).toStrictEqual(expectedQuery);
    });

    it('should build assigned filters', () => {
        const filters = {
            assigned: ['assigned', 'unassigned', 45] as AssignedFilter[],
        };
        const expectedAwardSearchBody = {
            from: 0,
            query: {
                bool: {
                    filter: [
                        { ...awardNotDeletedFilter },
                        {
                            bool: {
                                should: [
                                    {
                                        exists: {
                                            field: 'assignedPersonId',
                                        },
                                    },
                                    { bool: { must_not: { exists: { field: 'assignedPersonId' } } } },
                                    {
                                        match: {
                                            assignedPersonId: 45,
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
            size: 10000,
            sort: [defaultSortParams('asc')],
        };

        const opensearchQuery = internalAwardsSearchBodyBuilder({
            filters,
            external: false,
        });

        expect(opensearchQuery).toStrictEqual(expectedAwardSearchBody);
    });
});
