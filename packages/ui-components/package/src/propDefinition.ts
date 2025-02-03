import { ValidationResult } from '@ukri-tfs/validation';

export interface RequiredProps {
    name: string;
}

export interface WithLabelProps extends RequiredProps {
    label: string;
    hint?: string;
    describedBy?: string;
}

export interface WithValidationProps extends RequiredProps {
    isError?: boolean;
    errorMessage?: string;
    errorMessages?: string[];
    validation?: ValidationResult;
}

export type InputFieldBoilerplateProps = WithLabelProps & WithValidationProps;
