import { DateTimeFormat, getHumanisedDate, localMoment } from '@ukri-tfs/time';
import {
    LinkedCost,
    OpportunityCostPolicyCategory,
    OpportunityCostPolicyCategoryTree,
    PolicyRole,
    StaffCost,
    StaffPerson,
    StructuredCosts,
} from '../tfs';
import { displayCurrencyWithDecimals, displayCurrencyWithoutDecimals } from './currency';

export interface TfsApplicationStructuredCostsSectionProps {
    id: string;
    structuredCosts: StructuredCosts;
}

export const checkIsUnnamedStaff = (staffCost: StaffCost): boolean => {
    return Boolean(!staffCost.applicationPersonId && (staffCost.unnamedLabel || staffCost.unnamedRoleId));
};

export const isAStaffCostCategory = (
    id: number,
    costPolicyCategoryDictionary: CostPolicyCategoryDictionary,
): boolean => {
    return costPolicyCategoryDictionary[id]?.name === 'Staff';
};

export type StaffDictionary = { [id: string]: StaffPerson };
export type RoleDictionary = { [id: string]: PolicyRole };
export type CostPolicyCategoryDictionary = { [id: string]: OpportunityCostPolicyCategory };
export type OrganisationDictionary = { [id: string]: string };
export type ParentCategoriesDictionary = { [id: string]: number[] };
export type StructuredCostRow = Omit<OpportunityCostPolicyCategoryTree, 'children'> & {
    level: number;
    staffCost?: StaffCost;
    isLastChildOfParent: boolean;
    categoryParentLabel?: string;
};

export type StructuredCostRowFunction = (item: StructuredCostRow) => string;
export type GetCategoryReturnType = (costPolicyCategory: StructuredCostRow) => string;

export type GetFullCostFunction = (costPolicyCategory: StructuredCostRow) => string;
export type TotalAppliedForFunction = (costPolicyCategory: StructuredCostRow) => string;

export const generateStaffDictionary = (staffPeople: StaffPerson[]): StaffDictionary => {
    return staffPeople.reduce((builtStaffDictionary, applicant) => {
        return {
            ...builtStaffDictionary,
            [`${applicant.applicationPersonId}`]: applicant,
        };
    }, {} as StaffDictionary);
};

export const generateOrganisationDictionary = (structuredCosts: StructuredCosts): OrganisationDictionary => {
    const applicants: StaffPerson[] = structuredCosts.applicants;
    const linkedCosts = structuredCosts.linkedCosts;
    const applicantDictionary = applicants.reduce((buildOrganisationDictionary, applicant) => {
        return {
            ...buildOrganisationDictionary,
            [`${applicant.organisationId}`]: applicant.organisationName,
        };
    }, {});
    // If linkedCosts is undefined or null, return the applicant dictionary
    if (linkedCosts.length === 0) {
        return applicantDictionary;
    }

    // Create the dictionary from linkedCosts only if there is organisation avaialble
    const linkedCostDictionary = linkedCosts.reduce((dict, linkedCost) => {
        if (linkedCost.organisationId && linkedCost.organisation) {
            return {
                ...dict,
                [`${linkedCost.organisationId}`]: linkedCost.organisation.name,
            };
        }
        return dict;
    }, {} as OrganisationDictionary);

    // Combine both dictionaries
    return {
        ...applicantDictionary,
        ...linkedCostDictionary, // linkedCostDictionary will overwrite keys from applicantDictionary if they match
    };
};

export const generateRoleDictionary = (policyRoles: PolicyRole[]): RoleDictionary => {
    return policyRoles.reduce((builtRoleDictionary, policyRole) => {
        return {
            ...builtRoleDictionary,
            [policyRole.id]: policyRole,
        };
    }, {} as RoleDictionary);
};

export function generateCostPolicyCategoryDictionary(
    costPolicyCategories: OpportunityCostPolicyCategory[],
): CostPolicyCategoryDictionary {
    return costPolicyCategories.reduce((dictionary, costPolicyCategory) => {
        return {
            ...dictionary,
            [costPolicyCategory.id!]: costPolicyCategory,
        };
    }, {} as { [k: string]: OpportunityCostPolicyCategory });
}

export const generateParentCategoriesDictionary = (
    costPolicySubCategory: OpportunityCostPolicyCategoryTree[],
): ParentCategoriesDictionary => {
    return costPolicySubCategory.reduce((dictionary, costPolicy) => {
        const children = costPolicy.children.map(child => {
            return child.id!;
        });

        return { ...dictionary, [`${costPolicy.id}`]: children };
    }, {} as ParentCategoriesDictionary);
};

