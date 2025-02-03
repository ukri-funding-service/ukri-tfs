import { describe, expect, it } from '@jest/globals';
import { buildOpensearchApplicationResponseHit, buildSearchServiceApplication } from '../../test/testHelpers';
import {
    mapOpensearchApplicationHitInvitationStats,
    mapOpensearchApplicationHitReviewStats,
    mapOpensearchApplicationHit,
    mapOpensearchAggregationBucketKeyToReviewStatusEnum,
    reduceOpensearchAggregationBucket,
} from '../mappers/opensearchServiceMappers';
import {
    ReviewStatusEnum,
    ReviewStatusResultCount,
    SearchServiceApplicationInvitationStats,
    SearchServiceApplicationReviewStats,
} from '../searchService';
import {
    OpensearchApplicationHitInvitationStats,
    OpensearchApplicationHitReviewStats,
    OpensearchAggregationBucket,
} from '../searchService/openSearch/opensearchService';

describe('opensearchServiceMappers', () => {
    describe('mapOpensearchApplicationHit', () => {
        it('should map OpensearchResponseHit to SearchServiceApplication', () => {
            const opensearchResponseHit = buildOpensearchApplicationResponseHit({
                displayId: 'APP001',
                id: 1,
                name: 'Test Name',
                opportunityId: 1301,
                opportunityApplicationWorkflowComponentId: 1201,
            });
            const expectedSearchServiceApplication = buildSearchServiceApplication({
                displayId: 'APP001',
                id: 1,
                name: 'Test Name',
                opportunityId: 1301,
                opportunityApplicationWorkflowComponentId: 1201,
            });

            const searchServiceApplication = mapOpensearchApplicationHit(opensearchResponseHit._source);

            expect(searchServiceApplication).toEqual(expectedSearchServiceApplication);
        });

        it('should map optional reviewFailedDate', () => {
            const opensearchResponseHit = buildOpensearchApplicationResponseHit({
                reviewFailedDate: '2024-10-20T12:57:00.350Z',
            });
            const expectedFailedDate = new Date('2024-10-20T12:57:00.350Z');

            const searchServiceApplication = mapOpensearchApplicationHit(opensearchResponseHit._source);

            expect(searchServiceApplication.reviewFailedDate).toEqual(expectedFailedDate);
        });
    });

    describe('mapOpensearchApplicationHitReviewStats', () => {
        it('should Opensearch response hit review stats to search service application review stats', () => {
            const reviewStats: OpensearchApplicationHitReviewStats = {
                pendingCount: 1,
                toCheckCount: 2,
                usableCount: 3,
            };
            const expectedReviewStats: SearchServiceApplicationReviewStats = {
                pendingCount: 1,
                toCheckCount: 2,
                usableCount: 3,
            };

            const result = mapOpensearchApplicationHitReviewStats(reviewStats);

            expect(result).toEqual(expectedReviewStats);
        });
    });

    describe('mapOpensearchApplicationHitInvitationStats', () => {
        it('should map Opensearch response hit invitation stats to search service application invitation stats', () => {
            const invitationStats: OpensearchApplicationHitInvitationStats = {
                declinedCount: 1,
                noResponseCount: 2,
            };
            const expectedInvitationStats: SearchServiceApplicationInvitationStats = {
                declinedCount: 1,
                noResponseCount: 2,
            };

            const result = mapOpensearchApplicationHitInvitationStats(invitationStats);

            expect(result).toEqual(expectedInvitationStats);
        });
    });

    describe('mapOpensearchAggregationBucketKeyToReviewStatusEnum', () => {
        it.each([
            { bucketKey: 'Passed Checks', expectedReviewStatusEnum: ReviewStatusEnum.PassedChecks },
            { bucketKey: 'In Expert Review', expectedReviewStatusEnum: ReviewStatusEnum.InExpertReview },
            { bucketKey: 'Sent For Response', expectedReviewStatusEnum: ReviewStatusEnum.SentForResponse },
            { bucketKey: 'Expert Review Complete', expectedReviewStatusEnum: ReviewStatusEnum.ExpertReviewComplete },
            { bucketKey: 'Failed Review', expectedReviewStatusEnum: ReviewStatusEnum.FailedReview },
            { bucketKey: 'Successful', expectedReviewStatusEnum: ReviewStatusEnum.Successful },
            { bucketKey: 'Unsuccessful', expectedReviewStatusEnum: ReviewStatusEnum.Unsuccessful },
            { bucketKey: 'Pending Checks', expectedReviewStatusEnum: ReviewStatusEnum.PendingChecks },
            { bucketKey: 'Invalid Key', expectedReviewStatusEnum: undefined },
        ])(
            'should map OpensearchAggregationBucket $bucketKey key to $expectedReviewStatusEnum ReviewStatusEnum',
            ({ bucketKey, expectedReviewStatusEnum }) => {
                const result = mapOpensearchAggregationBucketKeyToReviewStatusEnum(bucketKey);

                expect(result).toEqual(expectedReviewStatusEnum);
            },
        );
    });

    describe('reduceOpensearchAggregationBucket', () => {
        const expertReviewCompleteResultCount: ReviewStatusResultCount = {
            count: 2,
            title: ReviewStatusEnum.ExpertReviewComplete,
        };
        const defaultReviewStatusResultCounts: ReviewStatusResultCount[] = [expertReviewCompleteResultCount];

        it('should return array of ReviewStatusResultCounts containing valid mapped bucket', () => {
            const failedReviewResultCount: ReviewStatusResultCount = {
                count: 10,
                title: ReviewStatusEnum.FailedReview,
            };
            const expectedReviewResultCounts = [...defaultReviewStatusResultCounts, failedReviewResultCount];
            const failedReviewBucket: OpensearchAggregationBucket = {
                doc_count: 10,
                key: 'Failed Review',
            };

            const result = reduceOpensearchAggregationBucket(defaultReviewStatusResultCounts, failedReviewBucket);

            expect(result).toEqual(expectedReviewResultCounts);
        });

        it('should return array of ReviewStatusResultCounts excluding invalid bucket', () => {
            const invalidBucket: OpensearchAggregationBucket = {
                doc_count: 0,
                key: 'Invalid Key',
            };

            const result = reduceOpensearchAggregationBucket(defaultReviewStatusResultCounts, invalidBucket);

            expect(result).toEqual(defaultReviewStatusResultCounts);
        });
    });
});
