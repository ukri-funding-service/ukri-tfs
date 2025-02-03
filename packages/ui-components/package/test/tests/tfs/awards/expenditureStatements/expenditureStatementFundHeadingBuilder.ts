import { ExpenditureStatementFundHeading } from '../../../../../src';

export const expenditureStatementFundHeadingBuilder = (
    expenditureFundHeadingPartial: Partial<ExpenditureStatementFundHeading>,
): ExpenditureStatementFundHeading => {
    const defaultExpenditureFundHeadingPartial: ExpenditureStatementFundHeading = {
        id: 4,
        category: 'DA',
        subcategory: 'Other',
        amountSpent: 13,
        paidToDate: 0,
        fecAmount: 10,
        fecPercentage: 3,
    };

    return { ...defaultExpenditureFundHeadingPartial, ...expenditureFundHeadingPartial };
};
