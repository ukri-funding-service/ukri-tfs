import { Email } from '../email';

export type EmailConfigType = {
    sourceEmail: string;
    sourceDisplayName: string;
    applicationManagerUrl: string;
};

export type Recipient = {
    firstName?: string;
    lastName?: string;
    email?: string;
    tfsId?: string;
    personId?: number;
};

export interface Applicant {
    id?: number;
    firstName?: string;
    lastName?: string;
    organisation?: string;
    role?: string;
    email?: string;
}

export interface Application {
    applicationRef: string;
    applicationName: string;
    opportunityRef: string;
    opportunityName: string;
}

export interface CoApplicant {
    firstName: string;
    lastName: string;
    role: string;
}

export interface Award {
    name: string;
    reference: string;
}

export interface Group {
    name: string;
    isDefault: boolean;
}

export interface Person {
    firstName: string;
    lastName: string;
}

export interface ApplicationEmailData {
    recipient: Recipient;
    application: Application;
}
export interface CoApplicantEmailData extends ApplicationEmailData {
    coApplicant: CoApplicant;
}

export interface RemovedCoreTeamMemberEmailData extends ApplicationEmailData {
    applicationOwner: Applicant;
    coreTeamMember: CoApplicant;
}

export interface ApplicationEmailDataWithApplicationLink extends ApplicationEmailData {
    applicationLink: string;
}

export interface ReviewLink {
    reviewLink: string;
}

export interface ApplicationEmailDataWithApplicant extends ApplicationEmailData {
    leadApplicant?: Applicant;
    userType: 'ResearchOfficer' | 'Applicant';
}

export type ApplicantUnsuccessfulChecksEmailGeneratorData = ApplicationEmailDataWithApplicant & ApplicationLink;

export type ApplicationEmailDataWithReviewLinkAndApplicant = ApplicationEmailDataWithApplicant & ReviewLink;

export interface ApplicationAccessEmailData {
    application: Application;
    leadApplicant: Applicant;
    organisation: Organisation;
    recipient: Recipient;
    accessLink: string;
}

export interface Organisation {
    id: number;
    name: string;
}
export interface InviteReviewerEmailData {
    opportunityDisplayId: string;
    applicationDisplayId: string;
    reviewDeadline: string;
    applicants: Applicant[];
    grantSize: number;
    applicationName: string;
    opportunityName: string;
    applicationSummary: string;
    urlLink: string;
    councilList: string[];
}

export interface ReviewReminderEmailData {
    reviewDeadline: string;
    applicationDisplayId: string;
    applicationName: string;
    opportunityDisplayId: string;
    opportunityName: string;
    reviewUrl: string;
}

export interface ReviewReminderOverdueEmailData {
    reviewDeadline: string;
    applicationDisplayId: string;
    applicationName: string;
    opportunityDisplayId: string;
    opportunityName: string;
    reviewUrl: string;
    daysOverdue: number;
}

export interface FesIssuedEmailData {
    recipient: Recipient;
    award: Award;
    deadlineDays?: number;
    fesUrl: string;
}

export interface TesIssuedEmailData {
    recipient: Recipient;
    award: Award;
    deadlineDays?: number;
    tesUrl: string;
}

export interface FesAcceptedEmailData {
    recipient: Recipient;
    award: Award;
    fesUrl: string;
    fesSubmittedDate: string;
}

export interface TesAcceptedEmailData {
    recipient: Recipient;
    award: Award;
    tesUrl: string;
    tesSubmittedDate: string;
}

export interface FesRejectedEmailData {
    recipient: Recipient;
    award: Award;
    fesUrl: string;
    fesSubmittedDate: string;
    fesRejectedComments: string;
}

export interface TesRejectedEmailData {
    recipient: Recipient;
    award: Award;
    tesUrl: string;
    tesSubmittedDate: string;
    tesRejectedComments: string;
}

