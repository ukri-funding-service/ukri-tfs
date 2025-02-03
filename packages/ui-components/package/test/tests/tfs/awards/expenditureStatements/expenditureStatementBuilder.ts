import { ExpenditureStatement } from '../../../../../src';

export const expenditureStatementBuilder = (
    defaultExpenditurePartial: Partial<ExpenditureStatement>,
): ExpenditureStatement => {
    const defaultExpenditureStatement: ExpenditureStatement = {
        id: 1,
        issuedAt: '2022-09-21T12:00:00.000Z',
        deadline: '2022-12-20T12:00:00.000Z',
        type: 'Final',
        status: 'Draft',
        fundHeadings: [],
        activityLog: [],
    };

    return { ...defaultExpenditureStatement, ...defaultExpenditurePartial };
};