export const calculateSubCategoryTotal = (
    costPolicySubCategory: OpportunityCostPolicyCategoryTree,
    linkedCosts: LinkedCost[],
): string => {
    const matchingLinkedCostCategories = linkedCosts.flatMap(linkedCost =>
        linkedCost.linkedCostCategories?.filter(
            linkedCostCategory => linkedCostCategory.opportunityCostPolicyCategoryId === costPolicySubCategory.id,
        ),
    );

    if (matchingLinkedCostCategories.length === 0) {
        return '-';
    }

    const total = matchingLinkedCostCategories.reduce(
        (acc, linkedCostCategory) => acc + (linkedCostCategory?.costAmountGbp ?? 0),
        0,
    );
    const appliedFor = total * ((costPolicySubCategory.percentageValue ?? 1) / 100);
    return displayValueWithPences(appliedFor);
};

export const recursiveFlattenedOpportunityCostPolicyCategoryTree = (
    opportunityCostPolicyCategoryTree: OpportunityCostPolicyCategoryTree,
    staffCosts: StaffCost[],
    currentLevel = 0,
    categoryParentLabel: string | undefined = undefined,
    lastOfSubCategory = false,
): StructuredCostRow[] => {
    let mappedStaffCosts: StructuredCostRow[] = [];

    const { children, ...opportunityCostPolicyCategoryTreeWithoutChildren } = opportunityCostPolicyCategoryTree;

    const lengthOfChildren = children.length;

    const categoryCurrentLabel = categoryParentLabel
        ? `${categoryParentLabel} ${opportunityCostPolicyCategoryTreeWithoutChildren.name}`
        : opportunityCostPolicyCategoryTreeWithoutChildren.name;

    children.sort((a, b) => {
        return parseInt(`${a.sequence}`) - parseInt(`${b.sequence}`);
    });

    const flattenedCostPolicyCategory: StructuredCostRow = {
        ...opportunityCostPolicyCategoryTreeWithoutChildren,
        level: currentLevel,
        isLastChildOfParent: lastOfSubCategory,
        categoryParentLabel,
    };

    if (flattenedCostPolicyCategory.name === 'Staff' && staffCosts.length) {
        mappedStaffCosts = staffCosts
            .filter(staffCost => staffCost.opportunityCostCategoryId === flattenedCostPolicyCategory.id)
            .map((staffCost, idx) => {
                return {
                    id: staffCost.id,
                    name: undefined,
                    level: currentLevel + 1,
                    sequence: idx + 1,
                    percentageValue: flattenedCostPolicyCategory.percentageValue,
                    staffCost,
                    isLastChildOfParent: false,
                    categoryParentLabel: `${categoryCurrentLabel}`,
                };
            });
    }

    return [
        flattenedCostPolicyCategory,
        ...mappedStaffCosts,
        ...children.flatMap((child, idx) => {
            const isLastOfParent = idx === lengthOfChildren - 1;
            return recursiveFlattenedOpportunityCostPolicyCategoryTree(
                child,
                staffCosts,
                currentLevel + 1,
                categoryCurrentLabel,
                isLastOfParent,
            );
        }),
    ];
};

const displayValueInUKPounds = (value: number): string => {
    return displayCurrencyWithoutDecimals(Math.round(value), true);
};

export const displayValueWithPences = (value: number): string => {
    return displayCurrencyWithDecimals(value, true);
};

export const displayValueInUKPoundsOrDash = (value: number | undefined): string => {
    return value !== undefined ? displayValueInUKPounds(value) : '-';
};

export const displayValueWithPencesOrDash = (value: number | undefined): string => {
    return value !== undefined ? displayValueWithPences(value) : '-';
};

export const getStaffNameByStaffCost = (
    staffCost: StaffCost,
    staffDictionary: StaffDictionary,
    roleDictionary: RoleDictionary,
): string => {
    const isUnnamedStaff = !staffCost.applicationPersonId;

    if (!isUnnamedStaff) {
        return staffDictionary[staffCost.applicationPersonId!]?.name;
    }

    if (!staffCost.unnamedLabel) {
        return roleDictionary[staffCost.unnamedRoleId!].name;
    }

    return staffCost.unnamedLabel;
};

