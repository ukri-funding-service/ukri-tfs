import { jest } from '@jest/globals';
import { User, UserContext } from '@ukri-tfs/auth';
import { TfsRestClient } from '@ukri-tfs/http';
import { Logger } from '@ukri-tfs/logging';
import {
    ApplicationStatusEnum,
    ResponseStatusEnum,
    ReviewStatusEnum,
    SearchServiceApplication,
    SearchServiceAward,
    SearchServiceAwardDto,
} from '../src';
import { MockApplication } from '../src/searchService/mockSearch/mockSearchService';
import {
    OpensearchApplicationHit,
    OpensearchApplicationResponseHit,
    OpensearchAwardResponseHit,
} from '../src/searchService/openSearch/opensearchService';
import Mock = jest.Mock;

export type CorrelationId = string;

export interface CorrelationIds {
    root: CorrelationId;
    parent: CorrelationId;
    current: CorrelationId;
}

export const getMockLogger = (): Logger => {
    return {
        audit: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
    };
};

export const getMockUserContext = (): UserContext => {
    const user = {
        id: 123,
        personId: 456,
        roles: [{ id: 1, name: 'TfsAdmin', displayName: 'Tfs Admin' }],
    } as User;

    const correlationIds: CorrelationIds = {
        root: 'CORRELATION_IDS_ROOT',
        parent: 'CORRELATION_IDS_PARENT',
        current: 'CORRELATION_IDS_CURRENT',
    };

    return {
        service: 'TEST_SERVICE',
        correlationIds: correlationIds,
        userId: 'USER_ID',
        user: Promise.resolve(user),
    };
};

export interface MockRestClient {
    tfsRestClient: TfsRestClient;
    getMethodMock: Mock<TfsRestClient['get']>;
    postMethodMock: Mock<TfsRestClient['post']>;
}

export const buildMockRestClient = (): MockRestClient => {
    const getMethodMock = jest.fn<TfsRestClient['get']>();
    const postMethodMock = jest.fn<TfsRestClient['post']>();
    const tfsRestClient: TfsRestClient = {
        get: getMethodMock as TfsRestClient['get'],
        post: postMethodMock as TfsRestClient['post'],
    } as TfsRestClient;

    return {
        getMethodMock,
        postMethodMock,
        tfsRestClient,
    };
};

export const buildOpensearchApplicationResponseHit = (
    opensearchResponseHitSourcePartial: Partial<OpensearchApplicationHit> = {},
): OpensearchApplicationResponseHit => {
    const defaultOpensearchResponseHitSource: OpensearchApplicationHit = {
        displayId: 'APP001',
        id: 1,
        name: 'OpenSearch Response Hit',
        opportunityId: 1,
        opportunityApplicationWorkflowComponentId: 2,
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

    return {
        _source: {
            ...defaultOpensearchResponseHitSource,
            ...opensearchResponseHitSourcePartial,
        },
    };
};

export const buildOpensearchAwardResponseHit = (
    opensearchResponseHitSourcePartial: Partial<SearchServiceAwardDto> = {},
): OpensearchAwardResponseHit => {
    const defaultOpensearchResponseHitSource: SearchServiceAwardDto = {
        id: 1,
        opportunityId: 1,
        applicationId: 2,
        awardReference: 0,
        awardName: '',
        organisationId: 0,
        organisationName: '',
        status: 'Draft',
        externalStatus: 'Invalid',
        tasks: [],
        externalTasks: [],
        earliestStartDate: new Date('2023-01-01').toISOString(),
        endDate: new Date('2023-02-01').toISOString(),
        actualStartDate: undefined,
        fesLastFesEvent: undefined,
        awardHolderId: undefined,
        awardHolderFirstName: undefined,
        awardHolderLastName: undefined,
        funder: undefined,
        grantReference: undefined,
        opportunityName: undefined,
        applicationName: undefined,
        deleted: false,
    };

    return {
        _source: {
            ...defaultOpensearchResponseHitSource,
            ...opensearchResponseHitSourcePartial,
        },
    };
};

export const buildSearchServiceApplication = (
    searchServiceApplicationPartial: Partial<SearchServiceApplication> = {},
): SearchServiceApplication => {
    const defaultSearchServiceApplication: SearchServiceApplication = {
        id: 1,
        displayId: 'APP001',
        opportunityId: 1,
        opportunityApplicationWorkflowComponentId: 2,
        name: 'Search Service Application',
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

    return {
        ...defaultSearchServiceApplication,
        ...searchServiceApplicationPartial,
    };
};

export const buildMockApplication = (mockApplicationPartial: Partial<MockApplication> = {}): MockApplication => {
    const defaultMockApplication: MockApplication = {
        id: 1,
        displayId: 'APP001',
        opportunityId: 1,
        opportunityApplicationWorkflowComponentId: 2,
        name: 'Mock Application',
        applicationStatus: ApplicationStatusEnum.AwaitingAssessment,
        responseStatus: 'Provided',
        responseStatusPriority: 3,
        reviewStats: {
            pendingCount: 0,
            toCheckCount: 0,
            usableCount: 0,
        },
        reviewStatus: 'Passed Checks',
        reviewStatusPriority: 1,
        invitationStats: {
            noResponseCount: 0,
            declinedCount: 0,
        },
    };

    return {
        ...defaultMockApplication,
        ...mockApplicationPartial,
    };
};

export const buildSearchServiceAward = (awardPartial: Partial<SearchServiceAward> = {}): SearchServiceAward => {
    const defaultSearchServiceAward: SearchServiceAward = {
        id: 1,
        opportunityId: 1,
        applicationId: 2,
        awardReference: 0,
        awardName: '',
        organisationId: 0,
        organisationName: '',
        status: 'Draft',
        externalStatus: 'Invalid',
        tasks: [],
        externalTasks: [],
        earliestStartDate: new Date('2023-01-01'),
        endDate: new Date('2023-02-01'),
        actualStartDate: undefined,
        fesLastFesEvent: undefined,
        funder: undefined,
        grantReference: undefined,
        opportunityName: undefined,
        applicationName: undefined,
    };

    return {
        ...defaultSearchServiceAward,
        ...awardPartial,
    };
};

export const buildSearchServiceAwardDto = (
    awardPartial: Partial<SearchServiceAwardDto> = {},
): SearchServiceAwardDto => {
    const defaultSearchServiceAward: SearchServiceAwardDto = {
        id: 1,
        opportunityId: 1,
        applicationId: 2,
        awardReference: 0,
        awardName: '',
        organisationId: 0,
        organisationName: '',
        status: 'Draft',
        externalStatus: 'Invalid',
        tasks: [],
        externalTasks: [],
        earliestStartDate: new Date('2023-01-01').toISOString(),
        endDate: new Date('2023-02-01').toISOString(),
        actualStartDate: undefined,
        fesLastFesEvent: undefined,
        funder: undefined,
        awardHolderId: undefined,
        awardHolderFirstName: undefined,
        awardHolderLastName: undefined,
        grantReference: undefined,
        opportunityName: undefined,
        applicationName: undefined,
        deleted: false,
    };

    return {
        ...defaultSearchServiceAward,
        ...awardPartial,
    };
};
