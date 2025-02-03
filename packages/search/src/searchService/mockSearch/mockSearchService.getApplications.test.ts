import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { buildMockApplication, buildSearchServiceApplication } from '../../../test/testHelpers';
import { MockApplication, MockSearchService } from './mockSearchService';
import {
    ApplicationSearchArgs,
    ApplicationFieldEnum,
    ReviewStatusEnum,
    SearchOptions,
    SearchService,
    SortOrderEnum,
    ApplicationStatusEnum,
    SearchServiceResultCounts,
    SearchServiceApplication,
    SearchServiceApplicationResults,
} from '../searchService';
import assert from 'node:assert';

describe('mock search service - getApplications', () => {
    const buildMockApplications = (opportunityId: number, opportunityApplicationWorkflowComponentId: number) => {
        return (id: number) =>
            buildMockApplication({
                id: id + 1,
                displayId: `APP${id + 1}`,
                name: `Mock application ${id + 1}`,
                opportunityId,
                opportunityApplicationWorkflowComponentId,
            });
    };

    const buildSearchServiceApplicationsWithOpportunityId = (
        opportunityId: number,
        opportunityApplicationWorkflowComponentId: number,
    ) => {
        return (id: number) =>
            buildSearchServiceApplication({
                id: id + 1,
                displayId: `APP${id + 1}`,
                name: `Mock application ${id + 1}`,
                opportunityId,
                opportunityApplicationWorkflowComponentId,
            });
    };

    const mockApplicationsForOpportunity1: MockApplication[] = Array.from(Array(10).keys()).map(
        buildMockApplications(1, 2),
    );
    const mockApplicationsForOpportunity2: MockApplication[] = Array.from(Array(5).keys()).map(
        buildMockApplications(2, 3),
    );
    const mockApplicationForOpportunity3: MockApplication = buildMockApplication({
        id: 51,
        displayId: `APP50`,
        name: `Mock application about AI`,
        opportunityId: 3,
    });

    let searchService: SearchService;

    beforeEach(() => {
        searchService = new MockSearchService(
            [...mockApplicationsForOpportunity1, ...mockApplicationsForOpportunity2, mockApplicationForOpportunity3],
            [],
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return mapped mock applications with pagination meta', async () => {
        const buildSearchServiceApplications = (id: number) =>
            buildSearchServiceApplication({
                id: id + 1,
                displayId: `APP${id + 1}`,
                name: `Mock application ${id + 1}`,
                opportunityId: 1,
            });
        const expectedSearchServiceApplications: SearchServiceApplication[] = Array.from(Array(10).keys()).map(
            buildSearchServiceApplications,
        );

        const searchArguments: ApplicationSearchArgs = {
            applicationWorkflowComponentId: 2,
            opportunityId: 1,
        };
        const expectedSearchServiceResults: SearchServiceApplicationResults = {
            meta: {
                countOnPage: 10,
                page: 1,
                totalCount: 10,
                totalPages: 1,
            },
            results: expectedSearchServiceApplications,
        };

        const response = await searchService.getApplications(searchArguments);

        expect(response).toEqual(expectedSearchServiceResults);
    });

    describe('searching with search terms', () => {
        const firstApplication = buildSearchServiceApplication({
            id: 1,
            displayId: `APP1`,
            name: `Mock application 1`,
            opportunityId: 1,
        });
        const secondApplication = buildSearchServiceApplication({
            id: 10,
            displayId: `APP10`,
            name: `Mock application 10`,
            opportunityId: 1,
        });

        it('should return mappedMockApplications given queried by name', async () => {
            const expectedSearchServiceApplications = [firstApplication, secondApplication];
            const searchArguments: ApplicationSearchArgs = {
                applicationWorkflowComponentId: 2,
                opportunityId: 1,
                searchTerm: 'application 1',
            };
            const expectedSearchServiceResults: SearchServiceApplicationResults = {
                meta: {
                    countOnPage: 2,
                    page: 1,
                    totalCount: 2,
                    totalPages: 1,
                },
                results: expectedSearchServiceApplications,
            };

            const response = await searchService.getApplications(searchArguments);

            expect(response).toEqual(expectedSearchServiceResults);
        });

        it('should return mappedMockApplication given queried by displayId', async () => {
            const expectedSearchServiceApplications = [firstApplication];
            const searchArguments: ApplicationSearchArgs = {
                applicationWorkflowComponentId: 2,
                opportunityId: 1,
                searchTerm: 'APP1',
            };
            const expectedSearchServiceResults: SearchServiceApplicationResults = {
                meta: {
                    countOnPage: 1,
                    page: 1,
                    totalCount: 1,
                    totalPages: 1,
                },
                results: expectedSearchServiceApplications,
            };

            const response = await searchService.getApplications(searchArguments);

            expect(response).toEqual(expectedSearchServiceResults);
        });

        it('should return mappedMockApplication given queried by id', async () => {
            const expectedSearchServiceApplications = [
                buildSearchServiceApplication({
                    id: 51,
                    displayId: `APP50`,
                    name: `Mock application about AI`,
                    opportunityId: 3,
                }),
            ];
            const searchArguments: ApplicationSearchArgs = {
                applicationWorkflowComponentId: 2,
                opportunityId: 3,
                searchTerm: '51',
            };
            const expectedSearchServiceResults: SearchServiceApplicationResults = {
                meta: {
                    countOnPage: 1,
                    page: 1,
                    totalCount: 1,
                    totalPages: 1,
                },
                results: expectedSearchServiceApplications,
            };

            const response = await searchService.getApplications(searchArguments);

            expect(response).toEqual(expectedSearchServiceResults);
        });
    });

    it('should paginate mock applications', async () => {
        const expectedSearchServiceApplications: SearchServiceApplication[] = [5, 6, 7, 8, 9].map(
            buildSearchServiceApplicationsWithOpportunityId(1, 2),
        );
        const searchArguments: ApplicationSearchArgs = {
            applicationWorkflowComponentId: 2,
            opportunityId: 1,
        };
        const searchOptions: SearchOptions = {
            pageSize: 5,
            page: 2,
        };
        const expectedSearchServiceResults: SearchServiceApplicationResults = {
            meta: {
                countOnPage: 5,
                page: 2,
                totalCount: 10,
                totalPages: 2,
                pageSize: 5,
            },
            results: expectedSearchServiceApplications,
        };

        const response = await searchService.getApplications(searchArguments, searchOptions);

        expect(response).toEqual(expectedSearchServiceResults);
    });

    it('should return result counts', async () => {
        searchService = new MockSearchService(
            [
                buildMockApplication({ reviewStatus: ReviewStatusEnum.ExpertReviewComplete }),
                buildMockApplication({ reviewStatus: ReviewStatusEnum.ExpertReviewComplete }),
                buildMockApplication({ reviewStatus: ReviewStatusEnum.FailedReview }),
                buildMockApplication({ reviewStatus: 'Invalid Review Status' as ReviewStatusEnum }),
            ],
            [],
        );

        const searchArguments: ApplicationSearchArgs = {
            applicationWorkflowComponentId: 2,
            opportunityId: 1,
            filterCountFields: [ApplicationFieldEnum.ReviewStatus, ApplicationFieldEnum.ResponseStatus],
        };
        const expectedSearchServiceResultCounts: SearchServiceResultCounts = {
            reviewStatuses: [
                { title: ReviewStatusEnum.ExpertReviewComplete, count: 2 },
                { title: ReviewStatusEnum.FailedReview, count: 1 },
            ],
        };

        const response = await searchService.getApplications(searchArguments);
        assert('resultCounts' in response);
        expect(response.resultCounts).toEqual(expectedSearchServiceResultCounts);
    });

    describe('totalPages', () => {
        it('should return totalPages of 0 given no results', async () => {
            searchService = new MockSearchService([], []);

            const searchArguments: ApplicationSearchArgs = {
                applicationWorkflowComponentId: 2,
                opportunityId: 1,
            };

            const response = await searchService.getApplications(searchArguments);

            expect(response.meta.totalPages).toEqual(0);
        });

        it('should return totalPages of 1 given there are results and pageSize is undefined', async () => {
            const searchArguments: ApplicationSearchArgs = {
                applicationWorkflowComponentId: 2,
                opportunityId: 1,
            };

            const response = await searchService.getApplications(searchArguments);

            expect(response.meta.totalPages).toEqual(1);
        });

        it('should return calculated totalPages given there are results and pageSize is defined', async () => {
            const searchArguments: ApplicationSearchArgs = {
                applicationWorkflowComponentId: 2,
                opportunityId: 1,
            };
            const searchOptions: SearchOptions = {
                pageSize: 5,
            };

            const response = await searchService.getApplications(searchArguments, searchOptions);

            expect(response.meta.totalPages).toEqual(2);
        });
    });

    describe('sorting', () => {
        const mockApplication1 = buildMockApplication({
            id: 1,
            displayId: 'APP1',
            name: 'Application 1',
            reviewStatusPriority: 9,
            responseStatusPriority: 5,
            reviewStats: {
                pendingCount: 1,
                toCheckCount: 2,
                usableCount: 0,
            },
            invitationStats: {
                declinedCount: 0,
                noResponseCount: 11,
            },
        });
        const mockApplication2 = buildMockApplication({
            id: 2,
            displayId: 'APP2',
            name: 'Application 2',
            reviewStatusPriority: 5,
            responseStatusPriority: 4,
            reviewStats: {
                pendingCount: 5,
                toCheckCount: 0,
                usableCount: 8,
            },
            invitationStats: {
                declinedCount: 19,
                noResponseCount: 8,
            },
        });
        const mockApplication3 = buildMockApplication({
            id: 3,
            displayId: 'APP2',
            name: 'Application 2',
            reviewStatusPriority: 7,
            responseStatusPriority: 3,
            reviewStats: {
                pendingCount: 1,
                toCheckCount: 5,
                usableCount: 0,
            },
            invitationStats: {
                declinedCount: 4,
                noResponseCount: 5,
            },
        });
        const mockApplication4 = buildMockApplication({
            id: 4,
            displayId: 'APP4',
            name: 'Application 4',
            reviewStatusPriority: 2,
            responseStatusPriority: 2,
            reviewStats: {
                pendingCount: 11,
                toCheckCount: 0,
                usableCount: 5,
            },
            invitationStats: {
                declinedCount: 23,
                noResponseCount: 7,
            },
        });
        const mockApplication5 = buildMockApplication({
            id: 5,
            displayId: 'APP5',
            name: 'Application 5',
            reviewStatusPriority: 1,
            responseStatusPriority: 1,
            reviewStats: {
                pendingCount: 20,
                toCheckCount: 12,
                usableCount: 51,
            },
            invitationStats: {
                declinedCount: 10,
                noResponseCount: 0,
            },
        });

        beforeEach(() => {
            searchService = new MockSearchService(
                [mockApplication5, mockApplication1, mockApplication3, mockApplication4, mockApplication2],
                [],
            );
        });

        it.each([
            {
                sortField: ApplicationFieldEnum.Id,
                sortOrder: SortOrderEnum.Asc,
                expectedIds: [1, 2, 3, 4, 5],
            },
            {
                sortField: ApplicationFieldEnum.Id,
                sortOrder: SortOrderEnum.Desc,
                expectedIds: [5, 4, 3, 2, 1],
            },
            {
                sortField: ApplicationFieldEnum.DisplayId,
                sortOrder: SortOrderEnum.Asc,
                expectedIds: [1, 3, 2, 4, 5],
            },
            {
                sortField: ApplicationFieldEnum.Name,
                sortOrder: SortOrderEnum.Asc,
                expectedIds: [1, 3, 2, 4, 5],
            },
            {
                sortField: ApplicationFieldEnum.ReviewStatusPriority,
                sortOrder: SortOrderEnum.Asc,
                expectedIds: [5, 4, 2, 3, 1],
            },
            {
                sortField: ApplicationFieldEnum.ResponseStatusPriority,
                sortOrder: SortOrderEnum.Asc,
                expectedIds: [5, 4, 3, 2, 1],
            },
            {
                sortField: ApplicationFieldEnum.PendingCount,
                sortOrder: SortOrderEnum.Asc,
                expectedIds: [1, 3, 2, 4, 5],
            },
            {
                sortField: ApplicationFieldEnum.UsableCount,
                sortOrder: SortOrderEnum.Asc,
                expectedIds: [1, 3, 4, 2, 5],
            },
            {
                sortField: ApplicationFieldEnum.ToCheckCount,
                sortOrder: SortOrderEnum.Asc,
                expectedIds: [4, 2, 1, 3, 5],
            },
            {
                sortField: ApplicationFieldEnum.NoResponseCount,
                sortOrder: SortOrderEnum.Asc,
                expectedIds: [5, 3, 4, 2, 1],
            },
            {
                sortField: ApplicationFieldEnum.DeclinedCount,
                sortOrder: SortOrderEnum.Asc,
                expectedIds: [1, 3, 5, 2, 4],
            },
            {
                sortField: 'Invalid Sort Field',
                sortOrder: SortOrderEnum.Asc,
                expectedIds: [1, 2, 3, 4, 5],
            },
        ])('should sort by $sortField in $sortOrder order', async ({ sortField, sortOrder, expectedIds }) => {
            const searchArguments: ApplicationSearchArgs = {
                applicationWorkflowComponentId: 2,
                opportunityId: 1,
            };
            const searchOptions: SearchOptions = {
                sortField: sortField as ApplicationFieldEnum,
                sortOrder: sortOrder,
            };

            const response = await searchService.getApplications(searchArguments, searchOptions);

            const searchServiceApplicationIds = response.results.reduce(
                (previousValue: number[], currentValue: SearchServiceApplication): number[] => {
                    previousValue.push(currentValue.id);

                    return previousValue;
                },
                [],
            );

            expect(searchServiceApplicationIds).toEqual(expectedIds);
        });
    });

    describe('filtering', () => {
        it('should filter mock applications by application status', async () => {
            const opportunityId = 1;
            const mockApplication1 = buildMockApplication({
                opportunityId,
                id: 1,
                applicationStatus: ApplicationStatusEnum.AwaitingAssessment,
            });
            const mockApplication2 = buildMockApplication({
                opportunityId,
                id: 2,
                applicationStatus: ApplicationStatusEnum.AwaitingAssessment,
            });
            const mockApplication3 = buildMockApplication({
                opportunityId,
                id: 3,
                applicationStatus: ApplicationStatusEnum.Draft,
            });
            const mockApplication4 = buildMockApplication({
                opportunityId,
                id: 4,
                applicationStatus: ApplicationStatusEnum.FailedChecks,
            });
            const mockApplication5 = buildMockApplication({
                opportunityId,
                id: 5,
                applicationStatus: undefined,
            });

            searchService = new MockSearchService(
                [mockApplication1, mockApplication2, mockApplication3, mockApplication4, mockApplication5],
                [],
            );

            const expectedSearchServiceApplicationIds: number[] = [1, 2, 3];
            const searchArguments: ApplicationSearchArgs = {
                applicationWorkflowComponentId: 2,
                opportunityId,
                filter: {
                    applicationStatuses: [ApplicationStatusEnum.AwaitingAssessment, ApplicationStatusEnum.Draft],
                },
            };

            const response = await searchService.getApplications(searchArguments);

            const searchServiceApplicationIds = response.results.reduce(
                (previousValue: number[], currentValue: SearchServiceApplication): number[] => {
                    previousValue.push(currentValue.id);

                    return previousValue;
                },
                [],
            );

            expect(searchServiceApplicationIds).toEqual(expectedSearchServiceApplicationIds);
        });

        it('should filter mock applications by review status', async () => {
            const opportunityId = 1;
            const mockApplication1 = buildMockApplication({
                opportunityId,
                id: 1,
                reviewStatus: ReviewStatusEnum.ExpertReviewComplete,
            });
            const mockApplication2 = buildMockApplication({
                opportunityId,
                id: 2,
                reviewStatus: ReviewStatusEnum.ExpertReviewComplete,
            });
            const mockApplication3 = buildMockApplication({
                opportunityId,
                id: 3,
                reviewStatus: ReviewStatusEnum.InExpertReview,
            });
            const mockApplication4 = buildMockApplication({
                opportunityId,
                id: 4,
                reviewStatus: ReviewStatusEnum.PassedChecks,
            });
            const mockApplication5 = buildMockApplication({
                opportunityId,
                id: 5,
                reviewStatus: undefined,
            });

            searchService = new MockSearchService(
                [mockApplication1, mockApplication2, mockApplication3, mockApplication4, mockApplication5],
                [],
            );

            const expectedSearchServiceApplicationIds: number[] = [1, 2, 3];
            const searchArguments: ApplicationSearchArgs = {
                applicationWorkflowComponentId: 2,
                opportunityId,
                filter: {
                    reviewStatuses: [ReviewStatusEnum.ExpertReviewComplete, ReviewStatusEnum.InExpertReview],
                },
            };

            const response = await searchService.getApplications(searchArguments);

            const searchServiceApplicationIds = response.results.reduce(
                (previousValue: number[], currentValue: SearchServiceApplication): number[] => {
                    previousValue.push(currentValue.id);

                    return previousValue;
                },
                [],
            );

            expect(searchServiceApplicationIds).toEqual(expectedSearchServiceApplicationIds);
        });
    });
});
