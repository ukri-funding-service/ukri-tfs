export * from './withPagination';

import React from 'react';
import { GdsDetails } from '../components/details';
import { GdsErrorMessage } from '../components/errorMessage';
import { GdsFormGroup } from '../components/form/formGroup';
import { ValidationResult } from '@ukri-tfs/validation';
import { Label, Hint } from 'govuk-react-jsx';

interface RequiredProps {
    name: string;
}

export interface WithLabelProps extends RequiredProps {
    label: string;
    hint?: string;
    describedBy?: string;
}

export interface WithGuidanceProps extends RequiredProps {
    guidance: {
        summary: string;
        details: string;
        guidanceIsHtml?: boolean;
    };
}

export interface WithValidationProps extends RequiredProps {
    isError?: boolean;
    errorMessage?: string;
    errorMessages?: string[];
    validation?: ValidationResult;
}

export type InputFieldBoilerplateProps = WithLabelProps & WithValidationProps;

export type InputFieldBoilerplateAndGuidanceProps = InputFieldBoilerplateProps & WithGuidanceProps;

function isValidationError(validation?: ValidationResult): boolean {
    return !!validation && validation.showValidationErrors() && !validation.isValid();
}

function validationErrorMessage(validation?: ValidationResult): string {
    return !!validation ? validation.errorMessage : '';
}

export function withLabel<T>(WrappedComponent: React.ComponentType<T>): React.ComponentType<T & WithLabelProps> {
    return function FieldWithLabel(props) {
        let aria = {};
        const { name, label, hint, describedBy } = props;

        if (hint && !describedBy) {
            aria = { describedBy: `more-detail-hint-${props.name}` };
        }

        return (
            <React.Fragment>
                <Label htmlFor={name} className="govuk-label--s">
                    {label}
                </Label>
                {hint && <Hint>{hint}</Hint>}
                <WrappedComponent {...aria} {...props} />
            </React.Fragment>
        );
    };
}

const isError = (props: WithValidationProps) => props.isError || isValidationError(props.validation);
const errorMessage = (props: WithValidationProps) => props.errorMessage || validationErrorMessage(props.validation);

export function withValidation<T>(
    WrappedComponent: React.ComponentType<T>,
): React.ComponentType<T & WithValidationProps> {
    return function FieldWithValidation(props) {
        return (
            <React.Fragment>
                <GdsErrorMessage
                    showError={isError(props)}
                    message={errorMessage(props)}
                    messages={props.errorMessages}
                    name={props.name}
                />
                <WrappedComponent isError={isError(props)} {...props} />
            </React.Fragment>
        );
    };
}

export function withFormGroup<T>(
    WrappedComponent: React.ComponentType<T>,
): React.ComponentType<T & WithValidationProps> {
    return function FieldWithFormGroup(props) {
        return (
            <GdsFormGroup id={`${props.name}-wrapper`} isError={isError(props)}>
                <WrappedComponent isError={isError(props)} {...props} />
            </GdsFormGroup>
        );
    };
}

export function withGuidance<T>(WrappedComponent: React.ComponentType<T>): React.ComponentType<T & WithGuidanceProps> {
    return function FieldWithGuidance(props) {
        return (
            <React.Fragment>
                <GdsDetails
                    title={props.guidance.summary}
                    details={props.guidance.details}
                    className="u-space-b5"
                    detailsAsHtml={props.guidance.guidanceIsHtml}
                    lineBreak={true}
                />
                <WrappedComponent {...props} />
            </React.Fragment>
        );
    };
}

export function withFormField<T>(
    WrappedComponent: React.ComponentType<T>,
): React.ComponentType<T & InputFieldBoilerplateProps> {
    return withFormGroup(withLabel(withValidation(WrappedComponent)));
}

export function withFormFieldAndGuidance<T>(
    WrappedComponent: React.ComponentType<T>,
): React.ComponentType<T & InputFieldBoilerplateAndGuidanceProps> {
    return withFormGroup(withLabel(withValidation(withGuidance(WrappedComponent))));
}
