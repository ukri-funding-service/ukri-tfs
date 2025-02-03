import React from 'react';
import { ErrorMessageProps, HintProps, LabelProps, Select, SelectOptionProps } from 'govuk-react-jsx';
import { isBrowser } from '../helpers/isBrowser';
import { ValidationResult } from '@ukri-tfs/validation';
import { multiValidationTypes } from '../helpers/multiValidationTypes';

// Had to redeclare this exactly because extending the interface doesn't work.
export interface GdsTypeAheadProps extends React.HTMLAttributes<HTMLSelectElement> {
    label?: LabelProps;
    hint?: HintProps;
    name?: string;
    items?: SelectOptionProps[];
    formGroup?: { className: string };
    errorMessage?: ErrorMessageProps;
    validation?: ValidationResult;
    onConfirm?: Function;
    confirmOnBlur?: boolean;
    disabled?: boolean;
}
export class GdsTypeAhead extends React.Component<GdsTypeAheadProps> {
    /**
     * Progressive enhancement to use the alpha-gov accessible-autocomplete component
     */
    componentDidMount(): void {
        if (!this.props.disabled && isBrowser(process, window) && document.querySelector(`#${this.props.id}`)) {
            const { enhanceSelectElement } = require('accessible-autocomplete');
            enhanceSelectElement({
                selectElement: document.querySelector(`#${this.props.id}`),
                ...this.props,
            });
        }
    }

    render(): React.ReactElement {
        const { validation, errorMessage } = this.props;
        const multiValidation = multiValidationTypes({ validationResult: validation, errorMessages: errorMessage });
        const classNames: string[] = [];

        if (!multiValidation.isValid) {
            classNames.push('typeAhead_errorContainer');
        }

        // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
        const { onConfirm, confirmOnBlur, ...selectProps } = this.props;
        return (
            <div className={classNames && classNames.join(' ')}>
                <Select {...selectProps} />
            </div>
        );
    }
}

export const normalizeTypeAheadValue = (value: string | string[] | undefined): string | null => {
    if (value === undefined) {
        return null;
    }
    return Array.isArray(value) ? value[value.length - 1] : value;
};
