import { Label } from 'govuk-react-jsx';

import {
    convertToFilterText,
    generateClearSearchText,
    hasApplicationStatusFilters,
    hasGroupFilters,
} from '../../utils/searchFilterUtils';
import { ApplicationFilterSideBarProps } from '../sideBar/applicationFilterSideBar';
import { GdsLinkButton } from '../linkButton';
import React from 'react';
import { ApplicationSort } from '../../enums/enums';

const createFilterSummary: React.FunctionComponent<ApplicationFilterSideBarProps> = props => {
    const resultKeyWord = props.searchTerm ? 'result' : 'application';

    const totalRecords = props.pageInformation ? props.pageInformation.totalRecords : 0;

    let filterSummaryText = `${resultKeyWord}${totalRecords === 1 ? '' : 's'}`;

    if (props.searchTerm) {
        filterSummaryText += ` for '${props.searchTerm}'`;
    }

    if (hasApplicationStatusFilters(props)) {
        const filterText = convertToFilterText(props.checkedApplicationStatusFilters!);

        filterSummaryText += ` with a status of ${filterText}`;

        if (hasGroupFilters(props)) {
            filterSummaryText += ' and';
        }
    }

    if (hasGroupFilters(props)) {
        const filterText = convertToFilterText(props.checkedGroups!.map(group => group.name)!);

        const groupPlural = props.checkedGroups!.length > 1 ? 's' : '';

        filterSummaryText += ` in the group${groupPlural} ${filterText}`;
    }

    return (
        <div className="column is-6">
            <Label data-testid="filter-summary">
                <strong>{totalRecords}</strong> {filterSummaryText}
            </Label>
            {props.searchTerm && (
                <Label>
                    <GdsLinkButton href={props.clearFiltersAndSearchQuery!} text={generateClearSearchText(props)} />
                </Label>
            )}
        </div>
    );
};

export const topContent = (props: ApplicationFilterSideBarProps): JSX.Element => (
    <div className="columns">
        {createFilterSummary(props)}

        {props.recentlyStartedLink && props.endingSoonestLink && (
            <div className="column is-6 u-align-right">
                <Label>
                    {'Applications sorted by: '}
                    {props.sortBy === ApplicationSort.RecentlyStarted ? (
                        <strong>Recently started</strong>
                    ) : (
                        <GdsLinkButton href={props.recentlyStartedLink!} text="Recently started" />
                    )}
                    {' | '}
                    {props.sortBy === ApplicationSort.EndingSoonest ? (
                        <strong>Ending soonest</strong>
                    ) : (
                        <GdsLinkButton href={props.endingSoonestLink!} text="Ending soonest" />
                    )}
                </Label>
            </div>
        )}
    </div>
);