export const getCategory = (
    staffDictionary: StaffDictionary,
    roleDictionary: RoleDictionary,
): GetCategoryReturnType => {
    return (costPolicyCategory: StructuredCostRow) => {
        if (costPolicyCategory.name) {
            return costPolicyCategory.name;
        }

        return costPolicyCategory.staffCost
            ? getStaffNameByStaffCost(costPolicyCategory.staffCost, staffDictionary, roleDictionary)
            : '';
    };
};

export const getStaffRole = (
    roleDictionary: RoleDictionary,
    staffDictionary: StaffDictionary,
): StructuredCostRowFunction => {
    return (costPolicyCategory: StructuredCostRow): string => {
        const staffCost = costPolicyCategory.staffCost;

        if (staffCost) {
            if (staffCost?.unnamedRoleId !== undefined) {
                return roleDictionary[staffCost.unnamedRoleId]?.name ?? '';
            }
            return staffDictionary[staffCost!.applicationPersonId!].role ?? '';
        } else {
            return '';
        }
    };
};

export const getFTE = (costPolicyCategory: StructuredCostRow): string => {
    if (costPolicyCategory.staffCost) {
        return `${costPolicyCategory.staffCost!.ftePercentage!.toString()}%`;
    }
    return '';
};

export const getAverageHours = (costPolicyCategory: StructuredCostRow): string => {
    if (costPolicyCategory.staffCost?.ftePercentage) {
        return `${(37.5 * costPolicyCategory.staffCost?.ftePercentage) / 100}`;
    }
    return '';
};

export const getDate = (date: Date | undefined): string => {
    if (date) {
        return getHumanisedDate(date, DateTimeFormat.DayMonthYear);
    }
    return '';
};

export const getEndDate = (date: Date | undefined): string => {
    if (date) {
        const lastDateOfTheMonth = localMoment(date).endOf('month');
        const lastDate = new Date(lastDateOfTheMonth.toString());
        return getHumanisedDate(lastDate, DateTimeFormat.DayMonthYear);
    }
    return '';
};

export const getStaffCostsForCategory = (
    id: number | undefined,
    staffCosts: StaffCost[] | undefined,
): number | undefined => {
    return (staffCosts ?? [])
        .filter(staffCost => staffCost.opportunityCostCategoryId === id)
        .reduce((total, staffCost) => {
            return (total ?? 0) + (staffCost.fullEconomicCostPence ?? 0) / 100;
        }, undefined as undefined | number);
};

export const getCostFromLinkedCosts = (
    linkedCost: LinkedCost,
    id: number,
    costPolicyCategoryDictionary: CostPolicyCategoryDictionary,
    parentCostCategoryDictionary?: ParentCategoriesDictionary,
): number | undefined => {
    const linkedCostCategory = linkedCost.linkedCostCategories?.find(
        costCategory => costCategory.opportunityCostPolicyCategoryId === id,
    );
    const isStaffCostAndHasStaffCost = isAStaffCostCategory(id, costPolicyCategoryDictionary) && linkedCost.staffCosts;

    if (isStaffCostAndHasStaffCost) {
        return getStaffCostsForCategory(id, linkedCost.staffCosts);
    }

    if (linkedCostCategory) {
        return linkedCostCategory.costAmountGbp;
    }

    if (parentCostCategoryDictionary) {
        const costPolicyCategoryFilter = parentCostCategoryDictionary[`${id}`] ?? [];

        if (costPolicyCategoryFilter.length > 0) {
            const calculatedCost = linkedCost.linkedCostCategories
                ?.filter(costCategory =>
                    costPolicyCategoryFilter.includes(costCategory.opportunityCostPolicyCategoryId),
                )
                .reduce((total, { opportunityCostPolicyCategoryId, ...category }) => {
                    let categoryTotal = category.costAmountGbp;

                    if (isAStaffCostCategory(opportunityCostPolicyCategoryId!, costPolicyCategoryDictionary)) {
                        categoryTotal = getStaffCostsForCategory(
                            opportunityCostPolicyCategoryId!,
                            linkedCost.staffCosts,
                        );
                    }

                    return (total ?? 0) + (categoryTotal ?? 0);
                }, undefined as undefined | number);

            if (calculatedCost && calculatedCost > 0) {
                return calculatedCost;
            }
        }
    }

    return undefined;
};

type ListOfCategories = {
    id: number;
    total: number;
    percentage: number;
};

