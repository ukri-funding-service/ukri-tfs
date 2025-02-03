import React, { ReactElement } from 'react';
import { Column, TypedTable } from '../../../components/table';
import { LabelledValues, LabelValuePair } from '../../../components';

interface TfsCostPolicyCategory {
    superCategory: string;
    subCategory: string;
}

export interface TfsCostPolicy {
    awardTotal: number;
    totalAuthorisedFec: number;
    contributionFromApplyingOrganisation: number;
    costPolicyItems: TfsCostPolicyItem[];
}

export interface TfsCostPolicyItemGroup {
    title: string;
    costPolicyItems: TfsCostPolicyItem[];
}

export interface TfsCostPolicyItem {
    costCategory: string;
    fundHeading: string;
    fecPercentage: number;
    authorisedFecNet: number;
    authorisedFecIndexation: number;
    authorisedFecTotal: number;
    rcContributionNet: number;
    rcContributionIndexation: number;
    rcContributionTotal: number;
}

export interface TfsCostPolicyReportProps {
    costPolicy: TfsCostPolicy;
    isListLayout?: boolean;
}

export interface TfsCostPolicyTotalsProps {
    totalFec: number;
    totalRc: number;
    awardTotal: number;
    formatVertically?: boolean;
}

export interface TfsCostPolicyTableProps {
    title: string;
    costPolicyItems: TfsCostPolicyItem[];
    useSmallHeading?: boolean;
}

const tfsCostPolicyCategories: TfsCostPolicyCategory[] = [
    {
        superCategory: 'Directly allocated',
        subCategory: 'Staff',
    },
    {
        superCategory: 'Directly allocated',
        subCategory: 'Estates',
    },
    {
        superCategory: 'Directly allocated',
        subCategory: 'Other',
    },
    {
        superCategory: 'Directly incurred',
        subCategory: 'Staff',
    },
    {
        superCategory: 'Directly incurred',
        subCategory: 'Equipment',
    },
    {
        superCategory: 'Directly incurred',
        subCategory: 'Travel and subsistence',
    },
    {
        superCategory: 'Directly incurred',
        subCategory: 'Other',
    },
    {
        superCategory: 'Indirect costs',
        subCategory: 'Indirect costs',
    },
    {
        superCategory: 'Exceptions',
        subCategory: 'Staff',
    },
    {
        superCategory: 'Exceptions',
        subCategory: 'Equipment',
    },
    {
        superCategory: 'Exceptions',
        subCategory: 'Travel and subsistence',
    },
    {
        superCategory: 'Exceptions',
        subCategory: 'Other',
    },
];

