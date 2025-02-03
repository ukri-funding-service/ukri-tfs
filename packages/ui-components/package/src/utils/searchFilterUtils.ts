import { CheckboxesItemProps } from 'govuk-react-jsx';
import { ApplicationFilterSideBarProps } from '../components/sideBar/applicationFilterSideBar';
import { ApplicationFilterStatus, ApplicationSort, GroupFilter, OpportunityFunderFilterItem } from '../enums/enums';
import { OptionalKeyValue, urls } from '../urls/urls';
import { generate } from '../urls/generator';
import { OpportunitySideBarProps } from '../components/sideBar/opportunitySideBar';

export interface ApplicationQueries extends OptionalKeyValue {
    page?: number;
    filterApplicationStatuses?: ApplicationFilterStatus[];
    filterGroupIds?: number[];
    sortBy?: ApplicationSort;
    searchTerm?: string;
}

export interface OpportunityQueries extends OptionalKeyValue {
    opportunityFunderFilters?: OpportunityFunderFilterItem[];
    searchTerm?: string;
}
export interface PanelManageApplicationsQueries extends OptionalKeyValue {
    opportunityId: number;
    searchQuery?: string;
}

export interface PanelManageApplicationsArgs extends OptionalKeyValue {
    panelId: string;
}

export function convertToFilterText<T>(array: T[]): string | undefined {
    const mappedArray = array.map(filter => `'${filter}'`);
    const lastElement = mappedArray.pop();
    const commaSeparatedFilters = mappedArray.join(', ');

    const multipleFiltersText = !!commaSeparatedFilters ? `${commaSeparatedFilters} or ${lastElement}` : lastElement;

    return multipleFiltersText;
}

export const hasApplicationStatusFilters = (props: ApplicationFilterSideBarProps): boolean | undefined =>
    props.checkedApplicationStatusFilters && props.checkedApplicationStatusFilters.length > 0;

export const hasGroupFilters = (props: ApplicationFilterSideBarProps): boolean | undefined =>
    props.groups && props.groups.length > 0 && props.checkedGroups && props.checkedGroups.length > 0;

export const hasOpportunityFilters = (props: OpportunitySideBarProps): boolean | undefined =>
    props.checkedOpportunityFunderFilters && props.checkedOpportunityFunderFilters.length > 0;

const getFilterCount = (
    checkedApplicationStatusFilters: ApplicationFilterStatus[] | undefined,
    checkedGroups: GroupFilter[] | undefined,
): number => {
    const applicationFilterCount = checkedApplicationStatusFilters?.length ?? 0;
    const groupsFilterCount = checkedGroups?.length ?? 0;

    return applicationFilterCount + groupsFilterCount;
};

export const generateClearSearchText = (props: ApplicationFilterSideBarProps): string => {
    let clearFieldText = 'Clear search';

    const filterCount = getFilterCount(props.checkedApplicationStatusFilters, props.checkedGroups);

    if (filterCount > 0) {
        const filterPlural = filterCount > 1 ? 's' : '';

        clearFieldText += ` and filter${filterPlural}`;
    }

    return clearFieldText;
};

export const generateOpportunityClearSearchText = (props: OpportunitySideBarProps): string => {
    let clearFieldText = 'Clear search';

    if (hasOpportunityFilters(props)) {
        clearFieldText += ` and filter${props.checkedOpportunityFunderFilters!.length > 1 ? 's' : ''}`;
    }

    return clearFieldText;
};

export const generateOpportunityLinkWithQueries = (opportunityQueries: OpportunityQueries): string =>
    generate(urls.opportunity.list, undefined, opportunityQueries);

export const generateOpportunitiesLink = (): string => generate(urls.opportunity.list);

export const generatePanelManageApplicationsLinksWithQueries = (
    panelId: string,
    panelManageApplicationsQueries: PanelManageApplicationsQueries,
): string => {
    return generate(urls.panel.manageApplications, { panelId }, panelManageApplicationsQueries);
};

export const generateLinkWithQueries = (
    organisationId: number | undefined,
    applicationQueries: ApplicationQueries,
): string => generate(urls.organisation.application.listNoParams, { organisationId }, applicationQueries);

export const getApplicationStatusFilterCheckboxItems = (
    applicationStatusFilters: ApplicationFilterStatus[],
    checkedApplicationStatusFilters: ApplicationFilterStatus[],
): CheckboxesItemProps[] => {
    const checkboxItems = applicationStatusFilters.map(
        (applicationStatusFilter: ApplicationFilterStatus): CheckboxesItemProps => ({
            children: applicationStatusFilter,
            value: applicationStatusFilter,
            'aria-label': `Filter by ${applicationStatusFilter}`,
            defaultChecked:
                checkedApplicationStatusFilters && checkedApplicationStatusFilters.includes(applicationStatusFilter),
        }),
    );

    return checkboxItems;
};

export const getGroupFilterCheckboxItems = (
    groups: GroupFilter[],
    checkedGroups?: GroupFilter[],
): CheckboxesItemProps[] => {
    const checkboxItems = groups.map(
        (group): CheckboxesItemProps => ({
            children: `${group.name} (${group.applicationCount})`,
            value: group.id,
            'aria-label': `Filter by group ${group.name}`,
            defaultChecked: checkedGroups && checkedGroups.some(checkedGroup => group.id === checkedGroup.id),
        }),
    );

    return checkboxItems;
};

export const multipleCheckedFilters = (
    checkedApplicationStatusFilters: ApplicationFilterStatus[] | undefined,
    checkedGroups: GroupFilter[] | undefined,
): Boolean => {
    let hasMultipleCheckedFilters = false;
    const applicationStatusFilters = checkedApplicationStatusFilters || [];
    const groupFilters = checkedGroups || [];

    hasMultipleCheckedFilters = applicationStatusFilters.length + groupFilters.length > 1;

    return hasMultipleCheckedFilters;
};

export const getOpportunityFilterByFunderCheckboxItems = (
    checkedOpportunityFunderFilterItems?: OpportunityFunderFilterItem[],
): CheckboxesItemProps[] => {
    const opportunityFunderFilters = [
        OpportunityFunderFilterItem.AHRC,
        OpportunityFunderFilterItem.BBSRC,
        OpportunityFunderFilterItem.EPSRC,
        OpportunityFunderFilterItem.ESRC,
        OpportunityFunderFilterItem.Innovate_UK,
        OpportunityFunderFilterItem.MRC,
        OpportunityFunderFilterItem.NERC,
        OpportunityFunderFilterItem.RE,
        OpportunityFunderFilterItem.STFC,
        OpportunityFunderFilterItem.UKRI,
    ];

    const checkboxItems = opportunityFunderFilters.map(
        (opportunityFunderFilterItem: OpportunityFunderFilterItem): CheckboxesItemProps => ({
            children: opportunityFunderFilterItem,
            value: opportunityFunderFilterItem,
            'aria-label': `Filter by ${opportunityFunderFilterItem}`,
            defaultChecked:
                checkedOpportunityFunderFilterItems &&
                checkedOpportunityFunderFilterItems.includes(opportunityFunderFilterItem),
        }),
    );

    return checkboxItems;
};
