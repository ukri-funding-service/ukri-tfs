import React from 'react';
import { ValidationResult } from '@ukri-tfs/validation';
import { GdsErrorMessage } from '../components/errorMessage';
import { Label, Hint } from 'govuk-react-jsx';
import { GdsFormGroup } from './form/formGroup';

interface FormFieldProps {
    title?: string;
    name?: string;
    labelHint?: string;
    validation?: ValidationResult;
    labelClass?:
        | 'govuk-visually-hidden'
        | 'govuk-radios__label'
        | 'govuk-checkboxes__label'
        | 'govuk-date-input__label'
        | 'govuk-label--s';
    labelSize?: 'normal' | 'xl' | 'l' | 'm' | 's';
    hintClass?: 'govuk-radios__hint' | 'govuk-checkboxes__hint';
    children: React.ReactNode;
}

export const FormField: React.FunctionComponent<FormFieldProps> = (props): JSX.Element => {
    const showErrors = !!props.validation && props.validation.showValidationErrors() && !props.validation.isValid();
    const errorMessage = !!props.validation ? props.validation.errorMessage : '';
    const idProp = props.name ? { id: `${props.name}-wrapper` } : {};
    const htmlForProp = !!props.name ? { htmlFor: props.name } : {};

    let labelClass = props.labelClass as string;

    if (!props.labelClass) {
        labelClass = 'govuk-label--s';
    }

    if (props.labelSize) {
        labelClass = `govuk-label--${props.labelSize}`;
    }

    return (
        <GdsFormGroup {...idProp} isError={showErrors}>
            {props.title && (
                <Label className={labelClass} {...htmlForProp}>
                    {props.title}
                </Label>
            )}
            {props.labelHint && <Hint className={props.hintClass}>{props.labelHint}</Hint>}

            <GdsErrorMessage showError={showErrors} message={errorMessage} name={`${props.name}`} />
            {props.children}
        </GdsFormGroup>
    );
};
