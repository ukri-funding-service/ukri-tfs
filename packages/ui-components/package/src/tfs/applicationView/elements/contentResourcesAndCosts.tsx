import React from 'react';
import { CostPolicy } from '../types/applicationViewContent';
import { Column, TypedTable } from '../../../components/table';
import { CostCategoryWithCalculations, addCalculationsToCostPolicy } from '@ukri-tfs/cost-policy';
import { displayCurrencyWithDecimals, displayCurrencyWithoutDecimals } from '../../../helpers/currency';

interface TfsApplicationContentResourcesAndCostsSectionProps {
    id: string;
    costPolicy?: CostPolicy;
}

export const TfsApplicationContentResourcesAndCostsSection: React.FunctionComponent<TfsApplicationContentResourcesAndCostsSectionProps> =
    (props): JSX.Element => {
        if (!props.costPolicy) {
            return <p className="govuk-body serif meta">No resources and cost section.</p>;
        }

        const CostTable = TypedTable<CostCategoryWithCalculations>();

        const costPolicyWithCalculations = addCalculationsToCostPolicy(props.costPolicy);

        return (
            <React.Fragment>
                <CostTable data={costPolicyWithCalculations.costCategories} className="serif costs-table">
                    <Column
                        header={'Funding type'}
                        value={(item: CostCategoryWithCalculations) => item.name}
                        width={40}
                        idPrefix="funding-type"
                    />
                    <Column
                        header={'Full economic cost (£)'}
                        dataType="numeric"
                        value={(item: CostCategoryWithCalculations) =>
                            `${item.costAmount ? displayCurrencyWithoutDecimals(item.costAmount) : '-'}`
                        }
                        width={20}
                        idPrefix="full-cost"
                    />
                    <Column
                        header={'Funding percentage (%)'}
                        dataType="numeric"
                        value={(item: CostCategoryWithCalculations) => item.percentage}
                        width={20}
                        idPrefix="percentage"
                    />
                    <Column
                        header={'Funding applied for (£)'}
                        dataType="numeric"
                        value={(item: CostCategoryWithCalculations) =>
                            `${item.appliedFunding ? displayCurrencyWithDecimals(item.appliedFunding) : '-'}`
                        }
                        width={20}
                        idPrefix="funding-applied"
                    />
                </CostTable>
                <table className="govuk-table serif costs-total-table">
                    <colgroup>
                        <col width="40%" />
                        <col width="20%" />
                    </colgroup>
                    <tbody className="govuk-table__body">
                        <tr className="govuk-table__row">
                            <th scope="row" className="govuk-table__cell govuk-!-font-weight-bold">
                                Total cost
                            </th>
                            <td
                                className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
                                id="total-cost"
                            >
                                {costPolicyWithCalculations.totalCost
                                    ? displayCurrencyWithoutDecimals(costPolicyWithCalculations.totalCost, true)
                                    : '£-'}
                            </td>
                        </tr>
                        <tr className="govuk-table__row">
                            <th scope="row" className="govuk-table__cell govuk-!-font-weight-bold">
                                Contribution from applying organisations
                            </th>
                            <td
                                className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
                                id="contribution"
                            >
                                {costPolicyWithCalculations.contribution
                                    ? displayCurrencyWithDecimals(costPolicyWithCalculations.contribution, true)
                                    : '£-'}
                            </td>
                        </tr>
                        <tr className="govuk-table__row">
                            <th scope="row" className="govuk-table__cell govuk-!-font-weight-bold">
                                Total funding applied for
                            </th>
                            <td
                                className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
                                id="total-applied"
                            >
                                {costPolicyWithCalculations.totalApplied
                                    ? displayCurrencyWithDecimals(costPolicyWithCalculations.totalApplied, true)
                                    : '£-'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        );
    };
