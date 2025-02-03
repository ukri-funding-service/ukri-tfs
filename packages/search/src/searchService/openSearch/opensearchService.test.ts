import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
    buildMockRestClient,
    buildOpensearchApplicationResponseHit,
    buildSearchServiceApplication,
    buildSearchServiceAwardDto,
    getMockLogger,
} from '../../../test/testHelpers';
import * as applicationQueryBuildersStub from './opensearchApplicationQueryBuilder';
import * as internalAwardQueryBuildersStub from './opensearchInternalAwardQueryBuilder';
import * as externalAwardQueryBuildersStub from './opensearchExternalAwardQueryBuilder';

import * as searchServiceHelpers from '../searchServiceHelpers';
import { ApplicationSearchBody } from './opensearchApplicationQueryBuilder';
import {
    OpensearchClusterHealthResponse,
    OpensearchApplicationResponse,
    OpensearchApplicationResponseHit,
    OpensearchService,
    OpensearchAwardResponse,
    OpensearchCountResponse,
} from './opensearchService';
import {
    ApplicationFieldEnum,
    ApplicationSearchArgs,
    ApplicationSearchFilterArgs,
    ApplicationStatusEnum,
    ReviewStatusEnum,
    SearchOptions,
    SearchService,
    SearchServiceApplication,
    SearchServiceApplicationResults,
    SearchServiceAwardResults,
    SearchServiceImpl,
    SearchServiceStateEnum,
    SortOrderEnum,
} from '../searchService';
import { AwardSearchBody } from './opensearchAwardQueryBuilderBase';

