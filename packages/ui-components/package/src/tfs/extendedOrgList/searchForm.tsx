import * as React from 'react';
import { Form, Input, positionField } from '../../';

import { Button } from 'govuk-react-jsx';

import { errorFormat } from '@ukri-tfs/validation';
import { CsrfProps } from '@ukri-tfs/frontend-utils';

export interface SearchFormProps {
    searchText: string;
    isDisabled: boolean;
    errors: errorFormat[];
    action?: string;
}

export const SearchForm = (props: SearchFormProps, csrfProps: CsrfProps, children?: React.ReactNode): JSX.Element => {
    interface TextFieldProps {
        label: string;
        name: string;
        value?: string;
        error?: string;
    }

    const searchTermField = ({ label, value, name, error }: TextFieldProps): JSX.Element => {
        const errorMessages = error ? [error] : undefined;
        return positionField(
            <Input
                name={name}
                label={label}
                errorMessages={errorMessages}
                type="text"
                defaultValue={value}
                widthSize="20"
            />,
        );
    };

    return (
        <Form {...csrfProps} name="search-organisation" action={props.action || '?'}>
            {searchTermField({
                label: props.searchText,
                name: 'term',
                error: props.errors && props.errors.find(e => e.fieldName === 'term')?.message,
                value: '',
            })}
            {children}
            <Button id="organisation-search" disabled={props.isDisabled}>
                Search
            </Button>
        </Form>
    );
};
