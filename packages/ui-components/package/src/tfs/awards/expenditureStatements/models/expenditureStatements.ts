export type ExpenditureStatementStatus = 'Draft' | 'Submitted' | 'Accepted' | 'Rejected';

export interface ExpenditureStatement {
    id: number;
    issuedAt: string;
    type: 'Final' | 'Transfer';
    status: ExpenditureStatementStatus;
    fundHeadings: ExpenditureStatementFundHeading[];
    submittedBy?: string;
    submittedAt?: string;
    activityLog: ExpenditureStatementActivityLogEntry[];
    deadline: string;
}

export interface ExpenditureStatementActivityLogEntry {
    action: ExpenditureStatementActivityLogAction;
    actionedAt: string;
    actionedBy: string;
    reason: string;
}

const fESRejectedAndReissued = 'fES rejected and re-issued';
const tESRejectedAndReissued = 'tES rejected and re-issued';
const fESAccepted = 'fES accepted';
const tESAccepted = 'tES accepted';
const fESSubmitted = 'fES submitted';
const tESSubmitted = 'tES submitted';
const fESIssued = 'fES issued';
const tESIssued = 'tES issued';

export const ExpenditureStatementRejectedActivityLogActionTypes = [
    fESRejectedAndReissued,
    tESRejectedAndReissued,
] as const;
export type ExpenditureStatementRejectedActivityLogAction =
    typeof ExpenditureStatementRejectedActivityLogActionTypes[number];

export const ExpenditureStatementAcceptedActivityLogActionTypes = [fESAccepted, tESAccepted] as const;
export type ExpenditureStatementAcceptedActivityLogAction =
    typeof ExpenditureStatementAcceptedActivityLogActionTypes[number];

export const ExpenditureStatementSubmittedActivityLogActionTypes = [fESSubmitted, tESSubmitted] as const;
export type ExpenditureStatementSubmittedActivityLogAction =
    typeof ExpenditureStatementSubmittedActivityLogActionTypes[number];

export const ExpenditureStatementActivityLogActionTypes = [
    fESIssued,
    tESIssued,
    ...ExpenditureStatementRejectedActivityLogActionTypes,
    ...ExpenditureStatementAcceptedActivityLogActionTypes,
    ...ExpenditureStatementSubmittedActivityLogActionTypes,
] as const;

export type ExpenditureStatementActivityLogAction = typeof ExpenditureStatementActivityLogActionTypes[number];

export const FesActivityLogActionTypes = [fESRejectedAndReissued, fESAccepted, fESSubmitted, fESIssued] as const;

export const TesActivityLogActionTypes = [tESRejectedAndReissued, tESAccepted, tESSubmitted, tESIssued] as const;

export type FesActivityLogAction = typeof FesActivityLogActionTypes[number];

export interface ExpenditureStatementFundHeading {
    id: number;
    category: string;
    subcategory: string;
    amountSpent: number;
    paidToDate: number;
    fecAmount: number;
    fecPercentage: number;
}

export interface ExpenditureStatementTotals {
    totalfecAmount: number;
    totalAwardValue: number;
    totalPaidToDate: number;
    totalAmountSpent: number;
    totalAwardSpent: number;
}
