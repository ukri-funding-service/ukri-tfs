import { Label } from 'govuk-react-jsx';

import { generateOpportunityClearSearchText, hasOpportunityFilters } from '../../utils/searchFilterUtils';
import { GdsLinkButton } from '../linkButton';
import React from 'react';
import { OpportunitySideBarProps } from '../sideBar/opportunitySideBar';

const createFilterSummary: React.FunctionComponent<OpportunitySideBarProps> = props => {
    const totalRecords = props ? props.totalRecords : 0;

    let filterSummaryText;

    if (props.searchTerm) {
        if (totalRecords === 0 || totalRecords === 1) {
            filterSummaryText = 'result';
        } else {
            filterSummaryText = 'results';
        }
        filterSummaryText += ` for '${props.searchTerm}'`;
    } else {
        if (totalRecords === 0 || totalRecords === 1) {
            filterSummaryText = 'opportunity';
        } else {
            filterSummaryText = 'opportunities';
        }
    }

    if (hasOpportunityFilters(props)) {
        const mappedCheckedOpportunityStatusFilters = props.checkedOpportunityFunderFilters!.map(
            filter => `'${filter}'`,
        );
        const lastElement = mappedCheckedOpportunityStatusFilters.pop();
        const commaSeparatedFilters = mappedCheckedOpportunityStatusFilters.join(', ');

        const multipleFiltersText = !!commaSeparatedFilters
            ? `${commaSeparatedFilters} or ${lastElement}`
            : lastElement;

        filterSummaryText += ` with a council of ${multipleFiltersText}`;
    }

    return (
        <div className="column is-6">
            <Label data-testid="filter-summary">
                <strong>{totalRecords}</strong> {filterSummaryText}
            </Label>
            {props.searchTerm && (
                <Label>
                    <GdsLinkButton
                        href={props.clearFiltersAndSearchQuery!}
                        text={generateOpportunityClearSearchText(props)}
                    />
                </Label>
            )}
        </div>
    );
};

export const topContent: React.FunctionComponent<OpportunitySideBarProps> = props => (
    <div className="columns">{createFilterSummary(props)}</div>
);
