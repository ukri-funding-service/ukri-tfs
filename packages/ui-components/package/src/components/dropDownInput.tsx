import { FormField } from './formField';
import React from 'react';

interface DropDownInputProps {
    title: string;
    name: string;
    options: OptionValuePair[];
    defaultOption?: OptionValuePair;
    onChange?: (event: React.FormEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
}

interface OptionValuePair {
    value: string;
    displayValue?: string;
}

const generateOptions = (options: OptionValuePair[]): JSX.Element[] => {
    const returningOptions = options.map(option => (
        <option key={option.value.replace(' ', '-')} value={option.value}>
            {option.displayValue ? option.displayValue : option.value}
        </option>
    ));
    return returningOptions;
};

export const DropDownInput = (props: DropDownInputProps): JSX.Element => {
    return (
        <FormField title={props.title} name={props.name}>
            <select
                className={'govuk-select'}
                onChange={event => props.onChange && props.onChange(event)}
                name={`${props.name}`}
                id={`${props.name}-select`}
                defaultValue={props.defaultOption && props.defaultOption.value}
                disabled={props.disabled}
            >
                {generateOptions(props.options)}
            </select>
        </FormField>
    );
};
