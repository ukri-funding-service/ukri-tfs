import {
    ApplicationStatusEnum,
    ResponseStatusEnum,
    ReviewStatusEnum,
    SearchServiceApplication,
    SearchServiceApplicationInvitationStats,
    SearchServiceApplicationReviewStats,
} from '../searchService';
import {
    MockApplication,
    MockApplicationInvitationStats,
    MockApplicationReviewStats,
} from '../searchService/mockSearch/mockSearchService';

export const mapMockApplicationStatusToApplicationStatusEnum = (
    applicationStatus: string,
): ApplicationStatusEnum | undefined => {
    switch (applicationStatus) {
        case 'Draft':
            return ApplicationStatusEnum.Draft;
        case 'Submitted':
            return ApplicationStatusEnum.Submitted;
        case 'Not submitted':
            return ApplicationStatusEnum.NotSubmitted;
        case 'Sent to research office':
            return ApplicationStatusEnum.SentToResearchOffice;
        case 'Return to applicant':
            return ApplicationStatusEnum.ReturnToApplicant;
        case 'Failed checks':
            return ApplicationStatusEnum.FailedChecks;
        case 'Passed checks':
            return ApplicationStatusEnum.PassedChecks;
        case 'Unsuccessful checks':
            return ApplicationStatusEnum.UnsuccessfulChecks;
        case 'Awaiting assessment':
            return ApplicationStatusEnum.AwaitingAssessment;
        case 'Successful':
            return ApplicationStatusEnum.Successful;
        case 'Unsuccessful':
            return ApplicationStatusEnum.Unsuccessful;
        default:
            return undefined;
    }
};

export const mapMockApplicationReviewStatusToReviewStatusEnum = (
    reviewStatus: string,
): ReviewStatusEnum | undefined => {
    switch (reviewStatus) {
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

export const mapMockApplicationResponseStatusToResponseStatusEnum = (
    responseStatus: string,
): ResponseStatusEnum | undefined => {
    switch (responseStatus) {
        case 'Provided':
            return ResponseStatusEnum.Provided;
        case 'Requested':
            return ResponseStatusEnum.Requested;
        case 'Not provided':
            return ResponseStatusEnum.NotProvided;
        case 'Not applicable':
            return ResponseStatusEnum.NotApplicable;
        default:
            return undefined;
    }
};

export const mapMockApplicationReviewStatsToReviewStats = (
    reviewStats: MockApplicationReviewStats,
): SearchServiceApplicationReviewStats => {
    return {
        pendingCount: reviewStats.pendingCount,
        toCheckCount: reviewStats.toCheckCount,
        usableCount: reviewStats.usableCount,
    };
};

export const mapMockApplicationReviewStatsToInvitationStats = (
    invitationStats: MockApplicationInvitationStats,
): SearchServiceApplicationInvitationStats => {
    return {
        declinedCount: invitationStats.declinedCount,
        noResponseCount: invitationStats.noResponseCount,
    };
};

export const mapMockApplicationToSearchServiceApplication = (
    mockApplication: MockApplication,
): SearchServiceApplication => {
    return {
        displayId: mockApplication.displayId,
        name: mockApplication.name,
        id: mockApplication.id,
        opportunityId: mockApplication.opportunityId,
        opportunityApplicationWorkflowComponentId: mockApplication.opportunityApplicationWorkflowComponentId,
        applicationStatus:
            mapMockApplicationStatusToApplicationStatusEnum(mockApplication.applicationStatus) ??
            ApplicationStatusEnum.Submitted,
        reviewStatus:
            mapMockApplicationReviewStatusToReviewStatusEnum(mockApplication.reviewStatus) ??
            ReviewStatusEnum.PendingChecks,
        reviewStatusPriority: mockApplication.reviewStatusPriority,
        responseStatus:
            mapMockApplicationResponseStatusToResponseStatusEnum(mockApplication.responseStatus) ??
            ResponseStatusEnum.NotApplicable,
        responseStatusPriority: mockApplication.responseStatusPriority,
        reviewStats: mapMockApplicationReviewStatsToReviewStats(mockApplication.reviewStats),
        invitationStats: mapMockApplicationReviewStatsToInvitationStats(mockApplication.invitationStats),
        ...(mockApplication.reviewFailedDate && { reviewFailedDate: new Date(mockApplication.reviewFailedDate) }),
    };
};
