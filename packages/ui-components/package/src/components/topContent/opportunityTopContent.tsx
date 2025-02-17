import { Label } from 'govuk-react-jsx';

import { generateOpportunityClearSearchText } from '../../utils/searchFilterUtils';
import { GdsLinkButton } from '../linkButton';
import React from 'react';
import { OpportunitySideBarProps } from '../sideBar/opportunitySideBar';

export interface OpportunityTopContentProps extends OpportunitySideBarProps {
    filterSummaryText?: string;
}

const createFilterSummary: React.FunctionComponent<OpportunityTopContentProps> = props => {
    const totalRecords = props ? props.totalRecords : 0;

    return (
        <div className="column is-6">
            <Label data-testid="filter-summary">
                <strong>{totalRecords}</strong> {props.filterSummaryText}
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

export const topContent: React.FunctionComponent<OpportunityTopContentProps> = props => (
    <div className="columns">{createFilterSummary(props)}</div>
);
