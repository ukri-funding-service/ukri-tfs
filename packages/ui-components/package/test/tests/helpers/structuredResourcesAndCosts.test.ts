import { expect } from 'chai';
import { LinkedCost, OpportunityCostPolicyCategoryTree, StructuredCosts } from '../../../src';
import {
    CostPolicyCategoryDictionary,
    ParentCategoriesDictionary,
    StructuredCostRow,
    generateParentCategoriesDictionary,
    getCostFromLinkedCosts,
    getFullCostForParentCategory,
    getTotalAppliedFor,
    getTotalAppliedForPerApplication,
    getTotalAppliedForPerOrganisation,
    displayValueInUKPoundsOrDash,
    displayValueWithPencesOrDash,
    OrganisationDictionary,
    generateOrganisationDictionary,
} from '../../../src/helpers/structuredResourcesAndCosts';
import { structuredCosts } from '../factories/StructuredCostSection';

describe('structured resources and costs', () => {
    describe('generateParentCategoriesDictionary', () => {
        it('should get the respective categories for a single parent category', () => {
            const parentCategoriesDictionary = generateParentCategoriesDictionary([
                structuredCosts.costPolicyCategoryTrees[0],
            ]);

            expect(parentCategoriesDictionary).to.deep.equal({ '1361': [1365, 1366, 1367] });
        });
    });

    describe('getFullCostForParentCategory', () => {
        it('should calculate applied for by each of the individual category fECs given they are different from the parent cat', () => {
            const linkedCost: LinkedCost = {
                id: 67,
                linkedCostCategories: [
                    {
                        id: 72,
                        opportunityCostPolicyCategoryId: 1372,
                        costAmountGbp: 1000,
                    },
                    {
                        id: 71,
                        opportunityCostPolicyCategoryId: 1373,
                        costAmountGbp: 1000,
                    },
                    {
                        id: 73,
                        opportunityCostPolicyCategoryId: 1374,
                        costAmountGbp: 1000,
                    },
                ],
                staffCosts: [
                    {
                        id: 3,
                        unnamedLabel: 'The unnamed student',
                        unnamedRoleId: 14,
                        opportunityCostCategoryId: 1373,
                        applicationCostId: 67,
                        ftePercentage: 67,
                        fullEconomicCostPence: 100000,
                        startDate: new Date('2023-08-01T00:00:00.000Z'),
                        endDate: new Date('2023-09-01T00:00:00.000Z'),
                    },
                ],
                organisationId: 1,
            };

            const parentCategoriesDictionary: ParentCategoriesDictionary = {
                '1364': [1372, 1373, 1374],
            };

            const costPolicyCategoryDictionary: CostPolicyCategoryDictionary = {
                '1364': { id: 1364, name: 'Exceptions', percentageValue: 80, parentId: undefined, sequence: 1 },
                '1372': { id: 1372, name: 'Equipment', percentageValue: 75, parentId: 1364, sequence: 1 },
                '1373': { id: 1373, name: 'Staff', percentageValue: 65, parentId: 1364, sequence: 1 },
                '1374': { id: 1374, name: 'Other', percentageValue: 55, parentId: 1364, sequence: 1 },
            };

            const fullCostForParentCategory = getFullCostForParentCategory(
                1364,
                linkedCost,
                parentCategoriesDictionary,
                costPolicyCategoryDictionary,
            );

            expect(fullCostForParentCategory).to.equal(1950);
        });
    });

    describe('getTotalAppliedFor', () => {
        it('should calculate applied for by each of the individual category fECs given they are different from the parent cat', () => {
            const linkedCost: LinkedCost = {
                id: 67,
                linkedCostCategories: [
                    {
                        id: 72,
                        opportunityCostPolicyCategoryId: 1372,
                        costAmountGbp: 1000,
                    },
                    {
                        id: 71,
                        opportunityCostPolicyCategoryId: 1373,
                        costAmountGbp: 1000,
                    },
                    {
                        id: 73,
                        opportunityCostPolicyCategoryId: 1374,
                        costAmountGbp: 1000,
                    },
                ],
                staffCosts: [
                    {
                        id: 3,
                        unnamedLabel: 'The unnamed student',
                        unnamedRoleId: 14,
                        opportunityCostCategoryId: 1373,
                        applicationCostId: 67,
                        ftePercentage: 67,
                        fullEconomicCostPence: 100300,
                        startDate: new Date('2023-08-01T00:00:00.000Z'),
                        endDate: new Date('2023-09-01T00:00:00.000Z'),
                    },
                ],
                organisationId: 1,
            };

            const parentCategoriesDictionary: ParentCategoriesDictionary = {
                '1364': [1372, 1373, 1374],
            };

            const costPolicyCategoryDictionary: CostPolicyCategoryDictionary = {
                '1364': { id: 1364, name: 'Exceptions', percentageValue: 80, parentId: undefined, sequence: 1 },
                '1372': { id: 1372, name: 'Equipment', percentageValue: 75, parentId: 1364, sequence: 1 },
                '1373': { id: 1373, name: 'Staff', percentageValue: 65, parentId: 1364, sequence: 1 },
                '1374': { id: 1374, name: 'Other', percentageValue: 55, parentId: 1364, sequence: 1 },
            };

            const totalAppliedForFunction = getTotalAppliedFor(
                linkedCost,
                parentCategoriesDictionary,
                costPolicyCategoryDictionary,
            );

            const fullCostRow: StructuredCostRow = {
                id: 1364,
                level: 0,
                name: 'Exceptions',
                percentageValue: 80,
                sequence: 1,
                staffCost: undefined,
                isLastChildOfParent: false,
            };

            expect(totalAppliedForFunction(fullCostRow)).to.equal('£1,951.95');
        });
    });

    describe('getCostFromLinkedCosts', () => {
        it('should get the staff cost totals given the staff cost totals differ from the cost category totals', () => {
            const linkedCost: LinkedCost = {
                id: 67,
                linkedCostCategories: [
                    {
                        id: 71,
                        opportunityCostPolicyCategoryId: 1373,
                        costAmountGbp: 6700,
                    },
                ],
                staffCosts: [
                    {
                        id: 3,
                        unnamedLabel: 'The unnamed student',
                        unnamedRoleId: 14,
                        opportunityCostCategoryId: 1373,
                        applicationCostId: 67,
                        ftePercentage: 67,
                        fullEconomicCostPence: 670000,
                        startDate: new Date('2023-08-01T00:00:00.000Z'),
                        endDate: new Date('2023-09-01T00:00:00.000Z'),
                    },
                    {
                        id: 2,
                        applicationPersonId: 1000167,
                        opportunityCostCategoryId: 1373,
                        applicationCostId: 67,
                        ftePercentage: 84,
                        fullEconomicCostPence: 250000000,
                        startDate: new Date('2023-07-01T00:00:00.000Z'),
                        endDate: new Date('2023-08-01T00:00:00.000Z'),
                    },
                    {
                        id: 1,
                        applicationPersonId: 1000168,
                        opportunityCostCategoryId: 1373,
                        applicationCostId: 67,
                        ftePercentage: 92,
                        fullEconomicCostPence: 100000000,
                        startDate: new Date('2023-07-01T00:00:00.000Z'),
                        endDate: new Date('2023-08-01T00:00:00.000Z'),
                    },
                ],
                organisationId: 1,
            };

            const costPolicyCategoryDictionary: CostPolicyCategoryDictionary = {
                '1373': { id: 1373, name: 'Staff', percentageValue: 75, parentId: 1364, sequence: 1 },
            };
            const totalCostOfStaffCategory = getCostFromLinkedCosts(linkedCost, 1373, costPolicyCategoryDictionary);

            expect(totalCostOfStaffCategory).to.equal(3506700);
        });

        it('should return undefined given there are no staff costs available', () => {
            const linkedCost: LinkedCost = {
                id: 67,
                linkedCostCategories: [],
                staffCosts: [],
                organisationId: 1,
            };

            const costPolicyCategoryDictionary: CostPolicyCategoryDictionary = {
                '1373': { id: 1373, name: 'Staff', percentageValue: 75, parentId: 1364, sequence: 1 },
            };
            const totalCostOfStaffCategory = getCostFromLinkedCosts(linkedCost, 1373, costPolicyCategoryDictionary);

            expect(totalCostOfStaffCategory).to.equal(undefined);
        });

        it('should get the staff cost totals in parent category given the staff cost totals differ from the cost category totals', () => {
            const linkedCost: LinkedCost = {
                id: 67,
                linkedCostCategories: [
                    {
                        id: 71,
                        opportunityCostPolicyCategoryId: 1373,
                        costAmountGbp: 6700,
                    },
                ],
                staffCosts: [
                    {
                        id: 3,
                        unnamedLabel: 'The unnamed student',
                        unnamedRoleId: 14,
                        opportunityCostCategoryId: 1373,
                        applicationCostId: 67,
                        ftePercentage: 67,
                        fullEconomicCostPence: 670000,
                        startDate: new Date('2023-08-01T00:00:00.000Z'),
                        endDate: new Date('2023-09-01T00:00:00.000Z'),
                    },
                    {
                        id: 2,
                        applicationPersonId: 1000167,
                        opportunityCostCategoryId: 1373,
                        applicationCostId: 67,
                        ftePercentage: 84,
                        fullEconomicCostPence: 250000000,
                        startDate: new Date('2023-07-01T00:00:00.000Z'),
                        endDate: new Date('2023-08-01T00:00:00.000Z'),
                    },
                    {
                        id: 1,
                        applicationPersonId: 1000168,
                        opportunityCostCategoryId: 1373,
                        applicationCostId: 67,
                        ftePercentage: 92,
                        fullEconomicCostPence: 100000000,
                        startDate: new Date('2023-07-01T00:00:00.000Z'),
                        endDate: new Date('2023-08-01T00:00:00.000Z'),
                    },
                ],
                organisationId: 1,
            };

            const costPolicyCategoryDictionary: CostPolicyCategoryDictionary = {
                '1373': { id: 1373, name: 'Staff', percentageValue: 75, parentId: 1364, sequence: 1 },
                '1364': { id: 1364, name: 'Exception', percentageValue: 80, parentId: undefined, sequence: 1 },
            };
            const parentCategoriesDictionary = { '1364': [1373] };
            const totalCostOfParentCategory = getCostFromLinkedCosts(
                linkedCost,
                1364,
                costPolicyCategoryDictionary,
                parentCategoriesDictionary,
            );

            expect(totalCostOfParentCategory).to.equal(3506700);
        });

        it('should get the correct values for parent categories', () => {
            const linkedCost: LinkedCost = {
                id: 67,
                linkedCostCategories: [
                    {
                        id: 71,
                        opportunityCostPolicyCategoryId: 1372,
                        costAmountGbp: 1000,
                    },
                    {
                        id: 71,
                        opportunityCostPolicyCategoryId: 1373,
                        costAmountGbp: 10000,
                    },
                ],
                staffCosts: [
                    {
                        id: 3,
                        unnamedLabel: 'The unnamed student',
                        unnamedRoleId: 14,
                        opportunityCostCategoryId: 1373,
                        applicationCostId: 67,
                        ftePercentage: 67,
                        fullEconomicCostPence: 1000000,
                        startDate: new Date('2023-08-01T00:00:00.000Z'),
                        endDate: new Date('2023-09-01T00:00:00.000Z'),
                    },
                ],
                organisationId: 1,
            };

            const costPolicyCategoryDictionary: CostPolicyCategoryDictionary = {
                '1372': { id: 1372, name: 'Equipment', percentageValue: 80, parentId: 1364, sequence: 1 },
                '1373': { id: 1373, name: 'Staff', percentageValue: 80, parentId: 1364, sequence: 2 },
                '1364': { id: 1364, name: 'Exception', percentageValue: 80, parentId: undefined, sequence: 1 },
            };
            const parentCategoriesDictionary = { '1364': [1372, 1373] };
            const totalCostOfParentCategory = getCostFromLinkedCosts(
                linkedCost,
                1364,
                costPolicyCategoryDictionary,
                parentCategoriesDictionary,
            );

            expect(totalCostOfParentCategory).to.equal(11000);
        });
    });

    describe('getTotalAppliedForPerOrganisation', () => {
        it('should get total applied for given an organisation is provided', () => {
            const linkedCost: LinkedCost = {
                id: 67,
                linkedCostCategories: [
                    {
                        id: 72,
                        opportunityCostPolicyCategoryId: 1371,
                        costAmountGbp: 1250,
                    },
                    {
                        id: 71,
                        opportunityCostPolicyCategoryId: 1373,
                        costAmountGbp: 155250, //should be ignored as it has a staff cost
                    },
                    {
                        id: 73,
                        opportunityCostPolicyCategoryId: 1374,
                        costAmountGbp: 1000, //has 100% as it's exception
                    },
                    {
                        id: 74,
                        opportunityCostPolicyCategoryId: 1372,
                        costAmountGbp: 1250,
                    },
                ],
                staffCosts: [
                    {
                        id: 3,
                        unnamedLabel: 'The unnamed student',
                        unnamedRoleId: 14,
                        opportunityCostCategoryId: 1373,
                        applicationCostId: 67,
                        ftePercentage: 67,
                        fullEconomicCostPence: 125000,
                        startDate: new Date('2023-08-01T00:00:00.000Z'),
                        endDate: new Date('2023-09-01T00:00:00.000Z'),
                    },
                ],
                organisationId: 1,
            };

            const parentCategoriesDictionary: ParentCategoriesDictionary = {
                '1364': [1373, 1371, 1374],
                '1363': [1372],
            };

            const costPolicyCategoryDictionary: CostPolicyCategoryDictionary = {
                '1364': { id: 1364, name: 'Exceptions', percentageValue: 80, parentId: undefined, sequence: 0 },
                '1373': { id: 1373, name: 'Staff', percentageValue: 80, parentId: 1364, sequence: 1 },
                '1371': { id: 1371, name: 'Estates', percentageValue: 80, parentId: 1364, sequence: 1 },
                '1374': { id: 1374, name: 'Other', percentageValue: 100, parentId: 1364, sequence: 1 },
                '1363': { id: 1363, name: 'Indirect', percentageValue: 80, parentId: undefined, sequence: 0 },
                '1372': { id: 1372, name: 'Indirect costs', percentageValue: 80, parentId: 1363, sequence: 1 },
            };

            const costPolicyCategoryTrees: OpportunityCostPolicyCategoryTree[] = [
                {
                    id: 1364,
                    name: 'Exceptions',
                    sequence: 1,
                    percentageValue: 80,
                    children: [
                        {
                            id: 1373,
                            name: 'Staff',
                            sequence: 1,
                            percentageValue: 80,
                            children: [],
                        },
                        {
                            id: 1371,
                            name: 'Estates',
                            sequence: 2,
                            percentageValue: 80,
                            children: [],
                        },
                        {
                            id: 1374,
                            name: 'Other',
                            sequence: 3,
                            percentageValue: 100,
                            children: [],
                        },
                    ],
                },
                {
                    id: 1363,
                    name: 'Indirect',
                    sequence: 3,
                    percentageValue: 80,
                    children: [
                        {
                            id: 1372,
                            name: 'Indirect costs',
                            sequence: 1,
                            percentageValue: 80,
                            children: [],
                        },
                    ],
                },
            ];

            const totalAppliedFor = getTotalAppliedForPerOrganisation(
                linkedCost,
                parentCategoriesDictionary,
                costPolicyCategoryDictionary,
                costPolicyCategoryTrees,
            );

            expect(totalAppliedFor).to.equal(4000);
        });

        it('should get total applied for with just one staff cost', () => {
            const linkedCost: LinkedCost = {
                id: 67,
                linkedCostCategories: [],
                staffCosts: [
                    {
                        id: 3,
                        unnamedLabel: 'The unnamed student',
                        unnamedRoleId: 14,
                        opportunityCostCategoryId: 1373,
                        applicationCostId: 67,
                        ftePercentage: 67,
                        fullEconomicCostPence: 125000,
                        startDate: new Date('2023-08-01T00:00:00.000Z'),
                        endDate: new Date('2023-09-01T00:00:00.000Z'),
                    },
                ],
                organisationId: 1,
            };

            const parentCategoriesDictionary: ParentCategoriesDictionary = {
                '1364': [1373, 1371, 1374],
                '1363': [1372],
            };

            const costPolicyCategoryDictionary: CostPolicyCategoryDictionary = {
                '1364': { id: 1364, name: 'Exceptions', percentageValue: 80, parentId: undefined, sequence: 0 },
                '1373': { id: 1373, name: 'Staff', percentageValue: 80, parentId: 1364, sequence: 1 },
                '1371': { id: 1371, name: 'Estates', percentageValue: 80, parentId: 1364, sequence: 1 },
                '1374': { id: 1374, name: 'Other', percentageValue: 100, parentId: 1364, sequence: 1 },
                '1363': { id: 1363, name: 'Indirect', percentageValue: 80, parentId: undefined, sequence: 0 },
                '1372': { id: 1372, name: 'Indirect costs', percentageValue: 80, parentId: 1363, sequence: 1 },
            };

            const costPolicyCategoryTrees: OpportunityCostPolicyCategoryTree[] = [
                {
                    id: 1364,
                    name: 'Exceptions',
                    sequence: 1,
                    percentageValue: 80,
                    children: [
                        {
                            id: 1373,
                            name: 'Staff',
                            sequence: 1,
                            percentageValue: 80,
                            children: [],
                        },
                        {
                            id: 1371,
                            name: 'Estates',
                            sequence: 2,
                            percentageValue: 80,
                            children: [],
                        },
                        {
                            id: 1374,
                            name: 'Other',
                            sequence: 3,
                            percentageValue: 100,
                            children: [],
                        },
                    ],
                },
                {
                    id: 1363,
                    name: 'Indirect',
                    sequence: 3,
                    percentageValue: 80,
                    children: [
                        {
                            id: 1372,
                            name: 'Indirect costs',
                            sequence: 1,
                            percentageValue: 80,
                            children: [],
                        },
                    ],
                },
            ];

            const totalAppliedFor = getTotalAppliedForPerOrganisation(
                linkedCost,
                parentCategoriesDictionary,
                costPolicyCategoryDictionary,
                costPolicyCategoryTrees,
            );

            expect(totalAppliedFor).to.equal(1000);
        });

        it('should return undefined if no costs are stored', () => {
            const linkedCost: LinkedCost = {
                id: 67,
                linkedCostCategories: [],
                staffCosts: [],
                organisationId: 1,
            };

            const parentCategoriesDictionary: ParentCategoriesDictionary = {
                '1364': [1373, 1371, 1374],
                '1363': [1372],
            };

            const costPolicyCategoryDictionary: CostPolicyCategoryDictionary = {
                '1364': { id: 1364, name: 'Exceptions', percentageValue: 80, parentId: undefined, sequence: 0 },
                '1373': { id: 1373, name: 'Staff', percentageValue: 80, parentId: 1364, sequence: 1 },
                '1371': { id: 1371, name: 'Estates', percentageValue: 80, parentId: 1364, sequence: 1 },
                '1374': { id: 1374, name: 'Other', percentageValue: 100, parentId: 1364, sequence: 1 },
                '1363': { id: 1363, name: 'Indirect', percentageValue: 80, parentId: undefined, sequence: 0 },
                '1372': { id: 1372, name: 'Indirect costs', percentageValue: 80, parentId: 1363, sequence: 1 },
            };

            const costPolicyCategoryTrees: OpportunityCostPolicyCategoryTree[] = [
                {
                    id: 1364,
                    name: 'Exceptions',
                    sequence: 1,
                    percentageValue: 80,
                    children: [
                        {
                            id: 1373,
                            name: 'Staff',
                            sequence: 1,
                            percentageValue: 80,
                            children: [],
                        },
                        {
                            id: 1371,
                            name: 'Estates',
                            sequence: 2,
                            percentageValue: 80,
                            children: [],
                        },
                        {
                            id: 1374,
                            name: 'Other',
                            sequence: 3,
                            percentageValue: 100,
                            children: [],
                        },
                    ],
                },
                {
                    id: 1363,
                    name: 'Indirect',
                    sequence: 3,
                    percentageValue: 80,
                    children: [
                        {
                            id: 1372,
                            name: 'Indirect costs',
                            sequence: 1,
                            percentageValue: 80,
                            children: [],
                        },
                    ],
                },
            ];

            const totalAppliedFor = getTotalAppliedForPerOrganisation(
                linkedCost,
                parentCategoriesDictionary,
                costPolicyCategoryDictionary,
                costPolicyCategoryTrees,
            );

            expect(totalAppliedFor).to.equal(undefined);
        });
    });

    describe('getTotalAppliedForPerApplication', () => {
        it('should get total applied for all organisations', () => {
            const linkedCost: LinkedCost[] = [
                {
                    id: 67,
                    linkedCostCategories: [
                        {
                            id: 72,
                            opportunityCostPolicyCategoryId: 1371,
                            costAmountGbp: 1250,
                        },
                        {
                            id: 71,
                            opportunityCostPolicyCategoryId: 1373,
                            costAmountGbp: 155250, //should be ignored as it has a staff cost
                        },
                        {
                            id: 73,
                            opportunityCostPolicyCategoryId: 1374,
                            costAmountGbp: 1000, //has 100% as it's exception
                        },
                        {
                            id: 74,
                            opportunityCostPolicyCategoryId: 1372,
                            costAmountGbp: 1250,
                        },
                    ],
                    staffCosts: [
                        {
                            id: 3,
                            unnamedLabel: 'The unnamed student',
                            unnamedRoleId: 14,
                            opportunityCostCategoryId: 1373,
                            applicationCostId: 67,
                            ftePercentage: 67,
                            fullEconomicCostPence: 125000,
                            startDate: new Date('2023-08-01T00:00:00.000Z'),
                            endDate: new Date('2023-09-01T00:00:00.000Z'),
                        },
                    ],
                    organisationId: 1,
                },
                {
                    id: 68,
                    linkedCostCategories: [
                        {
                            id: 75,
                            opportunityCostPolicyCategoryId: 1371,
                            costAmountGbp: 1250,
                        },
                        {
                            id: 76,
                            opportunityCostPolicyCategoryId: 1373,
                            costAmountGbp: 155250, //should be ignored as it has a staff cost
                        },
                        {
                            id: 77,
                            opportunityCostPolicyCategoryId: 1374,
                            costAmountGbp: 2000, //has 100% as it's exception
                        },
                        {
                            id: 78,
                            opportunityCostPolicyCategoryId: 1372,
                            costAmountGbp: 1250,
                        },
                    ],
                    staffCosts: [
                        {
                            id: 4,
                            unnamedLabel: 'The unnamed person',
                            unnamedRoleId: 14,
                            opportunityCostCategoryId: 1373,
                            applicationCostId: 68,
                            ftePercentage: 67,
                            fullEconomicCostPence: 125000,
                            startDate: new Date('2023-08-01T00:00:00.000Z'),
                            endDate: new Date('2023-09-01T00:00:00.000Z'),
                        },
                    ],
                    organisationId: 2,
                },
            ];

            const parentCategoriesDictionary: ParentCategoriesDictionary = {
                '1364': [1373, 1371, 1374],
                '1363': [1372],
            };

            const costPolicyCategoryDictionary: CostPolicyCategoryDictionary = {
                '1364': { id: 1364, name: 'Exceptions', percentageValue: 80, parentId: undefined, sequence: 0 },
                '1373': { id: 1373, name: 'Staff', percentageValue: 80, parentId: 1364, sequence: 1 },
                '1371': { id: 1371, name: 'Estates', percentageValue: 80, parentId: 1364, sequence: 1 },
                '1374': { id: 1374, name: 'Other', percentageValue: 100, parentId: 1364, sequence: 1 },
                '1363': { id: 1363, name: 'Indirect', percentageValue: 80, parentId: undefined, sequence: 0 },
                '1372': { id: 1372, name: 'Indirect costs', percentageValue: 80, parentId: 1363, sequence: 1 },
            };

            const costPolicyCategoryTrees: OpportunityCostPolicyCategoryTree[] = [
                {
                    id: 1364,
                    name: 'Exceptions',
                    sequence: 1,
                    percentageValue: 80,
                    children: [
                        {
                            id: 1373,
                            name: 'Staff',
                            sequence: 1,
                            percentageValue: 80,
                            children: [],
                        },
                        {
                            id: 1371,
                            name: 'Estates',
                            sequence: 2,
                            percentageValue: 80,
                            children: [],
                        },
                        {
                            id: 1374,
                            name: 'Other',
                            sequence: 3,
                            percentageValue: 100,
                            children: [],
                        },
                    ],
                },
                {
                    id: 1363,
                    name: 'Indirect',
                    sequence: 3,
                    percentageValue: 80,
                    children: [
                        {
                            id: 1372,
                            name: 'Indirect costs',
                            sequence: 1,
                            percentageValue: 80,
                            children: [],
                        },
                    ],
                },
            ];

            const totalAppliedFor = getTotalAppliedForPerApplication(
                linkedCost,
                parentCategoriesDictionary,
                costPolicyCategoryDictionary,
                costPolicyCategoryTrees,
            );

            expect(totalAppliedFor).to.equal(9000);
        });
        it('should total partially entered organisations', () => {
            const linkedCost: LinkedCost[] = [
                {
                    id: 67,
                    linkedCostCategories: [],
                    staffCosts: [],
                    organisationId: 1,
                },
                {
                    id: 68,
                    linkedCostCategories: [
                        {
                            id: 75,
                            opportunityCostPolicyCategoryId: 1371,
                            costAmountGbp: 1250,
                        },
                        {
                            id: 76,
                            opportunityCostPolicyCategoryId: 1373,
                            costAmountGbp: 155250, //should be ignored as it has a staff cost
                        },
                        {
                            id: 77,
                            opportunityCostPolicyCategoryId: 1374,
                            costAmountGbp: 2000, //has 100% as it's exception
                        },
                        {
                            id: 78,
                            opportunityCostPolicyCategoryId: 1372,
                            costAmountGbp: 1250,
                        },
                    ],
                    staffCosts: [
                        {
                            id: 4,
                            unnamedLabel: 'The unnamed person',
                            unnamedRoleId: 14,
                            opportunityCostCategoryId: 1373,
                            applicationCostId: 68,
                            ftePercentage: 67,
                            fullEconomicCostPence: 125000,
                            startDate: new Date('2023-08-01T00:00:00.000Z'),
                            endDate: new Date('2023-09-01T00:00:00.000Z'),
                        },
                    ],
                    organisationId: 2,
                },
            ];

            const parentCategoriesDictionary: ParentCategoriesDictionary = {
                '1364': [1373, 1371, 1374],
                '1363': [1372],
            };

            const costPolicyCategoryDictionary: CostPolicyCategoryDictionary = {
                '1364': { id: 1364, name: 'Exceptions', percentageValue: 80, parentId: undefined, sequence: 0 },
                '1373': { id: 1373, name: 'Staff', percentageValue: 80, parentId: 1364, sequence: 1 },
                '1371': { id: 1371, name: 'Estates', percentageValue: 80, parentId: 1364, sequence: 1 },
                '1374': { id: 1374, name: 'Other', percentageValue: 100, parentId: 1364, sequence: 1 },
                '1363': { id: 1363, name: 'Indirect', percentageValue: 80, parentId: undefined, sequence: 0 },
                '1372': { id: 1372, name: 'Indirect costs', percentageValue: 80, parentId: 1363, sequence: 1 },
            };

            const costPolicyCategoryTrees: OpportunityCostPolicyCategoryTree[] = [
                {
                    id: 1364,
                    name: 'Exceptions',
                    sequence: 1,
                    percentageValue: 80,
                    children: [
                        {
                            id: 1373,
                            name: 'Staff',
                            sequence: 1,
                            percentageValue: 80,
                            children: [],
                        },
                        {
                            id: 1371,
                            name: 'Estates',
                            sequence: 2,
                            percentageValue: 80,
                            children: [],
                        },
                        {
                            id: 1374,
                            name: 'Other',
                            sequence: 3,
                            percentageValue: 100,
                            children: [],
                        },
                    ],
                },
                {
                    id: 1363,
                    name: 'Indirect',
                    sequence: 3,
                    percentageValue: 80,
                    children: [
                        {
                            id: 1372,
                            name: 'Indirect costs',
                            sequence: 1,
                            percentageValue: 80,
                            children: [],
                        },
                    ],
                },
            ];

            const totalAppliedFor = getTotalAppliedForPerApplication(
                linkedCost,
                parentCategoriesDictionary,
                costPolicyCategoryDictionary,
                costPolicyCategoryTrees,
            );

            expect(totalAppliedFor).to.equal(5000);
        });
        it('should return undefined for no entered costs', () => {
            const linkedCost: LinkedCost[] = [
                {
                    id: 67,
                    linkedCostCategories: [],
                    staffCosts: [],
                    organisationId: 1,
                },
                {
                    id: 68,
                    linkedCostCategories: [],
                    staffCosts: [],
                    organisationId: 2,
                },
            ];

            const parentCategoriesDictionary: ParentCategoriesDictionary = {
                '1364': [1373, 1371, 1374],
                '1363': [1372],
            };

            const costPolicyCategoryDictionary: CostPolicyCategoryDictionary = {
                '1364': { id: 1364, name: 'Exceptions', percentageValue: 80, parentId: undefined, sequence: 0 },
                '1373': { id: 1373, name: 'Staff', percentageValue: 80, parentId: 1364, sequence: 1 },
                '1371': { id: 1371, name: 'Estates', percentageValue: 80, parentId: 1364, sequence: 1 },
                '1374': { id: 1374, name: 'Other', percentageValue: 100, parentId: 1364, sequence: 1 },
                '1363': { id: 1363, name: 'Indirect', percentageValue: 80, parentId: undefined, sequence: 0 },
                '1372': { id: 1372, name: 'Indirect costs', percentageValue: 80, parentId: 1363, sequence: 1 },
            };

            const costPolicyCategoryTrees: OpportunityCostPolicyCategoryTree[] = [
                {
                    id: 1364,
                    name: 'Exceptions',
                    sequence: 1,
                    percentageValue: 80,
                    children: [
                        {
                            id: 1373,
                            name: 'Staff',
                            sequence: 1,
                            percentageValue: 80,
                            children: [],
                        },
                        {
                            id: 1371,
                            name: 'Estates',
                            sequence: 2,
                            percentageValue: 80,
                            children: [],
                        },
                        {
                            id: 1374,
                            name: 'Other',
                            sequence: 3,
                            percentageValue: 100,
                            children: [],
                        },
                    ],
                },
                {
                    id: 1363,
                    name: 'Indirect',
                    sequence: 3,
                    percentageValue: 80,
                    children: [
                        {
                            id: 1372,
                            name: 'Indirect costs',
                            sequence: 1,
                            percentageValue: 80,
                            children: [],
                        },
                    ],
                },
            ];

            const totalAppliedFor = getTotalAppliedForPerApplication(
                linkedCost,
                parentCategoriesDictionary,
                costPolicyCategoryDictionary,
                costPolicyCategoryTrees,
            );

            expect(totalAppliedFor).to.equal(undefined);
        });
    });

    describe('generateOrganisationDictionary', () => {
        const applicants = [
            {
                id: 1,
                applicationPersonId: 123,
                role: '',
                name: 'Jhon',
                email: 'jhon@example.com',
                organisationId: 1,
                organisationName: 'Org A',
            },
            {
                id: 2,
                applicationPersonId: 124,
                name: 'Jane',
                email: 'jane@example.com',
                role: 'Developer',
                organisationId: 2,
                organisationName: 'Org B',
            },
        ];

        const linkedCosts = [
            {
                id: 1,
                organisationId: 2,
                organisation: { id: 2, name: 'Org B', city: 'Newciry', country: 'country' },
            },
            { id: 2, organisationId: 3, organisation: { id: 3, name: 'Org C', city: 'Newciry', country: 'country' } },
        ];
        const structuredCosts: StructuredCosts = {
            costPolicyCategoryTrees: [],
            costPolicyCategories: [],
            linkedCosts: linkedCosts,
            applicants: applicants,
            policyRoles: [],
            breakdownUrl: '',
            justification: null,
            disableBreakdown: true,
        };
        beforeEach(() => {
            // Reset data before each test
        });

        it('should create a dictionary from applicants if linkedCosts is empty', () => {
            const result = generateOrganisationDictionary({ ...structuredCosts, linkedCosts: [] });
            const expected: OrganisationDictionary = {
                '1': 'Org A',
                '2': 'Org B',
            };
            expect(result).to.deep.equal(expected);
        });

        it('should combine dictionaries from applicants and linkedCosts without duplicates', () => {
            const result = generateOrganisationDictionary({ ...structuredCosts });
            const expected: OrganisationDictionary = {
                '1': 'Org A', // From applicants
                '2': 'Org B', // Overwritten by linkedCosts
                '3': 'Org C', // From linkedCosts
            };
            expect(result).to.deep.equal(expected);
        });

        it('should handle a case where there are no applicants', () => {
            const result = generateOrganisationDictionary({ ...structuredCosts, applicants: [] });
            const expected: OrganisationDictionary = {
                '2': 'Org B',
                '3': 'Org C',
            };
            expect(result).to.deep.equal(expected);
        });

        it('should return an empty dictionary if both applicants and linkedCosts are empty', () => {
            const result = generateOrganisationDictionary({ ...structuredCosts, applicants: [], linkedCosts: [] });
            const expected: OrganisationDictionary = {};
            expect(result).to.deep.equal(expected);
        });

        it('should ignore linkedCost items with undefined organisationId or organisation', () => {
            structuredCosts.linkedCosts = [
                { id: 3, organisationId: 1 },
                { id: 4, organisationId: 4 },
            ];

            const result = generateOrganisationDictionary({ ...structuredCosts });
            const expected: OrganisationDictionary = {
                '1': 'Org A',
                '2': 'Org B',
            };
            expect(result).to.deep.equal(expected);
        });
    });

    describe('displayValueInUKPoundsOrDash', function () {
        it('should return thousand separated value in pounds given value is not undefined', function () {
            expect(displayValueInUKPoundsOrDash(1000000000000)).to.equal('£1,000,000,000,000');
        });

        it('should return a dash given value is undefined', function () {
            expect(displayValueInUKPoundsOrDash(undefined)).to.equal('-');
        });

        it('should return a conventionally rounded value in pounds given value is in decimals', function () {
            expect(displayValueInUKPoundsOrDash(100.5534454)).to.equal('£101');
        });
    });

    describe('displayValueWithPencesOrDash', function () {
        it('should return thousand separated value in pounds given value is not undefined', function () {
            expect(displayValueWithPencesOrDash(1000000000000)).to.equal('£1,000,000,000,000.00');
        });

        it('should return a dash given value is undefined', function () {
            expect(displayValueWithPencesOrDash(undefined)).to.equal('-');
        });

        it('should return a conventionally rounded value to the nearest pence given value is in decimals', function () {
            expect(displayValueWithPencesOrDash(100.5534454)).to.equal('£100.55');
        });

        it('should round to two decimal places when given a one decimal place number', function () {
            expect(displayValueWithPencesOrDash(100.4)).to.equal('£100.40');
        });
    });
});
