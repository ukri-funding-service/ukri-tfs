import { CsrfProps } from '@ukri-tfs/frontend-utils';
import React from 'react';
import { OpportunityFunderFilterItem } from '../../enums/enums';
import { SideBarSearch } from '../sideBarSearch/sideBarSearch';
import { FilterByFunder } from '../sideBarFilter/filterByFunder';

export interface OpportunitySideBarProps extends CsrfProps {
    checkedOpportunityFunderFilters?: OpportunityFunderFilterItem[];
    searchTerm?: string;
    searchHint?: string;
    createOpportunityLinkText?: string;
    createOpportunityLinkURL?: string;
    searchFormAction?: string;
    filtersFormAction?: string;
    clearFiltersQuery?: string;
    clearFiltersAndSearchQuery?: string;
    totalRecords: number;
    children?: React.ReactNode;
}

export const OpportunitySideBar: React.FunctionComponent<OpportunitySideBarProps> = (
    props: OpportunitySideBarProps,
) => (
    <>
        <a href={props.createOpportunityLinkURL} className="govuk-button" data-module="govuk-button">
            {props.createOpportunityLinkText}
        </a>

        <div className="govuk-related-items govuk-related-items--flush govuk-!-padding-top-1"></div>
        <SideBarSearch
            csrfToken={props.csrfToken}
            searchHint={props.searchHint}
            searchTerm={props.searchTerm}
            checkedOpportunityFunderFilters={props.checkedOpportunityFunderFilters}
            searchFormAction={props.searchFormAction}
            filtersFormAction={props.filtersFormAction}
            clearFiltersQuery={props.clearFiltersQuery}
            clearFiltersAndSearchQuery={props.clearFiltersAndSearchQuery}
            totalRecords={props.totalRecords}
        ></SideBarSearch>
        <FilterByFunder
            csrfToken={props.csrfToken}
            searchTerm={props.searchTerm}
            checkedOpportunityFunderFilters={props.checkedOpportunityFunderFilters}
            searchFormAction={props.searchFormAction}
            filtersFormAction={props.filtersFormAction}
            clearFiltersQuery={props.clearFiltersQuery}
            clearFiltersAndSearchQuery={props.clearFiltersAndSearchQuery}
            totalRecords={props.totalRecords}
        >
            {' '}
        </FilterByFunder>
    </>
);
