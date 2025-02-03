import { TfsRestClient } from '@ukri-tfs/http';
import { Logger } from '@ukri-tfs/logging';
import { OpensearchSortOrder } from './openSearch/openSearchQueryModels';

export enum ApplicationStatusEnum {
    Draft = 'Draft',
    Submitted = 'Submitted',
    NotSubmitted = 'Not submitted',
    SentToResearchOffice = 'Sent to research office',
    ReturnToApplicant = 'Return to applicant',
    FailedChecks = 'Failed checks',
    PassedChecks = 'Passed checks',
    UnsuccessfulChecks = 'Unsuccessful checks',
    AwaitingAssessment = 'Awaiting assessment',
    Successful = 'Successful',
    Unsuccessful = 'Unsuccessful',
}

export enum ReviewStatusEnum {
    PassedChecks = 'Passed Checks',
    InExpertReview = 'In Expert Review',
    SentForResponse = 'Sent For Response',
    ExpertReviewComplete = 'Expert Review Complete',
    FailedReview = 'Failed Review',
    Successful = 'Successful',
    Unsuccessful = 'Unsuccessful',
    PendingChecks = 'Pending Checks',
}
export const awardTasks = [
    'Set-up',
    'Start overdue',
    'Offer Returned',
    'Approval',
    'Offer response overdue',
    'Resumption overdue',
    'TES Received',
    'FES Received',
    'Additional Funding',
    'Extension',
    'Suspension',
    'Start Date',
    'Resumption',
    'Transfer',
    'Termination',
] as const;

export const externalTasks = ['Offer response', 'Ready to start', 'Submit resumption', 'TES due', 'FES due'];
export const overdueExternalTasks = [
    'Offer response overdue',
    'Start overdue',
    'Resumption overdue',
    'TES overdue',
    'FES overdue',
];

export const externalTasksTitleFilter = [
    'Offer response',
    'Offer response overdue',
    'Ready to start',
    'Start overdue',
    'Change request',
    'Submit resumption',
    'Resumption overdue',
    'TES due',
    'TES overdue',
    'FES due',
    'FES overdue',
];

export type AwardTask = typeof awardTasks[number];
export type ExternalTask = typeof externalTasks[number];
export type OverdueExternalTask = typeof overdueExternalTasks[number];
export type ExternalTaskTitleFilter = typeof externalTasksTitleFilter[number];

export const awardFunders = [
    'AHRC',
    'BBSRC',
    'EPSRC',
    'ESRC',
    'Innovate UK',
    'MRC',
    'NERC',
    'Research England',
    'STFC',
    'UKRI',
] as const;

export const awardSortFields = [
    'awardReferenceAndName',
    'awardHolder',
    'organisation',
    'funder',
    'startDate',
    'endDate',
    'status',
    'receivedDate',
    'task',
    'assignedPersonName',
] as const;

export type AwardFunder = typeof awardFunders[number];

export const internalStatuses = [
    'Draft',
    'Awaiting authorisation',
    'Awaiting acceptance',
    'Announced',
    'Active',
    'Awaiting completion',
    'Reconciling',
    'Suspended',
    'Awaiting termination',
    'Transfer initiated',
    'Closed',
] as const;

export const externalStatuses = [
    'Awaiting acceptance',
    'Returned for amendments',
    'Announced',
    'Active',
    'Awaiting completion',
    'Reconciling',
    'Suspended',
    'Awaiting termination',
    'Transfer initiated',
    'Closed',
] as const;

export type ValidExternalStatus = typeof externalStatuses[number];
export type ExternalAwardStatus = ValidExternalStatus | 'Invalid';
export type InternalAwardStatus = typeof internalStatuses[number];

export type AssignedFilter = 'assigned' | 'unassigned' | number;

export type OrganisationIdFilter = number;

export enum ReviewGroupStatusEnum {
    Failed = 'Failed',
    Complete = 'Completed',
    SentForResponse = 'SentForResponse',
    InProgress = 'InProgress',
}

export enum ResponseStatusEnum {
    Provided = 'Provided',
    Requested = 'Requested',
    NotProvided = 'Not provided',
    NotApplicable = 'Not applicable',
}

export interface SearchServiceApplicationReviewStats {
    pendingCount: number;
    usableCount: number;
    toCheckCount: number;
}

export interface SearchServiceApplicationInvitationStats {
    noResponseCount: number;
    declinedCount: number;
}

export interface SearchServiceApplication {
    id: number;
    displayId: string;
    opportunityId: number;
    opportunityApplicationWorkflowComponentId: number;
    applicationStatus: ApplicationStatusEnum;
    name?: string;
    reviewStatus: ReviewStatusEnum;
    reviewStatusPriority: number;
    responseStatus: ResponseStatusEnum;
    responseStatusPriority: number;
    reviewStats: SearchServiceApplicationReviewStats;
    invitationStats: SearchServiceApplicationInvitationStats;
    reviewFailedDate?: Date;
}

type SearchServiceAwardBase = {
    id: number;
    awardReference: number;
    grantReference?: string;
    awardName: string;
    awardHolderId?: number;
    awardHolderFirstName?: string;
    awardHolderLastName?: string;
    opportunityId?: number;
    opportunityName?: string;
    applicationId?: number;
    applicationName?: string;
    organisationId: number;
    organisationName: string;
    status: InternalAwardStatus;
    externalStatus: ExternalAwardStatus;
    funder?: AwardFunder;
    fesLastFesEvent?: string;
    assignedPersonId?: number;
    assignedPersonName?: string;
    thirdPartyExternalTasks?: ThirdPartyExternalTask[];
    deleted?: boolean;
};

