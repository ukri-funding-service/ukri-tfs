import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { buildSearchServiceAwardDto } from '../../../test/testHelpers';
import { MockAward, MockSearchService } from './mockSearchService';
import {
    awardFunders,
    AwardSearchArgs,
    AwardSearchOptions,
    InternalAwardStatus,
    SearchService,
    SearchServiceAwardDto,
    SearchServiceAwardResults,
    SortOrderEnum,
} from '../searchService';

const mockStatuses: InternalAwardStatus[] = [
    'Draft',
    'Awaiting authorisation',
    'Awaiting acceptance',
    'Announced',
    'Active',
    'Suspended',
    'Awaiting termination',
    'Transfer initiated',
    'Closed',
];

describe('mock search service - getAwards', () => {
    const buildAwards = (opportunityId: number, applicationId: number) => {
        return (id: number) => {
            const monthPlusOne = (id < 9 ? `0` : '') + `${id + 1}`;
            const monthPlusTwo = (id < 8 ? `0` : '') + `${id + 2}`;
            return buildSearchServiceAwardDto({
                id: id + 1,
                awardReference: id + 100 * opportunityId,
                opportunityId,
                applicationId,
                awardName: `Mock award ${id + 1}`,
                opportunityName: `Mock opportunity ${id + 1}`,
                applicationName: `Mock application ${id + 1}`,
                organisationName: `Mock organisation ${id + 1}`,
                awardHolderFirstName: `First${id + 1}`,
                awardHolderLastName: `Last${id + 1}`,
                status: `${mockStatuses[(id + 1) % mockStatuses.length]}`,
                externalStatus: 'Announced',
                grantReference: `AB/V1234${opportunityId}/0${id}`,
                funder: id === 6 ? undefined : `${awardFunders[(id + 1) % awardFunders.length]}`,
                tasks: [
                    {
                        title: `Set-up`,
                        slaDate: new Date(
                            `2021-0${opportunityId > 1 ? 1 : 2}-${monthPlusOne}T00:00:00.000Z`,
                        ).toISOString(),
                        activateDate: new Date(
                            `2021-0${opportunityId > 1 ? 1 : 2}-${monthPlusOne}T00:00:00.000Z`,
                        ).toISOString(),
                    },
                    {
                        title: `Extension`,
                        slaDate: new Date(
                            `2021-0${opportunityId > 1 ? 1 : 2}-${id === 9 ? '09' : monthPlusTwo}T00:00:00.000Z`,
                        ).toISOString(),
                        activateDate: new Date(
                            `2021-0${opportunityId > 1 ? 1 : 2}-${id === 9 ? '09' : monthPlusTwo}T00:00:00.000Z`,
                        ).toISOString(),
                    },
                ],
            });
        };
    };

    const buildSearchServiceAwardDtos = (opportunityId: number, applicationId: number) => {
        return (id: number) => {
            const monthPlusOne = (id < 9 ? `0` : '') + `${id + 1}`;
            const monthPlusTwo = (id < 8 ? `0` : '') + `${id + 2}`;
            return buildSearchServiceAwardDto({
                id: id + 1,
                awardReference: id + 100 * opportunityId,
                opportunityId,
                applicationId,
                awardName: `Mock award ${id + 1}`,
                opportunityName: `Mock opportunity ${id + 1}`,
                applicationName: `Mock application ${id + 1}`,
                awardHolderFirstName: `First${id + 1}`,
                awardHolderLastName: `Last${id + 1}`,
                organisationName: `Mock organisation ${id + 1}`,
                funder: id === 6 ? undefined : `${awardFunders[(id + 1) % awardFunders.length]}`,
                status: `${mockStatuses[(id + 1) % mockStatuses.length]}`,
                externalStatus: id === 6 ? 'Invalid' : 'Announced',
                grantReference: `AB/V1234${opportunityId}/0${id}`,
                deleted: false,
                tasks: [
                    {
                        title: `Set-up`,
                        slaDate: new Date(
                            `2021-0${opportunityId > 1 ? 1 : 2}-${monthPlusOne}T00:00:00.000Z`,
                        ).toISOString(),
                        activateDate: new Date(
                            `2021-0${opportunityId > 1 ? 1 : 2}-${monthPlusOne}T00:00:00.000Z`,
                        ).toISOString(),
                    },
                    {
                        title: id === 8 ? `Transfer` : 'Extension',
                        slaDate: new Date(
                            `2021-0${opportunityId > 1 ? 1 : 2}-${id === 9 ? '09' : monthPlusTwo}T00:00:00.000Z`,
                        ).toISOString(),
                        activateDate: new Date(
                            `2021-0${opportunityId > 1 ? 1 : 2}-${id === 9 ? '09' : monthPlusTwo}T00:00:00.000Z`,
                        ).toISOString(),
                    },
                ],
            });
        };
    };

    const mockAwardsForOpportunity1: MockAward[] = Array.from(Array(10).keys()).map(buildSearchServiceAwardDtos(1, 2));
    const mockAwardsForOpportunity2: MockAward[] = Array.from(Array(5).keys()).map(buildSearchServiceAwardDtos(2, 3));
    const mockAwardForOpportunity: MockAward = buildSearchServiceAwardDto({
        id: 51,
        awardName: `Mock award about AI`,
        awardReference: 51 + 100 * 10000,
        opportunityId: 10000,
        applicationId: 30,
    });

    const mockAwardForOpportunity4: MockAward = buildSearchServiceAwardDto({
        id: 52,
        awardName: `Award about AI`,
        awardReference: 52 + 100 * 10000,
        opportunityId: 999,
        applicationId: 31,
        actualStartDate: new Date('2023-01-01T00:00:00.000Z').toISOString(),
    });

    const mockAssigneeAward: MockAward = buildSearchServiceAwardDto({
        id: 53,
        assignedPersonId: 23,
        assignedPersonName: 'assignee du nom',
    });

    let searchService: SearchService;

    beforeEach(() => {
        searchService = new MockSearchService(
            [],
            [
                ...mockAwardsForOpportunity1,
                ...mockAwardsForOpportunity2,
                mockAwardForOpportunity,
                mockAwardForOpportunity4,
            ],
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return mapped awards with pagination meta', async () => {
        const expectedSearchServiceAwards: SearchServiceAwardDto[] = mockAwardsForOpportunity1;

        const searchArguments: AwardSearchArgs = {
            searchTerm: '1',
        };

        const expectedSearchServiceResults: SearchServiceAwardResults = {
            meta: {
                countOnPage: 5,
                page: 1,
                totalCount: 10,
                pageSize: 5,
                totalPages: 2,
            },
            results: expectedSearchServiceAwards.slice(0, 5),
        };

        const response = await searchService.getAwards(searchArguments, {
            pageSize: 5,
            sortOrder: SortOrderEnum.Asc,
        });

        expect(response).toEqual(expectedSearchServiceResults);
    });

    describe('searching with search terms', () => {
        const firstAward: SearchServiceAwardDto = mockAwardsForOpportunity1.find(
            award => award.awardReference === 100,
        )!;
        const secondAward = buildSearchServiceAwardDto({
            id: 10,
            awardReference: 109,
            awardName: `Mock award 10`,
            opportunityId: 1,
            applicationId: 2,
            organisationName: 'Mock organisation 10',
            awardHolderFirstName: 'First10',
            awardHolderLastName: 'Last10',
            opportunityName: 'Mock opportunity 10',
            applicationName: 'Mock application 10',
            funder: `${awardFunders[10 % awardFunders.length]}`,
            status: 'Awaiting authorisation',
            externalStatus: 'Announced',
            grantReference: 'AB/V12341/09',
            tasks: [
                {
                    title: `Extension`,
                    slaDate: new Date(`2021-02-09T00:00:00.000Z`).toISOString(),
                    activateDate: new Date(`2021-02-09T00:00:00.000Z`).toISOString(),
                },
                {
                    title: `Set-up`,
                    slaDate: new Date(`2021-02-10T00:00:00.000Z`).toISOString(),
                    activateDate: new Date(`2021-02-10T00:00:00.000Z`).toISOString(),
                },
            ],
            externalTasks: [],
        });
        const thirdAward = mockAwardsForOpportunity2.find(award => award.awardReference === 200)!;

        it.each([
            { searchTerm: 'award 1' },
            { searchTerm: 'organisation 1' },
            { searchTerm: 'application 1' },
            { searchTerm: 'opportunity 1' },
            { searchTerm: 'first1' },
            { searchTerm: 'last1' },
        ])(`should return mappedMockAwards given queried by %s`, async ({ searchTerm }) => {
            const results = [thirdAward, firstAward, secondAward];
            const searchArguments: AwardSearchArgs = {
                searchTerm,
            };
            const expectedSearchServiceResults: SearchServiceAwardResults = {
                meta: {
                    countOnPage: 3,
                    page: 1,
                    pageSize: undefined,
                    totalCount: 3,
                    totalPages: 1,
                },
                results,
            };

            const response = await searchService.getAwards(searchArguments);

            expect(response).toEqual(expectedSearchServiceResults);
        });

        it('searches by assigned user', async () => {
            const searchServiceWithAssigned = new MockSearchService(
                [],
                [...mockAwardsForOpportunity1, mockAssigneeAward, ...mockAwardsForOpportunity2],
            );

            const expectedSearchServiceResults: SearchServiceAwardResults = {
                meta: {
                    countOnPage: 1,
                    page: 1,
                    pageSize: undefined,
                    totalCount: 1,
                    totalPages: 1,
                },
                results: [mockAssigneeAward],
            };

            const response = await searchServiceWithAssigned.getAwards({ searchTerm: 'assignee' });
            expect(response).toEqual(expectedSearchServiceResults);
        });

        it.each([{ searchTerm: '100' }, { searchTerm: 'UKRI100' }, { searchTerm: 'AB/V12341/00' }])(
            'should return mappedMockApplication given queried by id %s',
            async ({ searchTerm }) => {
                const results = [firstAward];
                const searchArguments: AwardSearchArgs = {
                    searchTerm,
                };
                const expectedSearchServiceResults: SearchServiceAwardResults = {
                    meta: {
                        countOnPage: 1,
                        page: 1,
                        totalCount: 1,
                        totalPages: 1,
                    },
                    results,
                };

                const response = await searchService.getAwards(searchArguments);

                expect(response).toEqual(expectedSearchServiceResults);
            },
        );

        it.each([{ searchTerm: '10000' }, { searchTerm: '30' }])(
            'should return mappedMockApplication given queried by id %s',
            async ({ searchTerm }) => {
                const results = [mockAwardForOpportunity];
                const searchArguments: AwardSearchArgs = {
                    searchTerm,
                };
                const expectedSearchServiceResults: SearchServiceAwardResults = {
                    meta: {
                        countOnPage: 1,
                        page: 1,
                        totalCount: 1,
                        totalPages: 1,
                    },
                    results,
                };

                const response = await searchService.getAwards(searchArguments);

                expect(response).toEqual(expectedSearchServiceResults);
            },
        );
    });

    it('should paginate mock awards', async () => {
        const expectedSearchServiceAwards: SearchServiceAwardDto[] = [2, 3].map(buildAwards(1, 2));
        const searchArguments: AwardSearchArgs = {
            searchTerm: '1',
        };
        const searchOptions: AwardSearchOptions = {
            pageSize: 2,
            page: 2,
        };
        const expectedSearchServiceResults: SearchServiceAwardResults = {
            meta: {
                countOnPage: 2,
                page: 2,
                totalCount: 10,
                totalPages: 5,
                pageSize: 2,
            },
            results: expectedSearchServiceAwards,
        };

        const response = await searchService.getAwards(searchArguments, searchOptions);

        expect(response).toEqual(expectedSearchServiceResults);
    });

    describe('totalPages', () => {
        it('should return totalPages of 0 given no results', async () => {
            searchService = new MockSearchService([], []);

            const searchArguments: AwardSearchArgs = {
                searchTerm: '999',
            };

            const response = await searchService.getAwards(searchArguments);

            expect(response.meta.totalPages).toEqual(0);
        });

        it('should return totalPages of 1 given there are results and pageSize is undefined', async () => {
            const searchArguments: AwardSearchArgs = {
                searchTerm: '100',
            };

            const response = await searchService.getAwards(searchArguments);

            expect(response.meta.totalPages).toEqual(1);
        });

        it('should return calculated totalPages given there are results and pageSize is defined', async () => {
            const searchArguments: AwardSearchArgs = {
                searchTerm: '1',
            };
            const searchOptions: AwardSearchOptions = {
                pageSize: 5,
            };

            const response = await searchService.getAwards(searchArguments, searchOptions);

            expect(response.meta.totalPages).toEqual(2);
        });
    });

    it('should sort by task slaDate in ascending order', async () => {
        const searchArguments: AwardSearchArgs = {
            searchTerm: '',
        };

        const response = await searchService.getAwards(searchArguments);

        const searchServiceAwardIds = response.results.map(
            (currentValue: SearchServiceAwardDto) => currentValue.awardReference,
        );

        expect(searchServiceAwardIds).toEqual([
            200, 201, 202, 203, 204, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 1000052, 1000051,
        ]);
    });

    it('should sort by field in ascending order', async () => {
        const searchArguments: AwardSearchArgs = {
            searchTerm: '',
        };

        const response = await searchService.getAwards(searchArguments, {
            sortField: 'funder',
            sortOrder: SortOrderEnum.Asc,
        });

        const searchServiceAwardIds = response.results.map(
            (currentValue: SearchServiceAwardDto) => currentValue.awardReference,
        );

        expect(searchServiceAwardIds).toEqual([
            109, 100, 200, 101, 201, 102, 202, 103, 203, 104, 204, 105, 107, 108, 106, 1000051, 1000052,
        ]);
    });

    it('should sort by receivedDate in ascending order', async () => {
        const searchArguments: AwardSearchArgs = {
            searchTerm: '',
        };

        const response = await searchService.getAwards(searchArguments, {
            sortField: 'receivedDate',
            sortOrder: SortOrderEnum.Asc,
        });

        const searchServiceAwardIds = response.results.map(
            (currentValue: SearchServiceAwardDto) => currentValue.awardReference,
        );

        expect(searchServiceAwardIds).toEqual([
            200, 201, 202, 203, 204, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 1000052, 1000051,
        ]);
    });

    it('should sort by status in ascending order', async () => {
        const searchArguments: AwardSearchArgs = {
            searchTerm: '',
        };

        const response = await searchService.getAwards(searchArguments, {
            sortField: 'status',
            sortOrder: SortOrderEnum.Asc,
        });

        const searchServiceAwardIds = response.results.map(
            (currentValue: SearchServiceAwardDto) => currentValue.awardReference,
        );

        expect(searchServiceAwardIds).toEqual([
            108, 1000051, 1000052, 100, 109, 200, 101, 201, 102, 202, 103, 203, 104, 204, 105, 106, 107,
        ]);
    });

    it('should sort by field in descending order', async () => {
        const searchArguments: AwardSearchArgs = {
            searchTerm: '',
        };

        const response = await searchService.getAwards(searchArguments, {
            sortField: 'funder',
            sortOrder: SortOrderEnum.Desc,
        });

        const searchServiceAwardIds = response.results.map(
            (currentValue: SearchServiceAwardDto) => currentValue.awardReference,
        );
        expect(searchServiceAwardIds).toEqual([
            108, 107, 105, 104, 204, 103, 203, 102, 202, 101, 201, 100, 200, 109, 106, 1000051, 1000052,
        ]);
    });

    describe('filtering', () => {
        it('should filter award by task', async () => {
            const results = [mockAwardsForOpportunity1[mockAwardsForOpportunity1.length - 2]];
            const searchArguments: AwardSearchArgs = {
                searchTerm: '',
                filter: {
                    tasks: ['Transfer'],
                },
            };
            const expectedSearchServiceResults: SearchServiceAwardResults = {
                meta: {
                    countOnPage: 1,
                    page: 1,
                    totalCount: 1,
                    totalPages: 1,
                },
                results,
            };

            const response = await searchService.getAwards(searchArguments);

            expect(response.results).toEqual(expectedSearchServiceResults.results);
        });

        it('should filter award by funders', async () => {
            const results = [mockAwardsForOpportunity1[mockAwardsForOpportunity1.length - 2]];
            const searchArguments: AwardSearchArgs = {
                searchTerm: '',
                filter: {
                    funders: ['UKRI'],
                },
            };
            const expectedSearchServiceResults: SearchServiceAwardResults = {
                meta: {
                    countOnPage: 1,
                    page: 1,
                    totalCount: 1,
                    totalPages: 1,
                },
                results,
            };

            const response = await searchService.getAwards(searchArguments);

            expect(response.results).toEqual(expectedSearchServiceResults.results);
        });

        it('should filter award by assigned', async () => {
            const searchServiceWithAssigned = new MockSearchService(
                [],
                [...mockAwardsForOpportunity1, mockAssigneeAward, ...mockAwardsForOpportunity2],
            );
            const searchArguments: AwardSearchArgs = {
                searchTerm: '',
                filter: {
                    assigned: ['assigned'],
                },
            };
            const expectedSearchServiceResults: SearchServiceAwardResults = {
                meta: {
                    countOnPage: 1,
                    page: 1,
                    totalCount: 1,
                    totalPages: 1,
                },
                results: [mockAssigneeAward],
            };

            const response = await searchServiceWithAssigned.getAwards(searchArguments);

            expect(response).toEqual(expectedSearchServiceResults);
        });

        it('should filter award by unassigned', async () => {
            const searchServiceWithAssigned = new MockSearchService(
                [],
                [...mockAwardsForOpportunity1, mockAssigneeAward, ...mockAwardsForOpportunity2],
            );
            const searchArguments: AwardSearchArgs = {
                searchTerm: '',
                filter: {
                    assigned: ['unassigned'],
                },
            };
            const response = await searchServiceWithAssigned.getAwards(searchArguments);

            expect(response.meta.totalCount).toEqual(15);
        });

        it('should filter award by value', async () => {
            const searchServiceWithAssigned = new MockSearchService(
                [],
                [...mockAwardsForOpportunity1, mockAssigneeAward, ...mockAwardsForOpportunity2],
            );
            const searchArguments: AwardSearchArgs = {
                searchTerm: '',
                filter: {
                    assigned: [mockAssigneeAward.assignedPersonId as number],
                },
            };
            const expectedSearchServiceResults: SearchServiceAwardResults = {
                meta: {
                    countOnPage: 1,
                    page: 1,
                    totalCount: 1,
                    totalPages: 1,
                },
                results: [mockAssigneeAward],
            };

            const response = await searchServiceWithAssigned.getAwards(searchArguments);

            expect(response).toEqual(expectedSearchServiceResults);
        });

        it('should filter award by statuses', async () => {
            const results = [mockAwardsForOpportunity1[mockAwardsForOpportunity1.length - 3]];
            const searchArguments: AwardSearchArgs = {
                searchTerm: '',
                filter: {
                    statuses: ['Closed'],
                },
            };
            const expectedSearchServiceResults: SearchServiceAwardResults = {
                meta: {
                    countOnPage: 1,
                    page: 1,
                    totalCount: 1,
                    totalPages: 1,
                },
                results,
            };

            const response = await searchService.getAwards(searchArguments);

            expect(response.results).toEqual(expectedSearchServiceResults.results);
        });

        it('should filter out invalid external status if external', async () => {
            const searchArguments: AwardSearchArgs = {
                searchTerm: '',
            };
            const internalResponse = await searchService.getAwards(searchArguments, { external: false });
            expect(internalResponse.meta.totalCount).toEqual(17);

            const externalResponse = await searchService.getAwards(searchArguments, { external: true });
            expect(externalResponse.meta.totalCount).toEqual(14);
        });
    });
});
