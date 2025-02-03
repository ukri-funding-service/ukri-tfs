import { Button } from './govuk-react-jsx';
import { Input } from './input';
import React from 'react';

export interface SearchInputProps {
    label: string;
    hint: string;
    buttonName: string;
    defaultValue?: string;
}

export const SearchInput = (props: SearchInputProps): JSX.Element => {
    const { label, hint, buttonName, defaultValue } = props;

    return (
        <>
            <label className="govuk-label govuk-label--s" htmlFor="searchQuery">
                {label}
            </label>
            <span className="govuk-hint">{hint}</span>
            <Input
                className="govuk-input"
                name="searchQuery"
                formGroupClassName="search-input-form-group"
                defaultValue={defaultValue}
            />
            <Button name={buttonName} className="search-button" aria-label="Search">
                <span className="govuk-visually-hidden">Search</span>
            </Button>
        </>
    );
};