export const getFullCost =
    (
        linkedCost: LinkedCost,
        parentCostCategoryDictionary: ParentCategoriesDictionary,
        costPolicyCategoryDictionary: CostPolicyCategoryDictionary,
    ): GetFullCostFunction =>
    (costPolicyCategory: StructuredCostRow): string => {
        if (costPolicyCategory.staffCost?.fullEconomicCostPence) {
            return displayValueInUKPounds(costPolicyCategory.staffCost.fullEconomicCostPence / 100);
        }

        const fullCost = getCostFromLinkedCosts(
            linkedCost,
            costPolicyCategory.id!,
            costPolicyCategoryDictionary,
            parentCostCategoryDictionary,
        );

        return displayValueInUKPoundsOrDash(fullCost);
    };

export const getFEC = (costPolicyCategory: StructuredCostRow): string => {
    return `${costPolicyCategory.percentageValue}%`;
};

export const getFullCostForParentCategory = (
    idOfParentCategory: number,
    linkedCost: LinkedCost,
    parentCostCategoryDictionary: ParentCategoriesDictionary,
    costPolicyCategoryDictionary: CostPolicyCategoryDictionary,
): number | undefined => {
    const childrenCategories = parentCostCategoryDictionary[idOfParentCategory];

    // deal with basic example
    const totals: ListOfCategories[] | undefined = childrenCategories.reduce((returnValue, id) => {
        const total = getCostFromLinkedCosts(
            linkedCost,
            id,
            costPolicyCategoryDictionary,
            parentCostCategoryDictionary,
        );

        if (!total) {
            return returnValue;
        }

        return [
            ...(returnValue || []),
            {
                id,
                total,
                percentage: costPolicyCategoryDictionary[id].percentageValue!,
            },
        ];
    }, undefined as ListOfCategories[] | undefined);
    return totals?.reduce((total, currentTotal) => {
        return (total ?? 0) + (currentTotal.percentage * currentTotal.total) / 100;
    }, undefined as number | undefined);
};

export const getTotalAppliedFor =
    (
        linkedCost: LinkedCost,
        parentCostCategoryDictionary: ParentCategoriesDictionary,
        costPolicyCategoryDictionary: CostPolicyCategoryDictionary,
    ): TotalAppliedForFunction =>
    (costPolicyCategory: StructuredCostRow): string => {
        let fullCost: number | undefined;
        if (costPolicyCategory.staffCost?.fullEconomicCostPence && costPolicyCategory.percentageValue) {
            return displayValueWithPences(
                (costPolicyCategory.staffCost.fullEconomicCostPence / 100) * (costPolicyCategory.percentageValue / 100),
            );
        }

        if (parentCostCategoryDictionary && parentCostCategoryDictionary[costPolicyCategory.id ?? -1]) {
            const cost = getFullCostForParentCategory(
                costPolicyCategory.id!,
                linkedCost,
                parentCostCategoryDictionary,
                costPolicyCategoryDictionary,
            );
            if (cost) {
                return displayValueWithPences(cost);
            }
        } else {
            fullCost = getCostFromLinkedCosts(
                linkedCost,
                costPolicyCategory.id!,
                costPolicyCategoryDictionary,
                parentCostCategoryDictionary,
            );
        }

        if (fullCost !== undefined) {
            return displayValueWithPences((fullCost * costPolicyCategory.percentageValue!) / 100);
        }

        return '-';
    };

export const getTotalAppliedForPerOrganisation = (
    linkedCost: LinkedCost,
    parentCategoriesDictionary: ParentCategoriesDictionary,
    costPolicyCategoryDictionary: CostPolicyCategoryDictionary,
    costPolicyCategoryTrees: OpportunityCostPolicyCategoryTree[],
): number | undefined => {
    return costPolicyCategoryTrees.reduce((total: undefined | number, costPolicyCategory) => {
        const value = getFullCostForParentCategory(
            costPolicyCategory.id!,
            linkedCost,
            parentCategoriesDictionary,
            costPolicyCategoryDictionary,
        );
        return value === undefined ? total : (total ?? 0) + value;
    }, undefined);
};

export const getTotalAppliedForPerApplication = (
    linkedCosts: LinkedCost[],
    parentCategoriesDictionary: ParentCategoriesDictionary,
    costPolicyCategoryDictionary: CostPolicyCategoryDictionary,
    costPolicyCategoryTrees: OpportunityCostPolicyCategoryTree[],
): number | undefined => {
    return linkedCosts.reduce((total: number | undefined, linkedCost) => {
        const value = getTotalAppliedForPerOrganisation(
            linkedCost,
            parentCategoriesDictionary,
            costPolicyCategoryDictionary,
            costPolicyCategoryTrees,
        );
        return value === undefined ? total : (total ?? 0) + value;
    }, undefined);
};
