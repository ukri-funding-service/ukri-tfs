import React, { ReactElement } from 'react';
import { Column, GdsLink, HeadingText, LabelledValues, Paragraph, TypedTable } from '../../../components';
import {
    TfsApplicationStructuredCostsSectionProps,
    calculateSubCategoryTotal,
    generateCostPolicyCategoryDictionary,
    generateRoleDictionary,
    generateStaffDictionary,
    displayValueInUKPoundsOrDash,
    displayValueWithPencesOrDash,
} from '../../../helpers/structuredResourcesAndCosts';

import {
    LinkedCostCategory,
    OpportunityCostPolicyCategory,
    OpportunityCostPolicyCategoryTree,
    PolicyRole,
    StaffCost,
    StaffPerson,
    StructuredCosts,
} from '../types/applicationViewContent';

export const TfsApplicationStructuredCostsSection: React.FunctionComponent<TfsApplicationStructuredCostsSectionProps> =
    (props): JSX.Element => {
        const staffDictionary = generateStaffDictionary(props.structuredCosts.applicants);
        const roleDictionary = generateRoleDictionary(props.structuredCosts.policyRoles);

        const totalCosts = calculateTotalCosts(props.structuredCosts);

        return (
            <div id={props.id} className="serif">
                <LabelledValues
                    labelledValues={[
                        {
                            label: 'Total full economic costs (fEC)',
                            value: displayValueInUKPoundsOrDash(totalCosts.fEC),
                        },
                        {
                            label: 'Total contribution from applying organisation(s)',
                            value: displayValueWithPencesOrDash(totalCosts.totalContribution),
                        },
                        {
                            label: 'Total funding applied for',
                            value: displayValueWithPencesOrDash(totalCosts.totalAppliedFor),
                        },
                    ]}
                    alignTop={true}
                ></LabelledValues>
                {props.structuredCosts.costPolicyCategoryTrees.reduce((tables: ReactElement[], tree, index) => {
                    if (index === 0) {
                        return [
                            generateParentCategoryTable(roleDictionary, staffDictionary, props.structuredCosts, tree),
                        ];
                    } else {
                        return [
                            ...tables,
                            <>
                                {generateParentCategoryTable(
                                    roleDictionary,
                                    staffDictionary,
                                    props.structuredCosts,
                                    tree,
                                )}
                            </>,
                        ];
                    }
                }, [] as ReactElement[])}
                {!props.structuredCosts.disableBreakdown && (
                    <GdsLink testId="full-breakdown-url" href={props.structuredCosts.breakdownUrl}>
                        Full cost breakdown by organisation
                    </GdsLink>
                )}

                <HeadingText
                    className={'govuk-!-margin-top-9 serif'}
                    text={'Justification of resources'}
                    size={'s'}
                    tag={'h4'}
                ></HeadingText>
                <div
                    dangerouslySetInnerHTML={{
                        __html: props.structuredCosts.justification || 'Justification not provided',
                    }}
                ></div>
            </div>
        );
    };

type TotalObject = { fEC: number; totalAppliedFor: number; totalContribution: number };

const calculateTotalCosts = (structuredCosts: StructuredCosts): TotalObject => {
    const staffCostCategories = structuredCosts.costPolicyCategories
        .filter(category => category.name === 'Staff')
        .map(({ id }) => id!);
    const costPolicyCategoryDictionary = generateCostPolicyCategoryDictionary(structuredCosts.costPolicyCategories);
    const flatLinkedCosts = structuredCosts.linkedCosts.flatMap(linkedCost => linkedCost.linkedCostCategories ?? []);
    const flatStaffCosts = structuredCosts.linkedCosts.flatMap(linkedCost => linkedCost.staffCosts ?? []);
    const totalFromLinkedCosts = getTotalsWithoutStaff(
        flatLinkedCosts,
        staffCostCategories,
        costPolicyCategoryDictionary,
    );
    return addStaffCostsToTotals(flatStaffCosts, costPolicyCategoryDictionary, totalFromLinkedCosts);
};

function addStaffCostsToTotals(
    flatStaffCosts: StaffCost[],
    costPolicyCategoryDictionary: { [k: string]: OpportunityCostPolicyCategory },
    totalFromLinkedCosts: TotalObject,
): TotalObject {
    return flatStaffCosts.reduce((totalObject, staffCost) => {
        const percentage = costPolicyCategoryDictionary[staffCost.opportunityCostCategoryId!].percentageValue ?? 0;

        const totalFEC = (staffCost.fullEconomicCostPence ?? 0) / 100;
        const totalAppliedForForCategory = totalFEC * (percentage / 100);
        const totalContributionForCategory = totalFEC - totalAppliedForForCategory;

        totalObject.fEC += totalFEC;
        totalObject.totalAppliedFor += totalAppliedForForCategory;
        totalObject.totalContribution += totalContributionForCategory;

        return totalObject;
    }, totalFromLinkedCosts);
}

