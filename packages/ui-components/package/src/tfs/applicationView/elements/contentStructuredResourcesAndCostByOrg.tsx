import React from 'react';
import {
    displayValueWithPencesOrDash,
    generateCostPolicyCategoryDictionary,
    generateOrganisationDictionary,
    generateParentCategoriesDictionary,
    generateRoleDictionary,
    generateStaffDictionary,
    getAverageHours,
    getCategory,
    getDate,
    getEndDate,
    getFEC,
    getFTE,
    getFullCost,
    getStaffRole,
    getTotalAppliedFor,
    getTotalAppliedForPerApplication,
    getTotalAppliedForPerOrganisation,
    recursiveFlattenedOpportunityCostPolicyCategoryTree,
    StructuredCostRow,
    TfsApplicationStructuredCostsSectionProps,
} from '../../../helpers/structuredResourcesAndCosts';
import { Column, HeadingText, TypedTable } from '../../../components';
import { LinkedCost } from '../types/applicationViewContent';

export const TfsApplicationStructuredCostsByOrgSection: React.FunctionComponent<TfsApplicationStructuredCostsSectionProps> =
    (props): JSX.Element => {
        const staffDictionary = generateStaffDictionary(props.structuredCosts.applicants);
        const roleDictionary = generateRoleDictionary(props.structuredCosts.policyRoles);
        const costPolicyCategoryDictionary = generateCostPolicyCategoryDictionary(
            props.structuredCosts.costPolicyCategories,
        );
        const parentCategoriesDictionary = generateParentCategoriesDictionary(
            props.structuredCosts.costPolicyCategoryTrees,
        );
        const organisationDictionary = generateOrganisationDictionary(props.structuredCosts);
        const OrganisationTable = TypedTable<StructuredCostRow>();

        const mapLinkedCostToTableMapper = (linkedCost: LinkedCost) => {
            const totalForOrganisation = getTotalAppliedForPerOrganisation(
                linkedCost,
                parentCategoriesDictionary,
                costPolicyCategoryDictionary,
                props.structuredCosts.costPolicyCategoryTrees,
            );
            return (
                <>
                    <HeadingText
                        key={`org-${linkedCost.organisationId}`}
                        aria-label={organisationDictionary[linkedCost.organisationId!]}
                        text={organisationDictionary[linkedCost.organisationId!]}
                        size={'s'}
                        tag={'h2'}
                    ></HeadingText>
                    <OrganisationTable
                        data={props.structuredCosts.costPolicyCategoryTrees
                            .map(costPolicyCategoryTree =>
                                recursiveFlattenedOpportunityCostPolicyCategoryTree(
                                    costPolicyCategoryTree,
                                    linkedCost.staffCosts ?? [],
                                ),
                            )
                            .flat()}
                        testId={`org-${linkedCost.organisationId}`}
                        rowTestId={item =>
                            `organisation-table-row-${item.id}-${linkedCost.organisationId}${
                                item.staffCost ? '-staff' : ''
                            }`
                        }
                        rowClassName={structuredCostRow => {
                            let rowClass = `organisation-table-row--level-${structuredCostRow.level}`;

                            if (structuredCostRow.isLastChildOfParent) {
                                rowClass += ` organisation-table-row--last-child-of-parent`;
                            }

                            return rowClass;
                        }}
                    >
                        <Column
                            header={'Category'}
                            headerClassName={'u-align-cell--bottom'}
                            className={structuredCostRow =>
                                `organisation-table-category organisation-table-category--level-${structuredCostRow.level}`
                            }
                            value={(structuredCostRow: StructuredCostRow) =>
                                structuredCostRow.categoryParentLabel ? (
                                    <>
                                        <div className="govuk-visually-hidden">
                                            {structuredCostRow.categoryParentLabel}
                                        </div>
                                        {getCategory(staffDictionary, roleDictionary)(structuredCostRow)}
                                    </>
                                ) : (
                                    getCategory(staffDictionary, roleDictionary)(structuredCostRow)
                                )
                            }
                            width={21}
                        />
                        <Column
                            header={'Role'}
                            headerClassName={'u-align-cell--bottom'}
                            className={() => 'organisation-table-role'}
                            value={getStaffRole(roleDictionary, staffDictionary)}
                            width={17}
                        ></Column>
                        <Column
                            header={'% FTE'}
                            ariaLabel="Percentage of Full time equivalent"
                            headerClassName={'u-align-cell--bottom'}
                            className={() => 'organisation-table-fte'}
                            value={getFTE}
                        ></Column>
                        <Column
                            header={'Average hrs pw'}
                            ariaLabel={'Average hours per week'}
                            headerClassName={'u-align-cell--bottom'}
                            className={() => 'organisation-table-average-hours-pw'}
                            value={getAverageHours}
                            width={5}
                        ></Column>
                        <Column
                            header={'Start date'}
                            headerClassName={'u-align-cell--bottom'}
                            className={() => 'organisation-table-start'}
                            value={(costPolicyCategory: StructuredCostRow) =>
                                getDate(costPolicyCategory.staffCost?.startDate)
                            }
                            width={8}
                        ></Column>
                        <Column
                            header={'End date'}
                            headerClassName={'u-align-cell--bottom'}
                            className={() => 'organisation-table-end'}
                            value={(costPolicyCategory: StructuredCostRow) =>
                                getEndDate(costPolicyCategory.staffCost?.endDate)
                            }
                            width={8}
                        ></Column>
                        <Column
                            header={'Full economic cost (fEC)'}
                            ariaLabel={'Full economic cost F.E.C.'}
                            headerClassName="u-align-cell--bottom govuk-table__header--numeric"
                            className={() => 'organisation-table-full-cost govuk-table__cell--numeric'}
                            value={getFullCost(linkedCost, parentCategoriesDictionary, costPolicyCategoryDictionary)}
                        ></Column>
                        <Column
                            header={'% of fEC'}
                            ariaLabel={'Percentage of F.E.C.'}
                            headerClassName="govuk-table__header--numeric u-align-cell--bottom"
                            className={() => 'organisation-table-percentage-fte govuk-table__cell--numeric'}
                            value={getFEC}
                        ></Column>
                        <Column
                            header={'Applied for'}
                            headerClassName="govuk-table__header--numeric u-align-right u-align-cell--bottom"
                            className={() => 'organisation-table-applied-for govuk-table__cell--numeric'}
                            value={getTotalAppliedFor(
                                linkedCost,
                                parentCategoriesDictionary,
                                costPolicyCategoryDictionary,
                            )}
                        ></Column>
                    </OrganisationTable>
                    <div
                        className={'govuk-body structured-costs-total structured-costs-total--organisation'}
                        data-testid={`organisation-table-total-${linkedCost.organisationId}`}
                    >
                        <div className="organisation-total-text">
                            Total applied for: {organisationDictionary[linkedCost.organisationId!]}
                        </div>
                        <div className="organisation-total-value">
                            <strong>{displayValueWithPencesOrDash(totalForOrganisation)}</strong>
                        </div>
                    </div>
                </>
            );
        };

        return (
            <div className="structured-costs-org-table">
                {props.structuredCosts.linkedCosts.map(mapLinkedCostToTableMapper)}
                <div
                    className={'govuk-body structured-costs-total structured-costs-total--application'}
                    data-testid={`application-table-total`}
                >
                    <div className="application-table-total-text" data-testid={`application-table-total-text`}>
                        Total applied for: All organisations
                    </div>
                    <div className="application-table-total-value" data-testid={`application-table-total-value`}>
                        <strong>
                            {displayValueWithPencesOrDash(
                                getTotalAppliedForPerApplication(
                                    props.structuredCosts.linkedCosts,
                                    parentCategoriesDictionary,
                                    costPolicyCategoryDictionary,
                                    props.structuredCosts.costPolicyCategoryTrees,
                                ),
                            )}
                        </strong>
                    </div>
                </div>
            </div>
        );
    };
