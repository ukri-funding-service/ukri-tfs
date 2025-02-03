import { Button, Label } from '../govuk-react-jsx';
import { getOpportunityFilterByFunderCheckboxItems, hasOpportunityFilters } from '../../utils/searchFilterUtils';
import React from 'react';
import { Form } from '../form';
import { GroupedCheckboxes } from '../groupedCheckboxes';
import { GdsLinkButton } from '../linkButton';
import { OpportunitySideBarProps } from '../sideBar/opportunitySideBar';

export const FilterByFunder = (props: OpportunitySideBarProps): JSX.Element => (
    <>
        <Form csrfToken={props.csrfToken} action={props.filtersFormAction} id="filter-form">
            <input type="hidden" name="formType" value="opportunityFunderFilters" />
            <div className="filter">
                <GroupedCheckboxes
                    title="Filter by Council"
                    items={getOpportunityFilterByFunderCheckboxItems(props.checkedOpportunityFunderFilters)}
                    name="opportunityFunderFilters"
                    displayShowHideButton={false}
                    shouldTruncateList={false}
                ></GroupedCheckboxes>
            </div>
            <Button>Apply filters</Button>
        </Form>
        {hasOpportunityFilters(props) ? (
            <Label>
                <GdsLinkButton
                    href={props.clearFiltersQuery!}
                    text={`Clear filter${props.checkedOpportunityFunderFilters!.length > 1 ? 's' : ''}`}
                />
            </Label>
        ) : (
            <></>
        )}
    </>
);