function getTotalsWithoutStaff(
    flatLinkedCosts: LinkedCostCategory[],
    staffCostCategories: number[],
    costPolicyCategoryDictionary: { [k: string]: OpportunityCostPolicyCategory },
) {
    return flatLinkedCosts
        .filter(category => !staffCostCategories.includes(category.opportunityCostPolicyCategoryId))
        .reduce(
            (totalObject, currentCategory) => {
                const percentage =
                    costPolicyCategoryDictionary[currentCategory.opportunityCostPolicyCategoryId].percentageValue ?? 0;
                const fEC = currentCategory.costAmountGbp ?? 0;
                const totalAppliedFor = fEC * (percentage / 100);

                return {
                    fEC: totalObject.fEC + fEC,
                    totalAppliedFor: totalObject.totalAppliedFor + totalAppliedFor,
                    totalContribution: totalObject.totalContribution + fEC - totalAppliedFor,
                };
            },
            {
                fEC: 0,
                totalAppliedFor: 0,
                totalContribution: 0,
            } as TotalObject,
        );
}

interface StaffTableRow {
    staffName: string;
    staffRole: string;
    staffFTE: string;
}

interface CategoryTableRow {
    category: string;
    fundingAppliedFor: string;
}

function generateParentCategoryTable(
    roleDictionary: { [id: string]: PolicyRole },
    staffDictionary: { [id: string]: StaffPerson },
    structuredCosts: StructuredCosts,
    costPolicyCategory: OpportunityCostPolicyCategoryTree,
) {
    const SubCategoryTable = TypedTable<CategoryTableRow>();
    const StaffTable = TypedTable<StaffTableRow>();

    const getStaffForCategory = (category: OpportunityCostPolicyCategoryTree): StaffTableRow[] => {
        return structuredCosts.linkedCosts
            .flatMap(
                linkedCost =>
                    linkedCost.staffCosts?.filter(staffCost => staffCost.opportunityCostCategoryId === category.id) ??
                    [],
            )
            .map(staffCost => {
                let name;
                let role;
                if (staffCost.applicationPersonId) {
                    const staffPerson = staffDictionary[staffCost.applicationPersonId];
                    name = staffPerson.name;
                    role = staffPerson.role ?? 'No role assigned';
                } else {
                    role = roleDictionary[staffCost.unnamedRoleId!].name;
                    name = staffCost.unnamedLabel ?? role;
                }
                return {
                    isStaff: true,
                    staffName: name,
                    staffRole: role,
                    staffFTE: (staffCost.ftePercentage ?? 0).toString() + '%',
                };
            });
    };
    const categoryTableRows: CategoryTableRow[] = costPolicyCategory.children.map((category): CategoryTableRow => {
        return {
            category: category.name!,
            fundingAppliedFor: calculateSubCategoryTotal(category, structuredCosts.linkedCosts),
        };
    });

    const staffData: StaffTableRow[] = costPolicyCategory.children.flatMap(category => getStaffForCategory(category));

    return (
        <div id={`${costPolicyCategory.id}-${costPolicyCategory.name}-section`}>
            <HeadingText text={costPolicyCategory.name!} size={'m'} tag={'h4'} className="serif govuk-!-margin-top-8" />
            <HeadingText text={'Cost categories'} size={'s'} tag={'h5'} className="serif" />
            <SubCategoryTable data={categoryTableRows} testId={`parent-table-${costPolicyCategory.id}`}>
                <Column<CategoryTableRow>
                    header={'Category'}
                    value={structuredCostsTableRow => structuredCostsTableRow.category}
                    idPrefix={`${costPolicyCategory.id}-${costPolicyCategory.name}-sub-category-name`}
                ></Column>
                <Column<CategoryTableRow>
                    header={'Applied for'}
                    value={structuredCostsTableRow => structuredCostsTableRow.fundingAppliedFor}
                    idPrefix={`${costPolicyCategory.id}-${costPolicyCategory.name}-sub-category-funding-applied-for`}
                ></Column>
            </SubCategoryTable>
            <HeadingText text={'Staff breakdown'} size={'s'} tag={'h5'} className="serif" />
            {staffData.length > 0 ? (
                <StaffTable data={staffData}>
                    <Column<StaffTableRow>
                        header={'Name'}
                        value={structuredCostsTableRow => structuredCostsTableRow.staffName}
                    ></Column>
                    <Column<StaffTableRow>
                        header={'Role'}
                        value={structuredCostsTableRow => structuredCostsTableRow.staffRole}
                    ></Column>
                    <Column<StaffTableRow>
                        header={'%FTE'}
                        value={structuredCostsTableRow => structuredCostsTableRow.staffFTE}
                    ></Column>
                </StaffTable>
            ) : (
                <Paragraph className="govuk-!-margin-bottom-6">No staff for this category</Paragraph>
            )}
        </div>
    );
}
