import { expenditureStatementFundHeadingBuilder } from '../expenditureStatementFundHeadingBuilder';
import { expenditureStatementBuilder } from '../expenditureStatementBuilder';
import { expect } from 'chai';
import { mapExpenditureStatementToExpenditureStatementCategories } from '../../../../../../src';

describe('mappers', () => {
    describe('ExpenditureStatement to ExpenditureStatementCategory', () => {
        const fundHeading = expenditureStatementFundHeadingBuilder({
            id: 6,
            category: 'Directly Allocated',
            subcategory: 'Other',
            amountSpent: 13,
            paidToDate: 3,
            fecAmount: 100,
            fecPercentage: 50,
        });
        const expenditureStatement = expenditureStatementBuilder({
            fundHeadings: [fundHeading],
        });
        it('should map expenditure fund heading rows', () => {
            const expenditureStatementCategories =
                mapExpenditureStatementToExpenditureStatementCategories(expenditureStatement);

            expect(expenditureStatementCategories.length).to.be.eq(1);
            expect(expenditureStatementCategories[0].title).to.be.eq('Directly Allocated');
            expect(expenditureStatementCategories[0].fundHeadingRows.length).to.be.eq(1);
            expect(expenditureStatementCategories[0].fundHeadingRows[0]).to.deep.eq({
                id: 6,
                amountSpent: 13,
                fundHeading: 'Other',
                fecPercentage: 50,
                fecAmount: 100,
                awardValue: 50,
                paidToDate: 3,
                awardExpenditure: 6.5,
                totalRow: false,
            });
        });
        it('should map a fundHeading list by category', () => {
            const daHeading1 = expenditureStatementFundHeadingBuilder({
                category: 'Directly Allocated',
                subcategory: 'Other',
            });
            const daHeading2 = expenditureStatementFundHeadingBuilder({
                category: 'Directly Allocated',
                subcategory: 'Estate',
            });
            const categorizedStatement = expenditureStatementBuilder({
                fundHeadings: [daHeading1, daHeading2],
            });
            const expenditureStatementCategories =
                mapExpenditureStatementToExpenditureStatementCategories(categorizedStatement);

            expect(expenditureStatementCategories[0].fundHeadingRows.length).to.be.eq(2);
        });
    });
});
