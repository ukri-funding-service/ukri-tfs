import { describe, expect, it } from '@jest/globals';
import {
    ApplicationSearchBody,
    ApplicationSearchFilter,
    ApplicationSearchFilterTerm,
    ApplicationSearchFilterTerms,
    applicationsSearchBodyBuilder,
    buildApplicationSearchFilters,
    reduceBucketAggregationIdentifierToApplicationAggs,
} from './opensearchApplicationQueryBuilder';
import { ApplicationStatusEnum, ReviewStatusEnum, ApplicationFieldEnum } from '../searchService';
import { OpensearchAggs } from './openSearchQueryModels';

describe('opensearch query builder', () => {
    describe('applicationsSearchBodyBuilder', () => {
        it('should build the default application search body', () => {
            const expectedApplicationSearchBody: ApplicationSearchBody = {
                from: 0,
                query: { bool: {} },
                size: 10000,
                sort: { id: { order: 'asc' } },
                aggs: {},
            };

            const result = applicationsSearchBodyBuilder({});

            expect(result).toEqual(expectedApplicationSearchBody);
        });

        it('should build a search query for an opportunity with search search term, filters, pagination, sorting and aggs', () => {
            const opportunityId = 4050;
            const opportunityApplicationWorkflowComponentId = 1201;
            const searchTerm = 'search term';
            const applicationStatuses = [
                ApplicationStatusEnum.AwaitingAssessment,
                ApplicationStatusEnum.Draft,
                ApplicationStatusEnum.NotSubmitted,
            ];
            const reviewStatuses = [ReviewStatusEnum.ExpertReviewComplete, ReviewStatusEnum.FailedReview];
            const from = 10;
            const size = 20;
            const sortField = 'sort.field';
            const sortOrder = 'desc';
            const expectedQuery = {
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
                                term: {
                                    opportunityApplicationWorkflowComponentId,
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
                                        match_bool_prefix: {
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
                from,
                size,
                sort: {
                    [sortField]: {
                        order: sortOrder,
                    },
                },
            };

            const opensearchQuery = applicationsSearchBodyBuilder({
                bucketAggregationIdentifiers: [ApplicationFieldEnum.ReviewStatus],
                filters: {
                    applicationStatuses,
                    reviewStatuses,
                    opportunityId,
                    opportunityApplicationWorkflowComponentId,
                },
                pagination: { from, size },
                searchTerm,
                sort: { sortField, sortOrder },
            });

            expect(opensearchQuery).toStrictEqual(expectedQuery);
        });

        it('should build a search query for an opportunity with an integer search term', () => {
            const opportunityId = 4050;
            const searchTerm = '1000003';

            const expectedQuery = {
                aggs: {},
                query: {
                    bool: {
                        filter: [
                            {
                                term: {
                                    opportunityId,
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
                                        match_bool_prefix: {
                                            name: {
                                                query: searchTerm,
                                                operator: 'and',
                                                fuzziness: 'AUTO',
                                            },
                                        },
                                    },
                                    {
                                        term: {
                                            id: {
                                                value: '1000003',
                                            },
                                        },
                                    },
                                ],
                            },
                        },
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

            const opensearchQuery = applicationsSearchBodyBuilder({ filters: { opportunityId }, searchTerm });

            expect(opensearchQuery).toStrictEqual(expectedQuery);
        });
    });

    describe('buildApplicationSearchFilters', () => {
        it('should build default application filters', () => {
            const result = buildApplicationSearchFilters({});

            expect(result).toEqual([]);
        });

        it('should build application filters with applicationStatuses, opportunityId and reviewStatuses', () => {
            const opportunityId = 10001;
            const applicationStatuses = [ApplicationStatusEnum.AwaitingAssessment, ApplicationStatusEnum.Draft];
            const reviewStatuses = [ReviewStatusEnum.ExpertReviewComplete, ReviewStatusEnum.FailedReview];
            const expectedOpportunityFilter: ApplicationSearchFilterTerm = {
                opportunityId: 10001,
            };
            const expectedApplicationStatusFilters: ApplicationSearchFilterTerms = {
                'applicationStatus.keyword': applicationStatuses,
            };
            const expectedReviewStatusStatusFilters: ApplicationSearchFilterTerms = {
                'reviewStatus.keyword': reviewStatuses,
            };
            const expectedApplicationSearchFilter: ApplicationSearchFilter[] = [
                {
                    term: expectedOpportunityFilter,
                },
                {
                    terms: expectedApplicationStatusFilters,
                },
                {
                    terms: expectedReviewStatusStatusFilters,
                },
            ];
            const result = buildApplicationSearchFilters({
                applicationStatuses,
                opportunityId,
                reviewStatuses,
            });

            expect(result).toEqual(expectedApplicationSearchFilter);
        });
    });

    describe('reduceBucketAggregationIdentifierToApplicationAggs', () => {
        it('should reduce BucketAggregationIdentifier to ApplicationAggs', () => {
            const expectedApplicationAggs: OpensearchAggs = {
                reviewStatuses: {
                    terms: {
                        field: 'reviewStatus.keyword',
                        size: 8,
                    },
                },
            };

            const opensearchAggsTypes: ApplicationFieldEnum[] = [
                ApplicationFieldEnum.ReviewStatus,
                'InvalidAggsEnum' as ApplicationFieldEnum,
            ];
            const result = opensearchAggsTypes.reduce(reduceBucketAggregationIdentifierToApplicationAggs, {});

            expect(result).toEqual(expectedApplicationAggs);
        });
    });
});
