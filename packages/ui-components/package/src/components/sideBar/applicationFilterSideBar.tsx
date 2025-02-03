import { CsrfProps } from '@ukri-tfs/frontend-utils';
import React from 'react';
import { ApplicationFilterStatus, ApplicationSort, GroupFilter } from '../../enums/enums';
import { PageInfo } from '../../utils/pageInfo';
import {
    getApplicationStatusFilterCheckboxItems,
    getGroupFilterCheckboxItems,
    hasApplicationStatusFilters,
    hasGroupFilters,
    multipleCheckedFilters,
} from '../../utils/searchFilterUtils';
import { Form } from '../form';
import { Button, Label } from '../govuk-react-jsx';
import { GroupedCheckboxes } from '../groupedCheckboxes';
import { GdsLinkButton } from '../linkButton';
import { SearchInput } from '../searchInput';

export interface ApplicationFilterSideBarProps extends CsrfProps {
    applicationStatuses: ApplicationFilterStatus[];
    checkedApplicationStatusFilters?: ApplicationFilterStatus[];
    groups?: GroupFilter[];
    checkedGroups?: GroupFilter[];
    pageInformation?: PageInfo;
    sortBy?: ApplicationSort;
    searchTerm?: string;
    searchFormAction?: string;
    filtersFormAction?: string;
    clearFiltersQuery?: string;
    clearFiltersAndSearchQuery?: string;
    recentlyStartedLink?: string;
    endingSoonestLink?: string;
    searchHint?: string;
    nonDefaultGroupsExist?: boolean;
    showFilterHideButtons?: boolean;
    shouldTruncateGroupFilter?: boolean;
}

export const ApplicationFilterSideBar = (props: ApplicationFilterSideBarProps): JSX.Element => (
    <div className="govuk-related-items govuk-related-items--flush govuk-!-padding-top-1">
        <Form csrfToken={props.csrfToken} action={props.searchFormAction} id="search-form">
            <input type="hidden" name="formType" value="search" />
            <SearchInput
                label="Search"
                hint={props.searchHint ?? ''}
                buttonName="applicationSearch"
                defaultValue={props.searchTerm}
            />
        </Form>
        <Form csrfToken={props.csrfToken} action={props.filtersFormAction} id="filter-form">
            <input type="hidden" name="formType" value="applicationFilters" />
            <div className="filter">
                <GroupedCheckboxes
                    title="Filter by status"
                    items={getApplicationStatusFilterCheckboxItems(
                        props.applicationStatuses,
                        props.checkedApplicationStatusFilters ?? [],
                    )}
                    name="filterApplicationStatuses"
                    displayShowHideButton={!!props.showFilterHideButtons}
                    shouldTruncateList={false}
                ></GroupedCheckboxes>
            </div>
            {props.nonDefaultGroupsExist && props.groups && (
                <div className="filter">
                    <GroupedCheckboxes
                        title="Filter by group"
                        items={getGroupFilterCheckboxItems(props.groups, props.checkedGroups)}
                        name="filterGroupIds"
                        displayShowHideButton={!!props.showFilterHideButtons}
                        shouldTruncateList={!!props.shouldTruncateGroupFilter}
                    ></GroupedCheckboxes>
                </div>
            )}
            <Button>Apply filters</Button>
        </Form>
        {hasApplicationStatusFilters(props) || hasGroupFilters(props) ? (
            <Label>
                <GdsLinkButton
                    href={props.clearFiltersQuery!}
                    text={`Clear filter${
                        multipleCheckedFilters(props.checkedApplicationStatusFilters, props.checkedGroups) ? 's' : ''
                    }`}
                />
            </Label>
        ) : (
            <></>
        )}
    </div>
);