export type SlaTask = {
    title: AwardTask;
    slaDate: Date;
    activateDate: Date;
};
export type SlaTaskDto = {
    title: AwardTask;
    slaDate: string;
    activateDate: string;
};
export type ExternalSlaTask = {
    title: ExternalTask;
    slaDate: Date;
    activateDate: Date;
    overdueDate?: Date;
    overdueTitle?: string;
};

export type ExternalSlaTaskDto = {
    title: ExternalTask;
    slaDate: string;
    activateDate: string;
    overdueDate?: string;
    overdueTitle?: string;
};

export type ThirdPartyExternalTask = {
    title: string;
    activateDate: string;
};

export type SearchServiceAward = SearchServiceAwardBase & {
    tasks: SlaTask[];
    externalTasks: ExternalSlaTask[];
    earliestStartDate: Date;
    actualStartDate?: Date;
    endDate: Date;
};
export type SearchServiceAwardDto = SearchServiceAwardBase & {
    tasks: SlaTaskDto[];
    externalTasks: ExternalSlaTaskDto[];
    earliestStartDate: string;
    actualStartDate?: string;
    endDate: string;
};

export interface SearchServiceResultsMeta {
    page: number;
    countOnPage: number;
    totalCount: number;
    totalPages: number;
    pageSize?: number;
}

export interface ReviewStatusResultCount {
    title: ReviewStatusEnum;
    count: number;
}

export interface SearchServiceResultCounts {
    reviewStatuses?: ReviewStatusResultCount[];
}

export type SearchServiceApplicationResults = {
    meta: SearchServiceResultsMeta;
    results: SearchServiceApplication[];
    resultCounts?: SearchServiceResultCounts;
};

export type SearchServiceAwardResults = {
    meta: SearchServiceResultsMeta;
    results: SearchServiceAwardDto[];
};

export enum SortOrderEnum {
    Asc = 'asc',
    Desc = 'desc',
}

export enum ApplicationFieldEnum {
    Id = 'id',
    DisplayId = 'displayId',
    Name = 'name',
    ReviewStatus = 'reviewStatus',
    ReviewStatusPriority = 'reviewStatusPriority',
    ResponseStatus = 'responseStatus',
    ResponseStatusPriority = 'responseStatusPriority',
    PendingCount = 'pendingCount',
    UsableCount = 'usableCount',
    ToCheckCount = 'toCheckCount',
    NoResponseCount = 'noResponseCount',
    DeclinedCount = 'declinedCount',
}

export type AwardSortFields = typeof awardSortFields[number];

type awardSortKeys =
    | 'awardReference'
    | 'awardHolderFirstName.keyword'
    | 'awardHolderLastName.keyword'
    | 'organisationName.keyword'
    | 'funder.keyword'
    | 'earliestStartDate'
    | 'actualStartDate'
    | 'endDate'
    | 'tasks.activateDate'
    | 'tasks.slaDate'
    | 'assignedPersonName.keyword';

export const mapSortFieldForAward: Record<string, awardSortKeys[]> = {
    awardReferenceAndName: ['awardReference'],
    awardHolder: ['awardHolderFirstName.keyword', 'awardHolderLastName.keyword'],
    organisation: ['organisationName.keyword'],
    funder: ['funder.keyword'],
    startDate: ['earliestStartDate', 'actualStartDate'],
    endDate: ['endDate'],
    receivedDate: ['tasks.activateDate'],
    task: ['tasks.slaDate'],
    assignedPersonName: ['assignedPersonName.keyword'],
};

export type SortOrder = OpensearchSortOrder;

export interface SearchOptions {
    page?: number;
    pageSize?: number;
    sortField?: ApplicationFieldEnum;
    sortOrder?: SortOrderEnum;
}

export type AwardSearchOptions = {
    page?: number;
    pageSize?: number;
    sortField?: AwardSortFields;
    sortOrder?: SortOrder;
    external?: boolean;
};

export enum SearchServiceStateEnum {
    DomainSearchService = 'DomainSearchService',
    OpensearchService = 'OpensearchService',
    MockSearchService = 'MockSearchService',
}

export interface ApplicationSearchFilterArgs {
    reviewStatuses?: ReviewStatusEnum[];
    applicationStatuses?: ApplicationStatusEnum[];
}

export type AwardSearchFilterArgs = {
    tasks?: AwardTask[];
    externalTasks?: ExternalTask[];
    funders?: AwardFunder[];
    statuses?: InternalAwardStatus[];
    externalStatuses?: ExternalAwardStatus[];
    assigned?: AssignedFilter[];
    organisationId?: OrganisationIdFilter[];
};

export interface ApplicationSearchArgs {
    opportunityId: number;
    applicationWorkflowComponentId: number;
    searchTerm?: string;
    filter?: ApplicationSearchFilterArgs;
    filterCountFields?: ApplicationFieldEnum[];
}

export type AwardSearchArgs = {
    searchTerm?: string;
    filter?: AwardSearchFilterArgs;
};

export interface SearchService {
    state: SearchServiceStateEnum;
    getApplications: (
        searchArguments: ApplicationSearchArgs,
        searchOptions?: SearchOptions,
    ) => Promise<SearchServiceApplicationResults>;
    getAwards: (
        searchArguments: AwardSearchArgs,
        searchOptions?: AwardSearchOptions,
    ) => Promise<SearchServiceAwardResults>;
    getAwardsCount: (organisationId: number) => Promise<number>;
    verifyHealth: () => Promise<boolean>;
}

export abstract class SearchServiceImpl {
    constructor(protected tfsUserId: string, protected tfsFetchClient: TfsRestClient, protected logger: Logger) {}
}