export interface AwardClosedEmailData {
    recipient: Recipient;
    award: Award;
}

export interface GroupDeletedEmailData {
    group: Group;
    researchOfficer: Person;
}

export interface GroupUserAddedEmailData {
    group: Group;
    researchOfficer: Person;
}

export interface GroupUserRemovedEmailData {
    group: Group;
    researchOfficer: Person;
    externalFundingServiceSignInUrl: string;
}

export type InviteChampionEmailData = {
    inviteLink: string;
    recipient: Recipient;
    organisationName: string;
};

export type InvitePanelMemberEmailData = {
    recipient: Recipient;
    inviteLink: string;
    panelDisplayId: string;
    panelName: string;
    meetingStartTime: string;
    meetingEndTime: string;
    memberRole: string;
    prescoreCommentsRequired: boolean;
};

export type ApplicationGroupAssignedEmailData = {
    group: Group;
    application: Application;
    applicant: Applicant;
};

export type ApplicationGroupReassignedEmailData = {
    group: Group;
    application: Application;
};

export type ApplicationSentToResearchOfficeEmailData = {
    applicant: Applicant;
    application: Application;
    recipient: Recipient;
    opportunityCloseTime: string;
};

export interface ApplicationSubmittedEmailData {
    submitter: Applicant;
    application: Application;
    recipient: Recipient;
    submissionTime: string;
}

export type ApplicationGroupReassignedEmailDataWithApplicationLink = ApplicationGroupReassignedEmailData &
    ApplicationLink;

export type ApplicationGroupAssignedEmailDataWithApplicationLink = ApplicationGroupAssignedEmailData & ApplicationLink;

export type ApplicationSubmittedEmailGeneratorData = ApplicationSubmittedEmailData & ApplicationLink;

export interface ApplicationLink {
    applicationLink: string;
}

export type ApplicationSentToResearchOfficeEmailGeneratorData = ApplicationSentToResearchOfficeEmailData &
    ApplicationLink;

export interface InviteReviewerEmailTemplateData extends InviteReviewerEmailData {
    recipient: Recipient;
}

export interface ReviewReminderEmailTemplateData extends ReviewReminderEmailData {
    recipient: Recipient;
}

export interface ReviewReminderOverdueEmailTemplateData extends ReviewReminderOverdueEmailData {
    recipient: Recipient;
}

export interface CancelReviewerEmailData {
    recipient: Recipient;
    applicationName: string;
    firstName: string;
    lastName: string;
}

export type MFASetupCompleteEmailData = {
    recipient: Recipient;
    accountSettingsLink: string;
};

export type EmailData =
    | ApplicationEmailData
    | CoApplicantEmailData
    | InviteReviewerEmailData
    | CancelReviewerEmailData
    | ReviewReminderEmailData
    | ReviewReminderOverdueEmailData
    | FesAcceptedEmailData
    | FesIssuedEmailData
    | FesRejectedEmailData
    | TesAcceptedEmailData
    | TesIssuedEmailData
    | TesRejectedEmailData
    | AwardClosedEmailData
    | GroupDeletedEmailData
    | GroupUserAddedEmailData
    | GroupUserRemovedEmailData
    | ApplicationGroupAssignedEmailData
    | ApplicationGroupReassignedEmailData
    | InviteChampionEmailData
    | InvitePanelMemberEmailData
    | RemovedCoreTeamMemberEmailData
    | MFASetupCompleteEmailData;

export abstract class EmailGenerator<Type extends EmailData> {
    abstract generateHtml(emailData: Type): string;
    abstract generateText(emailData: Type): string;
    abstract generateEmail(toAddresses: string[], emailData: Type, emailConfig: EmailConfigType): Email;
}

export abstract class PreviewableEmailGenerator<Type extends EmailData> extends EmailGenerator<Type> {
    abstract generateEmailPreview(toAddresses: string[], emailData: Type, emailConfig: EmailConfigType): Email;
}
