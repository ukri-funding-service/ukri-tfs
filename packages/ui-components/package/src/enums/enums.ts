import { Colour } from '../components';

export enum ApplicationFilterStatus {
    WithApplicant = 'With applicant',
    WithResearchOffice = 'With research office',
    Submitted = 'Submitted',
    PendingChecks = 'Pending checks',
    Successful = 'Successful',
    Unsuccessful = 'Unsuccessful',
    MissedDeadline = 'Missed deadline',
    Unsubmitted = 'Unsubmitted',
    InDraft = 'In Draft',
    ForSubmission = 'For Submission',
    PassedChecks = 'Passed checks',
    AwaitingAssessment = 'Awaiting Assessment',
    FailedChecks = 'Failed checks - not sent',
    UnsuccessfulChecks = 'Failed checks - sent',
}

export enum OpportunityFunderFilterItem {
    AHRC = 'AHRC',
    BBSRC = 'BBSRC',
    ESRC = 'ESRC',
    EPSRC = 'EPSRC',
    Innovate_UK = 'Innovate UK',
    MRC = 'MRC',
    NERC = 'NERC',
    RE = 'Research England',
    STFC = 'STFC',
    UKRI = 'UKRI',
}

export enum ApplicationSort {
    RecentlyStarted = 'RecentlyStarted',
    EndingSoonest = 'EndingSoonest',
}

export const ApplicationStatuses = [
    'Draft',
    'Submitted',
    'Not submitted', // used to indicate the opportunity is now closed and the application can never be submitted
    'Sent to research office',
    'Return to applicant',
    'Failed checks',
    'Passed checks',
    'Unsuccessful checks',
    'Awaiting assessment',
    'Successful',
    'Unsuccessful',
] as const;

export type ApplicationStatus = typeof ApplicationStatuses[number];

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

export type PartyIdentifierTypes = 'InnovateUkSalesforceId';

export interface PartyIdentifier {
    id: number;
    type: PartyIdentifierTypes;
    identifier: string;
    organisationId: number;
    personId: number;
}

export interface Organisation {
    id: number;
    name: string;
    city: string;
    country: string;
    canLead: boolean;
    partyIdentifiers: PartyIdentifier[];
}

export type ApplicantOrganisation = Pick<Organisation, 'id' | 'name'>;

export enum ApplicantInviteStatus {
    INVITED = 'INVITED',
    DECLINED = 'DECLINED',
    REMOVED = 'REMOVED',
}

export interface Applicant {
    id: number; // personId
    applicationPersonId: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string | undefined;
    organisation: ApplicantOrganisation;
    applicantInviteStatus: ApplicantInviteStatus;
    declinedAt?: string;
}

export type ResponseReceived = 'Y' | 'N' | '-';

export type ApplicationProgress = {
    percentageComplete?: number;
    status: ApplicationStatus;
    sentForResponse?: boolean;
    responseReceived?: ResponseReceived;
};

export enum ApplicationDisplayStatus {
    withApplicant = 'With Applicant',
    complete = 'complete',
    inProgress = 'In draft',
    forSubmission = 'For submission',
    withResearchOffice = 'With Research Office',
    returnedToApplicant = 'Returned to Applicant',
    returnedByResearchOffice = 'Returned by Research Office',
    applicationSubmitted = 'Application submitted',
    submittedToUkri = 'Submitted to UKRI',
    applicationNotSubmitted = 'Missed deadline',
    reviewAvailable = 'Review available',
    awaitingResponse = 'Awaiting response',
    responseSubmitted = 'Response submitted',
    responseNotSubmitted = 'Response not submitted',
    blank = '',
    submitted = 'Submitted',
    successful = 'Successful',
    unsuccessful = 'Unsuccessful',
    failedChecks = 'Failed Checks',
    passedChecks = 'Passed Checks',
    unsuccessfulChecks = 'Failed Checks',
    awaitingAssessment = 'Awaiting Assessment',
    inAssessment = 'In Assessment',
    pendingChecks = 'Pending Checks',
    unsubmitted = 'Unsubmitted',
    failedExpertReview = 'Failed Expert Review',
}

export enum DecisionState {
    Successful = 'Successful',
    Unsuccessful = 'Unsuccessful',
}

export interface GroupFilter {
    id: number;
    name: string;
    applicationCount: number;
}

export interface Decision {
    decisionState: DecisionState;
}

export interface ReviewStatistic {
    statistic?: {
        countUsable: number;
        countReceived: number;
        sentForResponse: boolean;
        applicantResponseDeadline?: string;
        responseReceived: ResponseReceived;
    };
    applicationId: number;
}

export const mapFilterStatusToDisplayStatus = (
    applicationFilterStatus: ApplicationFilterStatus,
): ApplicationStatus[] | null => {
    switch (applicationFilterStatus) {
        case ApplicationFilterStatus.WithApplicant:
            return [ApplicationStatusEnum.Draft, ApplicationStatusEnum.ReturnToApplicant];
        case ApplicationFilterStatus.WithResearchOffice:
            return [ApplicationStatusEnum.SentToResearchOffice];
        case ApplicationFilterStatus.Submitted:
        case ApplicationFilterStatus.PendingChecks:
            return [ApplicationStatusEnum.Submitted];
        case ApplicationFilterStatus.MissedDeadline:
        case ApplicationFilterStatus.Unsubmitted:
            return [ApplicationStatusEnum.NotSubmitted];
        case ApplicationFilterStatus.PassedChecks:
            return [ApplicationStatusEnum.PassedChecks];
        case ApplicationFilterStatus.FailedChecks:
            return [ApplicationStatusEnum.FailedChecks];
        case ApplicationFilterStatus.UnsuccessfulChecks:
            return [ApplicationStatusEnum.UnsuccessfulChecks];
        case ApplicationFilterStatus.AwaitingAssessment:
            return [ApplicationStatusEnum.AwaitingAssessment];
        case ApplicationFilterStatus.Successful:
            return [ApplicationStatusEnum.Successful];
        case ApplicationFilterStatus.Unsuccessful:
            return [ApplicationStatusEnum.Unsuccessful];
        default:
            return null;
    }
};

export const getApplicationDisplayStatusTint = (
    applicationDisplayStatus: ApplicationDisplayStatus,
    applicationStatus: ApplicationStatus,
): Colour => {
    switch (applicationDisplayStatus) {
        case ApplicationDisplayStatus.withApplicant:
            return 'YELLOW';
        case ApplicationDisplayStatus.withResearchOffice:
            return 'BLUE';
        case ApplicationDisplayStatus.pendingChecks:
            return 'BLUE';
        case ApplicationDisplayStatus.submitted:
            return 'GREEN';
        case ApplicationDisplayStatus.passedChecks:
            return 'PURPLE';
        case ApplicationDisplayStatus.failedChecks:
            if (applicationStatus === ApplicationStatusEnum.UnsuccessfulChecks) {
                return 'GREY';
            }
            return 'RED';
        default:
            return 'GREY';
    }
};
