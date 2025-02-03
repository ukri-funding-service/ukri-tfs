import { CostPolicy, CostPolicyWithCalculations, CostCategoryWithCalculations } from './costPolicyTypes';

const getAppliedFunding = (costAmount: number | '' = 0, percentage = 100): number =>
    (costAmount || 0) * (percentage / 100);

export const addCalculationsToCostPolicy = (costPolicy: CostPolicy): CostPolicyWithCalculations => {
    const costCategories = costPolicy.costCategories;
    const costCategoriesWithCalculations = costCategories.map<CostCategoryWithCalculations>(costCategory => {
        return {
            ...costCategory,
            appliedFunding: costCategory.costAmount
                ? getAppliedFunding(costCategory.costAmount, costCategory.percentage)
                : 0,
        };
    });

    const totalCost = costCategoriesWithCalculations.reduce((prev, item) => {
        return prev + (item.costAmount || 0);
    }, 0);

    const contribution = costCategoriesWithCalculations.reduce((prev, item) => {
        return prev + (item.costAmount || 0) - item.appliedFunding;
    }, 0);

    const totalApplied = costCategoriesWithCalculations.reduce((prev, item) => {
        return prev + item.appliedFunding;
    }, 0);

    return {
        ...costPolicy,
        costCategories: costCategoriesWithCalculations,
        totalCost,
        contribution,
        totalApplied,
    };
};
