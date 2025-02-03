import React from 'react';
import { Form } from '../form';
import { SearchInput } from '../searchInput';
import { OpportunitySideBarProps } from '../sideBar/opportunitySideBar';

export const SideBarSearch = (props: OpportunitySideBarProps): JSX.Element => (
    <Form csrfToken={props.csrfToken} action={props.searchFormAction} id="search-form">
        <input type="hidden" name="formType" value="search" />
        <SearchInput
            label="Search"
            hint={props.searchHint!}
            buttonName="sideBarSearch"
            defaultValue={props.searchTerm}
        />
    </Form>
);
