export interface CostCategory {
    name: string;
    sequence: number;
    percentage: number;
    costAmount: number | null;
    opportunityCostPolicyCategoryId: number;
}

export interface CostCategoryWithCalculations extends CostCategory {
    appliedFunding: number;
}

export interface CostPolicy {
    id?: number;
    isComplete: boolean;
    costCategories: CostCategory[];
}

export interface CostPolicyWithCalculations extends CostPolicy {
    totalCost: number;
    contribution: number;
    totalApplied: number;
    costCategories: CostCategoryWithCalculations[];
}
