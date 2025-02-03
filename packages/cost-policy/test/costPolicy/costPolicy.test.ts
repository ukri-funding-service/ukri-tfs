import { describe, expect, it } from '@jest/globals';
import { addCalculationsToCostPolicy } from '../../src/costPolicy/costPolicy';
import { CostPolicy, CostPolicyWithCalculations } from '../../src/costPolicy/costPolicyTypes';

describe('Cost policy', () => {
    it('Added for basic coverage as part of new package creation. Tests need added', () => {
        const costPolicy: CostPolicy = {
            isComplete: false,
            costCategories: [
                {
                    name: 'category',
                    sequence: 1,
                    percentage: 1,
                    costAmount: 12,
                    opportunityCostPolicyCategoryId: 1,
                },
            ],
        };

        const expectedResult: CostPolicyWithCalculations = {
            contribution: 11.88,
            costCategories: [
                {
                    appliedFunding: 0.12,
                    costAmount: 12,
                    name: 'category',
                    opportunityCostPolicyCategoryId: 1,
                    percentage: 1,
                    sequence: 1,
                },
            ],
            isComplete: false,
            totalApplied: 0.12,
            totalCost: 12,
        };

        expect(addCalculationsToCostPolicy(costPolicy)).toEqual(expectedResult);
    });
});