describe('opensearch service', () => {
    const tfsUser = 'tfs-user';
    let searchService: SearchService;

    const mockRestClient = buildMockRestClient();
    const mockLogger = getMockLogger();

    const mockGetMethod = mockRestClient.getMethodMock;
    const tfsRestClient = mockRestClient.tfsRestClient;

    beforeEach(() => {
        searchService = new OpensearchService(tfsUser, tfsRestClient, mockLogger);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should construct and return correct state', () => {
        expect(searchService).toBeInstanceOf(SearchServiceImpl);
        expect(searchService.state).toEqual(SearchServiceStateEnum.OpensearchService);
    });

    describe('getApplications', () => {
        const searchArguments: ApplicationSearchArgs = {
            opportunityId: 1,
            applicationWorkflowComponentId: 2,
        };

        it('should return mapped search results and meta data using default search options', async () => {
            const buildOpensearchResponseHits = (id: number) =>
                buildOpensearchApplicationResponseHit({
                    id,
                    displayId: `APP${id}`,
                    name: `OpenSearch response hit ${id}`,
                });
            const opensearchResponseHits: OpensearchApplicationResponseHit[] = Array.from(Array(10).keys()).map(
                buildOpensearchResponseHits,
            );
            const opensearchResponseMock: OpensearchApplicationResponse = {
                hits: {
                    total: { value: 20 },
                    hits: opensearchResponseHits,
                },
                aggregations: {
                    reviewStatuses: {
                        buckets: [
                            {
                                doc_count: 10,
                                key: 'Passed Checks',
                            },
                        ],
                    },
                },
            };

            mockGetMethod.mockResolvedValue(opensearchResponseMock);

            const applicationQuery: ApplicationSearchBody = {
                aggs: {
                    reviewStatuses: {
                        terms: {
                            field: 'reviewStatus.keyword',
                            size: 8,
                        },
                    },
                },
                query: {
                    bool: {
                        filter: [
                            {
                                term: {
                                    opportunityId: 1,
                                },
                            },
                        ],
                    },
                },
                from: 0,
                size: 10000,
                sort: {
                    id: {
                        order: 'asc',
                    },
                },
            };
            const queryBuilderSpy = jest
                .spyOn(applicationQueryBuildersStub, 'applicationsSearchBodyBuilder')
                .mockReturnValueOnce(applicationQuery);
            const buildSearchServiceApplications = (id: number) =>
                buildSearchServiceApplication({
                    id,
                    displayId: `APP${id}`,
                    opportunityApplicationWorkflowComponentId: 2,
                    name: `OpenSearch response hit ${id}`,
                });
            const expectedSearchServiceApplications: SearchServiceApplication[] = Array.from(Array(10).keys()).map(
                buildSearchServiceApplications,
            );
            const expectedQueryString = new URLSearchParams({
                source_content_type: 'application/json',
                source: JSON.stringify(applicationQuery),
            }).toString();
            const expectedSearchServiceResults: SearchServiceApplicationResults = {
                meta: {
                    countOnPage: 10,
                    page: 1,
                    pageSize: undefined,
                    totalCount: 20,
                    totalPages: 1,
                },
                results: expectedSearchServiceApplications,
                resultCounts: {
                    reviewStatuses: [{ count: 10, title: ReviewStatusEnum.PassedChecks }],
                },
            };

            const response = await searchService.getApplications(searchArguments);

            expect(queryBuilderSpy).toHaveBeenCalledWith({
                filters: {
                    applicationStatuses: undefined,
                    opportunityId: 1,
                    opportunityApplicationWorkflowComponentId: 2,
                    reviewStatuses: undefined,
                },
                pagination: { from: 0, size: 10000 },
                searchTerm: undefined,
                sort: { sortField: 'id', sortOrder: 'asc' },
                bucketAggregationIdentifiers: undefined,
            });
            expect(tfsRestClient.get).toHaveBeenCalledWith('tfs-user', `/application/_search?${expectedQueryString}`);
            expect(response).toEqual(expectedSearchServiceResults);
        });

        it('should search using optional sort options and search args', async () => {
            const opportunityId = 1;
            const searchOptions: SearchOptions = {
                pageSize: 10,
                page: 2,
                sortField: ApplicationFieldEnum.DisplayId,
                sortOrder: SortOrderEnum.Desc,
            };
            const searchTerm = 'Application';
            const applicationStatuses = [ApplicationStatusEnum.AwaitingAssessment, ApplicationStatusEnum.Draft];
            const reviewStatuses = [ReviewStatusEnum.ExpertReviewComplete, ReviewStatusEnum.FailedReview];
            const filter: ApplicationSearchFilterArgs = {
                reviewStatuses: [ReviewStatusEnum.ExpertReviewComplete, ReviewStatusEnum.FailedReview],
                applicationStatuses: [ApplicationStatusEnum.AwaitingAssessment, ApplicationStatusEnum.Draft],
            };
            const filterCountFields: ApplicationFieldEnum[] = [ApplicationFieldEnum.ReviewStatus];
            const opensearchResponseHitMock = (id: number) =>
                buildOpensearchApplicationResponseHit({
                    id,
                    displayId: `APP${id}`,
                    name: `OpenSearch response hit ${id}`,
                });
            const opensearchResponseHits: OpensearchApplicationResponseHit[] = Array.from(Array(10).keys()).map(
                opensearchResponseHitMock,
            );
            const opensearchResponseMock: OpensearchApplicationResponse = {
                hits: {
                    total: { value: 20 },
                    hits: opensearchResponseHits,
                },
            };

            mockGetMethod.mockResolvedValue(opensearchResponseMock);

            const applicationQuery: ApplicationSearchBody = {
                aggs: {
                    reviewStatuses: {
                        terms: {
                            field: 'reviewStatus.keyword',
                            size: 8,
                        },
                    },
                },
                query: {
                    bool: {
                        filter: [
                            {
                                term: {
                                    opportunityId,
                                },
                            },
                            {
                                terms: {
                                    'applicationStatus.keyword': applicationStatuses,
                                },
                            },
                            {
                                terms: {
                                    'reviewStatus.keyword': reviewStatuses,
                                },
                            },
                        ],
                        must: {
                            bool: {
                                should: [
                                    {
                                        match: {
                                            name: {
                                                query: searchTerm,
                                                operator: 'and',
                                                fuzziness: 'AUTO',
                                            },
                                        },
                                    },
                                    {
                                        term: {
                                            displayId: {
                                                value: searchTerm,
                                                case_insensitive: true,
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
                from: 9,
                size: 10,
                sort: {
                    displayId: {
                        order: 'desc',
                    },
                },
            };
            const queryBuilderSpy = jest
                .spyOn(applicationQueryBuildersStub, 'applicationsSearchBodyBuilder')
                .mockReturnValueOnce(applicationQuery);
            const buildSearchServiceApplications = (id: number) =>
                buildSearchServiceApplication({
                    id,
                    displayId: `APP${id}`,
                    opportunityApplicationWorkflowComponentId: 2,
                    name: `OpenSearch response hit ${id}`,
                });
            const expectedSearchServiceApplications: SearchServiceApplication[] = Array.from(Array(10).keys()).map(
                buildSearchServiceApplications,
            );
            const expectedQueryString = new URLSearchParams({
                source_content_type: 'application/json',
                source: JSON.stringify(applicationQuery),
            }).toString();
            const expectedSearchServiceResults: SearchServiceApplicationResults = {
                meta: {
                    countOnPage: 10,
                    page: 2,
                    totalCount: 20,
                    totalPages: 2,
                    pageSize: 10,
                },
                results: expectedSearchServiceApplications,
            };

            const response = await searchService.getApplications(
                { ...searchArguments, searchTerm, filter, filterCountFields },
                searchOptions,
            );

            expect(queryBuilderSpy).toHaveBeenCalledWith({
                filters: {
                    applicationStatuses,
                    opportunityId: 1,
                    opportunityApplicationWorkflowComponentId: 2,
                    reviewStatuses,
                },
                pagination: { from: 10, size: 10 },
                searchTerm: 'Application',
                sort: { sortField: 'displayId.keyword', sortOrder: 'desc' },
                bucketAggregationIdentifiers: [ApplicationFieldEnum.ReviewStatus],
            });
            expect(tfsRestClient.get).toHaveBeenCalledWith('tfs-user', `/application/_search?${expectedQueryString}`);
            expect(response).toEqual(expectedSearchServiceResults);
        });

        it.each([
            { pageSize: 10, hitsTotal: 0, expectedTotalPages: 0 },
            { pageSize: 1, hitsTotal: 10, expectedTotalPages: 10 },
            { pageSize: 2, hitsTotal: 10, expectedTotalPages: 5 },
            { pageSize: 3, hitsTotal: 10, expectedTotalPages: 4 },
            { pageSize: 4, hitsTotal: 10, expectedTotalPages: 3 },
            { pageSize: 5, hitsTotal: 10, expectedTotalPages: 2 },
            { pageSize: 6, hitsTotal: 10, expectedTotalPages: 2 },
            { pageSize: 7, hitsTotal: 10, expectedTotalPages: 2 },
            { pageSize: 8, hitsTotal: 10, expectedTotalPages: 2 },
            { pageSize: 9, hitsTotal: 10, expectedTotalPages: 2 },
            { pageSize: 10, hitsTotal: 10, expectedTotalPages: 1 },
        ])(
            'should return correct meta expectedTotalPages for optional pageSize of $pageSize and hitsTotal of $hitsTotal',
            async ({ pageSize, hitsTotal, expectedTotalPages }) => {
                const searchOptions: SearchOptions = {
                    pageSize: pageSize,
                };
                const opensearchResponseMock: OpensearchApplicationResponse = {
                    hits: {
                        total: { value: hitsTotal },
                        hits: [],
                    },
                };

                mockGetMethod.mockResolvedValue(opensearchResponseMock);

                const applicationQuery: ApplicationSearchBody = {
                    aggs: {
                        reviewStatuses: {
                            terms: {
                                field: 'reviewStatus.keyword',
                                size: 8,
                            },
                        },
                    },
                    query: {
                        bool: {
                            filter: [
                                {
                                    term: {
                                        opportunityId: 1,
                                    },
                                },
                            ],
                        },
                    },
                    from: 0,
                    size: pageSize,
                    sort: {
                        id: {
                            order: 'asc',
                        },
                    },
                };
                const queryBuilderSpy = jest
                    .spyOn(applicationQueryBuildersStub, 'applicationsSearchBodyBuilder')
                    .mockReturnValueOnce(applicationQuery);
                const expectedQueryString = new URLSearchParams({
                    source_content_type: 'application/json',
                    source: JSON.stringify(applicationQuery),
                }).toString();
                const response = await searchService.getApplications(searchArguments, searchOptions);

                expect(queryBuilderSpy).toHaveBeenCalledWith({
                    filters: {
                        applicationStatuses: undefined,
                        opportunityId: 1,
                        opportunityApplicationWorkflowComponentId: 2,
                        reviewStatuses: undefined,
                    },
                    pagination: { from: 0, size: pageSize },
                    searchTerm: undefined,
                    sort: { sortField: 'id', sortOrder: 'asc' },
                    bucketAggregationIdentifiers: undefined,
                });
                expect(tfsRestClient.get).toHaveBeenCalledWith(
                    'tfs-user',
                    `/application/_search?${expectedQueryString}`,
                );
                expect(response.meta.totalPages).toEqual(expectedTotalPages);
            },
        );

        it.each([
            { sortOrder: SortOrderEnum.Asc, expectedSortOrder: 'asc' },
            { sortOrder: SortOrderEnum.Desc, expectedSortOrder: 'desc' },
            { sortOrder: 'Invalid SortOrder', expectedSortOrder: 'asc' },
        ])('should map SortOrder $sortOrder to $expectedSortOrder', async ({ sortOrder, expectedSortOrder }) => {
            const searchOptions: SearchOptions = {
                sortOrder: sortOrder as SortOrderEnum,
            };
            const opensearchResponseMock: OpensearchApplicationResponse = {
                hits: {
                    total: { value: 20 },
                    hits: [],
                },
            };
            mockGetMethod.mockResolvedValue(opensearchResponseMock);

            const queryBuilderSpy = jest
                .spyOn(applicationQueryBuildersStub, 'applicationsSearchBodyBuilder')
                .mockReturnValueOnce({} as ApplicationSearchBody);

            await searchService.getApplications(searchArguments, searchOptions);

            expect(queryBuilderSpy).toHaveBeenCalledWith({
                filters: {
                    applicationStatuses: undefined,
                    opportunityId: 1,
                    opportunityApplicationWorkflowComponentId: 2,
                    reviewStatuses: undefined,
                },
                pagination: { from: 0, size: 10000 },
                searchTerm: undefined,
                sort: { sortField: 'id', sortOrder: expectedSortOrder },
                bucketAggregationIdentifiers: undefined,
            });
        });

        it.each([
            { sortField: ApplicationFieldEnum.Id, expectedSortField: 'id' },
            { sortField: ApplicationFieldEnum.DisplayId, expectedSortField: 'displayId.keyword' },
            { sortField: ApplicationFieldEnum.Name, expectedSortField: 'name' },
            { sortField: ApplicationFieldEnum.ReviewStatus, expectedSortField: 'reviewStatus.keyword' },
            { sortField: ApplicationFieldEnum.ReviewStatusPriority, expectedSortField: 'reviewStatusPriority' },
            { sortField: ApplicationFieldEnum.ResponseStatus, expectedSortField: 'responseStatus.keyword' },
            {
                sortField: ApplicationFieldEnum.ResponseStatusPriority,
                expectedSortField: 'responseStatusPriority',
            },
            {
                sortField: ApplicationFieldEnum.PendingCount,
                expectedSortField: 'reviewStats.pendingCount',
            },
            {
                sortField: ApplicationFieldEnum.UsableCount,
                expectedSortField: 'reviewStats.usableCount',
            },
            {
                sortField: ApplicationFieldEnum.ToCheckCount,
                expectedSortField: 'reviewStats.toCheckCount',
            },
            {
                sortField: ApplicationFieldEnum.NoResponseCount,
                expectedSortField: 'invitationStats.noResponseCount',
            },
            {
                sortField: ApplicationFieldEnum.DeclinedCount,
                expectedSortField: 'invitationStats.declinedCount',
            },
            { sortField: 'Invalid SortField', expectedSortField: 'id' },
        ])('should map SortField $sortField to $expectedSortField', async ({ sortField, expectedSortField }) => {
            const searchOptions: SearchOptions = {
                sortField: sortField as ApplicationFieldEnum,
            };
            const opensearchResponseMock: OpensearchApplicationResponse = {
                hits: {
                    total: { value: 20 },
                    hits: [],
                },
            };
            mockGetMethod.mockResolvedValue(opensearchResponseMock);

            const queryBuilderSpy = jest
                .spyOn(applicationQueryBuildersStub, 'applicationsSearchBodyBuilder')
                .mockReturnValueOnce({} as ApplicationSearchBody);

            await searchService.getApplications(searchArguments, searchOptions);

            expect(queryBuilderSpy).toHaveBeenCalledWith({
                filters: {
                    applicationStatuses: undefined,
                    opportunityId: 1,
                    opportunityApplicationWorkflowComponentId: 2,
                    reviewStatuses: undefined,
                },
                pagination: { from: 0, size: 10000 },
                searchTerm: undefined,
                sort: { sortField: expectedSortField, sortOrder: 'asc' },
                bucketAggregationIdentifiers: undefined,
            });
        });
    });

    describe('getAwards', () => {
        const queryBuilderSpy = jest.spyOn(internalAwardQueryBuildersStub, 'internalAwardsSearchBodyBuilder');
        const externalQueryBuilderSpy = jest.spyOn(externalAwardQueryBuildersStub, 'externalAwardsSearchBodyBuilder');
        const calculatePaginationFromSpy = jest.spyOn(searchServiceHelpers, 'calculatePaginationFrom');
        const searchServiceAward = buildSearchServiceAwardDto({});
        const searchServiceAwardDto = buildSearchServiceAwardDto({});
        const opensearchResponseMock: OpensearchAwardResponse = {
            hits: {
                total: { value: 1 },
                hits: [{ _source: searchServiceAward }],
            },
        };
        beforeEach(() => {
            queryBuilderSpy.mockReturnValueOnce({} as AwardSearchBody);
            externalQueryBuilderSpy.mockReturnValueOnce({} as AwardSearchBody);
            calculatePaginationFromSpy.mockReturnValueOnce(0);
            mockGetMethod.mockResolvedValue(opensearchResponseMock);
        });

        afterEach(() => {
            queryBuilderSpy.mockReset();
            externalQueryBuilderSpy.mockReset();
            calculatePaginationFromSpy.mockReset();
        });

        it('should return results using default search options', async () => {
            const expectedSearchServiceResults: SearchServiceAwardResults = {
                meta: {
                    countOnPage: 1,
                    page: 1,
                    pageSize: undefined,
                    totalCount: 1,
                    totalPages: 1,
                },
                results: [searchServiceAwardDto],
            };

            const response = await searchService.getAwards({ searchTerm: 'award' });

            expect(response).toEqual(expectedSearchServiceResults);

            expect(queryBuilderSpy).toHaveBeenCalledWith({
                pagination: { from: 0, size: 10000 },
                searchTerm: 'award',
                external: false,
            });

            expect(tfsRestClient.get).toHaveBeenCalledWith(
                'tfs-user',
                `/award/_search?source_content_type=application%2Fjson&source=%7B%7D`,
            );
            expect(calculatePaginationFromSpy).not.toHaveBeenCalled();
        });

        it('should persist external mode', async () => {
            await searchService.getAwards(
                { searchTerm: 'award' },
                { external: true, sortField: 'task', sortOrder: 'asc' },
            );
            expect(externalQueryBuilderSpy).toHaveBeenCalledWith({
                pagination: { from: 0, size: 10000 },
                searchTerm: 'award',
                external: true,
                sort: {
                    sortField: 'task',
                    sortOrder: 'asc',
                },
            });
        });

        it('should return results using provided search options', async () => {
            const expectedSearchServiceResults: SearchServiceAwardResults = {
                meta: {
                    countOnPage: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    totalPages: 1,
                },
                results: [searchServiceAwardDto],
            };

            const response = await searchService.getAwards(
                { searchTerm: 'award' },
                { sortField: 'task', sortOrder: 'desc', page: 1, pageSize: 10 },
            );

            expect(response).toEqual(expectedSearchServiceResults);

            expect(queryBuilderSpy).toHaveBeenCalledWith({
                pagination: { from: 0, size: 10 },
                searchTerm: 'award',
                sort: { sortField: 'task', sortOrder: 'desc' },
                external: false,
            });
            expect(tfsRestClient.get).toHaveBeenCalledWith(
                'tfs-user',
                `/award/_search?source_content_type=application%2Fjson&source=%7B%7D`,
            );
            expect(calculatePaginationFromSpy).toHaveBeenCalledWith(1, 10);
        });
        it('should return results using provided search options with filters', async () => {
            const expectedSearchServiceResults: SearchServiceAwardResults = {
                meta: {
                    countOnPage: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    totalPages: 1,
                },
                results: [searchServiceAwardDto],
            };

            const response = await searchService.getAwards(
                { filter: { tasks: ['Approval'], funders: ['AHRC'], statuses: ['Closed'] } },
                { sortField: 'task', sortOrder: 'desc', page: 1, pageSize: 10 },
            );

            expect(response).toEqual(expectedSearchServiceResults);

            expect(queryBuilderSpy).toHaveBeenCalledWith({
                pagination: { from: 0, size: 10 },
                filters: { tasks: ['Approval'], funders: ['AHRC'], statuses: ['Closed'] },
                sort: { sortField: 'task', sortOrder: 'desc' },
                external: false,
            });

            expect(tfsRestClient.get).toHaveBeenCalledWith(
                'tfs-user',
                `/award/_search?source_content_type=application%2Fjson&source=%7B%7D`,
            );
            expect(calculatePaginationFromSpy).toHaveBeenCalledWith(1, 10);
        });
    });

    describe('getAwardsCount', () => {
        const opensearchResponseMock: OpensearchCountResponse = {
            count: 15,
        };
        beforeEach(() => {
            mockGetMethod.mockResolvedValue(opensearchResponseMock);
        });

        afterEach(() => {
            mockGetMethod.mockReset();
        });

        it('should return the count for a given organisation id', async () => {
            const organisationId = 500;
            const result = await searchService.getAwardsCount(organisationId);

            expect(result).toEqual(15);
        });
    });

    describe('verifyHealth', () => {
        it('should verify health of the service given status is green', async () => {
            const expectedResponse: OpensearchClusterHealthResponse = { status: 'green' };
            mockGetMethod.mockResolvedValue(expectedResponse);

            const result = await searchService.verifyHealth();

            expect(tfsRestClient.get).toHaveBeenCalledWith('tfs-user', '/_cluster/health');
            expect(result).toBe(true);
        });

        it('should verify health of the service given status is yellow', async () => {
            const expectedResponse: OpensearchClusterHealthResponse = { status: 'yellow' };
            mockGetMethod.mockResolvedValue(expectedResponse);

            const result = await searchService.verifyHealth();

            expect(result).toBe(true);
        });

        it('should verify health of the service given status is red', async () => {
            const expectedResponse: OpensearchClusterHealthResponse = { status: 'red' };
            mockGetMethod.mockResolvedValue(expectedResponse);

            const result = await searchService.verifyHealth();

            expect(result).toBe(true);
        });

        it('should not verify health of the service given service is unreachable', async () => {
            mockGetMethod.mockRejectedValue(new Error('service unreachable'));

            const result = await searchService.verifyHealth();

            expect(result).toBe(false);
        });

        it('should log given the service is unreachable', async () => {
            mockGetMethod.mockRejectedValue(new Error('service unreachable'));

            await searchService.verifyHealth();

            expect(mockLogger.error).toHaveBeenCalledWith('Opensearch service unreachable: Error: service unreachable');
        });

        it('should log given the service times out', async () => {
            mockGetMethod.mockImplementation(
                async () =>
                    new Promise(resolve => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const timer = setTimeout(() => resolve({} as any), 2000);
                        timer.unref();
                    }),
            );

            await expect(searchService.verifyHealth()).resolves.toEqual(false);
        });
    });
});
