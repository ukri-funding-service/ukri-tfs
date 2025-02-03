import {
    ReviewStatusEnum,
    ReviewStatusResultCount,
    SearchServiceApplication,
    SearchServiceApplicationInvitationStats,
    SearchServiceApplicationReviewStats,
} from '../searchService';
import {
    OpensearchApplicationHit,
    OpensearchApplicationHitInvitationStats,
    OpensearchApplicationHitReviewStats,
    OpensearchAggregationBucket,
} from '../searchService/openSearch/opensearchService';

export const mapOpensearchApplicationHitReviewStats = (
    reviewStats: OpensearchApplicationHitReviewStats,
): SearchServiceApplicationReviewStats => {
    return {
        pendingCount: reviewStats.pendingCount,
        toCheckCount: reviewStats.toCheckCount,
        usableCount: reviewStats.usableCount,
    };
};

export const mapOpensearchApplicationHitInvitationStats = (
    invitationStats: OpensearchApplicationHitInvitationStats,
): SearchServiceApplicationInvitationStats => {
    return {
        declinedCount: invitationStats.declinedCount,
        noResponseCount: invitationStats.noResponseCount,
    };
};

export const mapOpensearchApplicationHit = (
    opensearchApplicationHit: OpensearchApplicationHit,
): SearchServiceApplication => {
    return {
        displayId: opensearchApplicationHit.displayId,
        name: opensearchApplicationHit.name,
        id: opensearchApplicationHit.id,
        opportunityId: opensearchApplicationHit.opportunityId,
        opportunityApplicationWorkflowComponentId: opensearchApplicationHit.opportunityApplicationWorkflowComponentId,
        applicationStatus: opensearchApplicationHit.applicationStatus,
        reviewStatus: opensearchApplicationHit.reviewStatus,
        reviewStatusPriority: opensearchApplicationHit.reviewStatusPriority,
        responseStatus: opensearchApplicationHit.responseStatus,
        responseStatusPriority: opensearchApplicationHit.responseStatusPriority,
        reviewStats: mapOpensearchApplicationHitReviewStats(opensearchApplicationHit.reviewStats),
        invitationStats: mapOpensearchApplicationHitInvitationStats(opensearchApplicationHit.invitationStats),
        ...(opensearchApplicationHit.reviewFailedDate && {
            reviewFailedDate: new Date(opensearchApplicationHit.reviewFailedDate),
        }),
    };
};

export const mapOpensearchAggregationBucketKeyToReviewStatusEnum = (
    bucketKey: string,
): ReviewStatusEnum | undefined => {
    switch (bucketKey) {
        case 'Passed Checks':
            return ReviewStatusEnum.PassedChecks;
        case 'In Expert Review':
            return ReviewStatusEnum.InExpertReview;
        case 'Sent For Response':
            return ReviewStatusEnum.SentForResponse;
        case 'Expert Review Complete':
            return ReviewStatusEnum.ExpertReviewComplete;
        case 'Failed Review':
            return ReviewStatusEnum.FailedReview;
        case 'Successful':
            return ReviewStatusEnum.Successful;
        case 'Unsuccessful':
            return ReviewStatusEnum.Unsuccessful;
        case 'Pending Checks':
            return ReviewStatusEnum.PendingChecks;
        default:
            return undefined;
    }
};

export const reduceOpensearchAggregationBucket = (
    reviewStatusResultCounts: ReviewStatusResultCount[],
    reviewStatusAggregationBucket: OpensearchAggregationBucket,
): ReviewStatusResultCount[] => {
    const reviewStatusEnum = mapOpensearchAggregationBucketKeyToReviewStatusEnum(reviewStatusAggregationBucket.key);

    if (reviewStatusEnum) {
        const reviewStatusResultCount: ReviewStatusResultCount = {
            count: reviewStatusAggregationBucket.doc_count,
            title: reviewStatusEnum,
        };

        reviewStatusResultCounts.push(reviewStatusResultCount);
    }

    return reviewStatusResultCounts;
};
