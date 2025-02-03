import { daysRemaining } from '@ukri-tfs/time';

export const getDaysUntilDeadline = (deadline: Date): number => {
    return daysRemaining(deadline);
};

export const getExpenditureStatementState = (daysUntilDeadline: number): 'Overdue' | 'Imminent' | 'Issued' => {
    if (daysUntilDeadline < 0) {
        return 'Overdue';
    } else if (daysUntilDeadline <= 7) {
        return 'Imminent';
    } else {
        return 'Issued';
    }
};
