import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import applicationSchema from '../schemas/application.schema.json';
import {
    ApplicationStatusEnum,
    ResponseStatusEnum,
    ReviewStatusEnum,
    SearchServiceApplication,
    SearchServiceApplicationInvitationStats,
    SearchServiceApplicationReviewStats,
} from '../searchService';

describe('packages/search - schemas/application.schema.json', () => {
    let ajv: Ajv;

    let defaultApplication: SearchServiceApplication;

    beforeAll(() => {
        ajv = new Ajv({
            schemas: [applicationSchema],
        });
        addFormats(ajv);
    });

    beforeEach(() => {
        defaultApplication = {
            displayId: 'APP1007',
            id: 10007,
            name: 'Navigating the ethical complexities of human neural implants',
            opportunityId: 10637,
            opportunityApplicationWorkflowComponentId: 1201,
            applicationStatus: ApplicationStatusEnum.AwaitingAssessment,
            responseStatus: ResponseStatusEnum.Provided,
            responseStatusPriority: 3,
            reviewStats: {
                pendingCount: 0,
                toCheckCount: 0,
                usableCount: 0,
            },
            reviewStatus: ReviewStatusEnum.PassedChecks,
            reviewStatusPriority: 1,
            invitationStats: {
                noResponseCount: 0,
                declinedCount: 0,
            },
        };

        jest.resetAllMocks();
    });

    it('should validate the expert review application schema', () => {
        const isValid = ajv.validate(
            'https://funding-service.ukri.org/schema/search/index/application.schema.json',
            defaultApplication,
        );
        if (!isValid) {
            console.error(`ajv errors validating published event: ${JSON.stringify(ajv.errors)}`);
        }
        expect(isValid).toBe(true);
    });

    it('should invalidate schema if additional properties are added', () => {
        const application: SearchServiceApplication = {
            ...defaultApplication,
            ...{
                responseReceived: 'Y',
                sent: new Date('2024-01-01T05:00:00.000Z').toISOString(),
                sentInvites: 8,
                shortlistedInvites: 0,
                status: 'In Expert Review',
                submittedReviews: 0,
                usableReviews: 0,
            },
        };

        const isValid = ajv.validate(
            'https://funding-service.ukri.org/schema/search/index/application.schema.json',
            application,
        );

        expect(isValid).toBe(false);
    });

    it('should invalidate schema if incorrect responseStatus is provided', () => {
        const application: SearchServiceApplication = {
            ...defaultApplication,
            ...{ responseStatus: 'Invalid Response Status' as ResponseStatusEnum },
        };

        const isValid = ajv.validate(
            'https://funding-service.ukri.org/schema/search/index/application.schema.json',
            application,
        );

        expect(isValid).toBe(false);
    });

    it('should invalidate schema if incorrect reviewStatus is provided', () => {
        const application: SearchServiceApplication = {
            ...defaultApplication,
            ...{ reviewStatus: 'Invalid Review Status' as ReviewStatusEnum },
        };

        const isValid = ajv.validate(
            'https://funding-service.ukri.org/schema/search/index/application.schema.json',
            application,
        );

        expect(isValid).toBe(false);
    });

    it('should invalidate schema if incorrect review stats are provided', () => {
        const application: SearchServiceApplication = {
            ...defaultApplication,
            ...{
                reviewStats: {
                    pendingCount: 0,
                } as SearchServiceApplicationReviewStats,
            },
        };

        const isValid = ajv.validate(
            'https://funding-service.ukri.org/schema/search/index/application.schema.json',
            application,
        );

        expect(isValid).toBe(false);
    });

    it('should invalidate schema if incorrect invitations stats are provided', () => {
        const application: SearchServiceApplication = {
            ...defaultApplication,
            ...{
                invitationStats: {
                    declinedCount: 0,
                } as SearchServiceApplicationInvitationStats,
            },
        };

        const isValid = ajv.validate(
            'https://funding-service.ukri.org/schema/search/index/application.schema.json',
            application,
        );

        expect(isValid).toBe(false);
    });
});
