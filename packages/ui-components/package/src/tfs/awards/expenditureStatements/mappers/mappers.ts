import { calculatePercentage } from '../../../../calculation';
import { ExpenditureStatement, ExpenditureStatementFundHeading } from '../models/expenditureStatements';

export interface ExpenditureStatementRow {
    id: number;
    fundHeading: string;
    fecPercentage: number;
    fecAmount: number;
    awardValue: number;
    paidToDate: number;
    amountSpent: number | null;
    awardExpenditure: number;
    totalRow: boolean;
}

export interface ExpenditureStatementCategory {
    title: string;
    fundHeadingRows: ExpenditureStatementRow[];
}

export const mapExpenditureStatementToExpenditureStatementCategories = (
    expenditureStatement: ExpenditureStatement,
): ExpenditureStatementCategory[] => {
    const superCategories = ['Directly allocated', 'Directly incurred', 'Indirect costs', 'Exceptions'];
    const subCategoryOrder = ['Staff', 'Equipment', 'Estates', 'Travel and subsistence', 'Other'];

    const sortRowsBySubCategory = (rows: ExpenditureStatementRow[]): ExpenditureStatementRow[] => {
        const getIndex = (subCategory: string) =>
            subCategoryOrder.indexOf(subCategory) !== -1
                ? subCategoryOrder.indexOf(subCategory)
                : subCategoryOrder.length;

        return rows.sort(
            (a: ExpenditureStatementRow, b: ExpenditureStatementRow) =>
                getIndex(a.fundHeading) - getIndex(b.fundHeading),
        );
    };

    expenditureStatement.fundHeadings.forEach(fundHeading => {
        if (!superCategories.includes(fundHeading.category)) {
            superCategories.push(fundHeading.category);
        }
    });
    return superCategories
        .map(superCategory => {
            return {
                title: superCategory,
                fundHeadingRows: sortRowsBySubCategory(
                    expenditureStatement.fundHeadings
                        .filter(fundHeading => {
                            return superCategory === fundHeading.category;
                        })
                        .map(mapFundHeadingToExpenditureStatementRow),
                ),
            };
        })
        .filter(category => category.fundHeadingRows.length > 0);
};

const mapFundHeadingToExpenditureStatementRow = (
    fundHeading: ExpenditureStatementFundHeading,
): ExpenditureStatementRow => {
    const awardExpenditure = calculatePercentage(fundHeading.fecPercentage, fundHeading.amountSpent);
    const awardValue = calculatePercentage(fundHeading.fecPercentage, fundHeading.fecAmount);

    return {
        id: fundHeading.id,
        fundHeading: fundHeading.subcategory,
        fecPercentage: fundHeading.fecPercentage,
        awardValue,
        fecAmount: fundHeading.fecAmount,
        paidToDate: fundHeading.paidToDate,
        amountSpent: fundHeading.amountSpent,
        awardExpenditure,
        totalRow: false,
    };
};