const displayCurrency = (value: number): string => {
    const amount = value.toFixed(2);

    return amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const findCostPolicyCategoryIndex = (costPolicyItem: TfsCostPolicyItem): number => {
    return tfsCostPolicyCategories.findIndex(tfsCostPolicyCategory => {
        return (
            tfsCostPolicyCategory.superCategory === costPolicyItem.costCategory &&
            tfsCostPolicyCategory.subCategory === costPolicyItem.fundHeading
        );
    });
};

const sortCostPolicyItems = (costPolicyItems: TfsCostPolicyItem[]): TfsCostPolicyItem[] => {
    return costPolicyItems.sort((a, b) => {
        const aIndex = findCostPolicyCategoryIndex(a);
        const bIndex = findCostPolicyCategoryIndex(b);

        return aIndex - bIndex;
    });
};

const categoriseCostPolicyItems = (costPolicyItems: TfsCostPolicyItem[]): TfsCostPolicyItemGroup[] => {
    const tfsCostPolicyItemGroups: TfsCostPolicyItemGroup[] = [];

    costPolicyItems.forEach((costPolicyItem: TfsCostPolicyItem) => {
        let tfsCostPolicyItemGroup = tfsCostPolicyItemGroups.find(
            (categorisedCostPolicyItem: TfsCostPolicyItemGroup) =>
                categorisedCostPolicyItem.title === costPolicyItem.costCategory,
        );

        if (!tfsCostPolicyItemGroup) {
            tfsCostPolicyItemGroup = {
                title: costPolicyItem.costCategory,
                costPolicyItems: [],
            } as TfsCostPolicyItemGroup;

            tfsCostPolicyItemGroups.push(tfsCostPolicyItemGroup);
        }

        tfsCostPolicyItemGroup.costPolicyItems.push(costPolicyItem);
    });

    return tfsCostPolicyItemGroups;
};

export const TfsCostPolicyTotals = (props: TfsCostPolicyTotalsProps): ReactElement => {
    const createVerticalTotal = (labelledValues: LabelValuePair): ReactElement => {
        return (
            <p>
                <strong className="govuk-!-margin-left-0">{`${labelledValues.label}:`}</strong>
                &nbsp;
                <span data-testid={labelledValues.testId}>{labelledValues.value}</span>
            </p>
        );
    };

    const labelledValues = [
        {
            label: 'Total fEC',
            value: '£' + displayCurrency(props.totalFec),
            testId: 'total-fEC',
        },
        {
            label: 'Contribution from applying organisation',
            value: '£' + displayCurrency(props.totalRc),
            testId: 'contribution-from-organisation',
        },
        {
            label: 'Award value',
            value: '£' + displayCurrency(props.awardTotal),
            testId: 'total-award-value',
        },
    ];

    return props.formatVertically ? (
        <div className="govuk-!-margin-bottom-5">{labelledValues.map(createVerticalTotal)}</div>
    ) : (
        <LabelledValues labelledValues={labelledValues} />
    );
};

const CostPolicyTypeTable = TypedTable<TfsCostPolicyItem>();

export const TfsCostPolicyTable = (props: TfsCostPolicyTableProps): ReactElement => {
    return (
        <>
            {props.useSmallHeading ? (
                <h3 data-testid={`${props.title}-title`} className="govuk-heading-m">
                    {props.title}
                </h3>
            ) : (
                <h2 data-testid={`${props.title}-title`} className="govuk-heading-m">
                    {props.title}
                </h2>
            )}
            <CostPolicyTypeTable data={props.costPolicyItems}>
                <Column
                    header="Fund headings"
                    value={(costPolicyItem: TfsCostPolicyItem) => costPolicyItem.fundHeading}
                    ariaLabel="Fund Headings"
                    className={() => 'u-valign-middle'}
                    width={20}
                />
                <Column
                    header="fEC (%)"
                    value={(costPolicyItem: TfsCostPolicyItem) => costPolicyItem.fecPercentage}
                    ariaLabel="fEC Percentage"
                    className={() => 'u-valign-middle govuk-table__cell--numeric'}
                    headerClassName={'govuk-table__header--numeric'}
                />
                <Column
                    header="Full costs (£)"
                    value={(costPolicyItem: TfsCostPolicyItem) => displayCurrency(costPolicyItem.authorisedFecNet)}
                    ariaLabel="Full Costs In Pounds"
                    className={() => 'govuk-table__cell--numeric'}
                    headerClassName={'govuk-table__header--numeric'}
                />
                <Column
                    header="fEC Indexation (£)"
                    value={(costPolicyItem: TfsCostPolicyItem) =>
                        displayCurrency(costPolicyItem.authorisedFecIndexation)
                    }
                    ariaLabel="fEC Indexation Value In Pounds"
                    className={() => 'u-valign-middle govuk-table__cell--numeric'}
                    headerClassName={'govuk-table__header--numeric'}
                />
                <Column
                    header="Total fEC (£)"
                    value={(costPolicyItem: TfsCostPolicyItem) => displayCurrency(costPolicyItem.authorisedFecTotal)}
                    ariaLabel="Total fEC Value In Pounds"
                    className={() => 'u-valign-middle govuk-table__cell--numeric'}
                    headerClassName={'govuk-table__header--numeric'}
                />
                <Column
                    header="UKRI contribution (£)"
                    value={(costPolicyItem: TfsCostPolicyItem) => displayCurrency(costPolicyItem.rcContributionNet)}
                    ariaLabel="UKRI contribution In Pounds"
                    className={() => 'u-valign-middle govuk-table__cell--numeric'}
                    headerClassName={'govuk-table__header--numeric'}
                />
                <Column
                    header="UKRI Indexation (£)"
                    value={(costPolicyItem: TfsCostPolicyItem) =>
                        displayCurrency(costPolicyItem.rcContributionIndexation)
                    }
                    ariaLabel="UKRI Indexation Value In Pounds"
                    className={() => 'u-valign-middle govuk-table__cell--numeric'}
                    headerClassName={'govuk-table__header--numeric'}
                />
                <Column
                    header="Award total (£)"
                    value={(costPolicyItem: TfsCostPolicyItem) => displayCurrency(costPolicyItem.rcContributionTotal)}
                    ariaLabel="Award Total Value In Pounds"
                    className={() => 'u-valign-middle govuk-table__cell--numeric'}
                    headerClassName={'govuk-table__header--numeric'}
                />
            </CostPolicyTypeTable>
        </>
    );
};

export const TfsCostPolicyReport = (props: TfsCostPolicyReportProps): ReactElement => {
    const sortedCostPolicyItems = sortCostPolicyItems(props.costPolicy.costPolicyItems);
    const categorisedCostPolicyItems = categoriseCostPolicyItems(sortedCostPolicyItems);

    return (
        <>
            <TfsCostPolicyTotals
                totalFec={props.costPolicy.totalAuthorisedFec}
                totalRc={props.costPolicy.contributionFromApplyingOrganisation}
                awardTotal={props.costPolicy.awardTotal}
                formatVertically={props.isListLayout}
            />
            {categorisedCostPolicyItems.map(categorisedCostPolicyItem => {
                return (
                    <TfsCostPolicyTable
                        title={categorisedCostPolicyItem.title}
                        costPolicyItems={categorisedCostPolicyItem.costPolicyItems}
                        key={categorisedCostPolicyItem.title}
                        useSmallHeading={props.isListLayout}
                    />
                );
            })}
        </>
    );
};
