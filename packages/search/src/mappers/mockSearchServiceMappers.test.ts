import { describe, expect, it } from '@jest/globals';
import { buildMockApplication, buildSearchServiceApplication } from '../../test/testHelpers';
import {
    mapMockApplicationResponseStatusToResponseStatusEnum,
    mapMockApplicationReviewStatsToInvitationStats,
    mapMockApplicationReviewStatsToReviewStats,
    mapMockApplicationReviewStatusToReviewStatusEnum,
    mapMockApplicationStatusToApplicationStatusEnum,
    mapMockApplicationToSearchServiceApplication,
} from '../mappers/mockSearchServiceMappers';
import {
    ApplicationStatusEnum,
    ResponseStatusEnum,
    ReviewStatusEnum,
    SearchServiceApplicationInvitationStats,
    SearchServiceApplicationReviewStats,
} from '../searchService';
import {
    MockApplicationInvitationStats,
    MockApplicationReviewStats,
} from '../searchService/mockSearch/mockSearchService';

describe('mockSearchServiceMappers', () => {
    describe('mapMockApplicationToSearchServiceApplication', () => {
        it('should map MockApplication to SearchServiceApplication', () => {
            const mockApplication = buildMockApplication({
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

            const searchServiceApplication = mapMockApplicationToSearchServiceApplication(mockApplication);

            expect(searchServiceApplication).toEqual(expectedSearchServiceApplication);
        });

        it('should map MockApplication to SearchServiceApplication with fallback statuses', () => {
            const mockApplication = buildMockApplication({
                applicationStatus: undefined,
                responseStatus: undefined,
                reviewStatus: undefined,
            });

            const searchServiceApplication = mapMockApplicationToSearchServiceApplication(mockApplication);

            expect(searchServiceApplication.applicationStatus).toBe(ApplicationStatusEnum.Submitted);
            expect(searchServiceApplication.responseStatus).toBe(ResponseStatusEnum.NotApplicable);
            expect(searchServiceApplication.reviewStatus).toBe(ReviewStatusEnum.PendingChecks);
        });

        it('should map optional reviewFailedDate', () => {
            const mockApplication = buildMockApplication({
                reviewFailedDate: '2024-10-20T12:57:00.350Z',
            });
            const expectedFailedDate = new Date('2024-10-20T12:57:00.350Z');

            const searchServiceApplication = mapMockApplicationToSearchServiceApplication(mockApplication);

            expect(searchServiceApplication.reviewFailedDate).toEqual(expectedFailedDate);
        });
    });

    describe('mapMockApplicationReviewStatusToReviewStatusEnum', () => {
        it.each([
            { reviewStatus: 'Passed Checks', expectedReviewStatusEnum: ReviewStatusEnum.PassedChecks },
            { reviewStatus: 'In Expert Review', expectedReviewStatusEnum: ReviewStatusEnum.InExpertReview },
            { reviewStatus: 'Sent For Response', expectedReviewStatusEnum: ReviewStatusEnum.SentForResponse },
            { reviewStatus: 'Expert Review Complete', expectedReviewStatusEnum: ReviewStatusEnum.ExpertReviewComplete },
            { reviewStatus: 'Failed Review', expectedReviewStatusEnum: ReviewStatusEnum.FailedReview },
            { reviewStatus: 'Successful', expectedReviewStatusEnum: ReviewStatusEnum.Successful },
            { reviewStatus: 'Unsuccessful', expectedReviewStatusEnum: ReviewStatusEnum.Unsuccessful },
            { reviewStatus: 'Pending Checks', expectedReviewStatusEnum: ReviewStatusEnum.PendingChecks },
            { reviewStatus: 'Invalid Review Status', expectedReviewStatusEnum: undefined },
        ])(
            'should map mock application review status $reviewStatus to ReviewStatusEnum $reviewStatusEnum',
            ({ reviewStatus, expectedReviewStatusEnum }) => {
                const result = mapMockApplicationReviewStatusToReviewStatusEnum(reviewStatus);

                expect(result).toBe(expectedReviewStatusEnum);
            },
        );
    });

    describe('mapMockApplicationResponseStatusToResponseStatusEnum', () => {
        it.each([
            { responseStatus: 'Provided', expectedResponseStatusEnum: ResponseStatusEnum.Provided },
            { responseStatus: 'Requested', expectedResponseStatusEnum: ResponseStatusEnum.Requested },
            { responseStatus: 'Not provided', expectedResponseStatusEnum: ResponseStatusEnum.NotProvided },
            { responseStatus: 'Not applicable', expectedResponseStatusEnum: ResponseStatusEnum.NotApplicable },
            { responseStatus: 'Invalid Response Status', expectedResponseStatusEnum: undefined },
        ])(
            'should map mock application response status $responseStatus to ResponseStatusEnum $responseStatusEnum',
            ({ responseStatus, expectedResponseStatusEnum }) => {
                const result = mapMockApplicationResponseStatusToResponseStatusEnum(responseStatus);

                expect(result).toBe(expectedResponseStatusEnum);
            },
        );
    });

    describe('mapMockApplicationReviewStatsToReviewStats', () => {
        it('should map mock application review stats to search service application review stats', () => {
            const reviewStats: MockApplicationReviewStats = {
                pendingCount: 1,
                toCheckCount: 2,
                usableCount: 3,
            };
            const expectedReviewStats: SearchServiceApplicationReviewStats = {
                pendingCount: 1,
                toCheckCount: 2,
                usableCount: 3,
            };

            const result = mapMockApplicationReviewStatsToReviewStats(reviewStats);

            expect(result).toEqual(expectedReviewStats);
        });
    });

    describe('mapMockApplicationReviewStatsToInvitationStats', () => {
        it('should map mock application invitation stats to search service application invitation stats', () => {
            const invitationStats: MockApplicationInvitationStats = {
                declinedCount: 1,
                noResponseCount: 2,
            };
            const expectedInvitationStats: SearchServiceApplicationInvitationStats = {
                declinedCount: 1,
                noResponseCount: 2,
            };

            const result = mapMockApplicationReviewStatsToInvitationStats(invitationStats);

            expect(result).toEqual(expectedInvitationStats);
        });
    });

    describe('mapMockApplicationStatusToApplicationStatusEnum', () => {
        it.each([
            { applicationStatus: 'Draft', applicationStatusEnum: ApplicationStatusEnum.Draft },
            { applicationStatus: 'Submitted', applicationStatusEnum: ApplicationStatusEnum.Submitted },
            { applicationStatus: 'Not submitted', applicationStatusEnum: ApplicationStatusEnum.NotSubmitted },
            {
                applicationStatus: 'Sent to research office',
                applicationStatusEnum: ApplicationStatusEnum.SentToResearchOffice,
            },
            {
                applicationStatus: 'Return to applicant',
                applicationStatusEnum: ApplicationStatusEnum.ReturnToApplicant,
            },
            { applicationStatus: 'Failed checks', applicationStatusEnum: ApplicationStatusEnum.FailedChecks },
            { applicationStatus: 'Passed checks', applicationStatusEnum: ApplicationStatusEnum.PassedChecks },
            {
                applicationStatus: 'Unsuccessful checks',
                applicationStatusEnum: ApplicationStatusEnum.UnsuccessfulChecks,
            },
            {
                applicationStatus: 'Awaiting assessment',
                applicationStatusEnum: ApplicationStatusEnum.AwaitingAssessment,
            },
            { applicationStatus: 'Successful', applicationStatusEnum: ApplicationStatusEnum.Successful },
            { applicationStatus: 'Unsuccessful', applicationStatusEnum: ApplicationStatusEnum.Unsuccessful },
            { applicationStatus: 'Invalid application status', applicationStatusEnum: undefined },
        ])(
            'should map mock application status $applicationStatus to ApplicationStatusEnum $applicationStatusEnum',
            ({ applicationStatus, applicationStatusEnum }) => {
                const result = mapMockApplicationStatusToApplicationStatusEnum(applicationStatus);

                expect(result).toBe(applicationStatusEnum);
            },
        );
    });
});
