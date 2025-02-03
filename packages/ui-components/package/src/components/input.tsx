import { ValidationResult } from '@ukri-tfs/validation';
import React from 'react';
import { multiValidationTypes, multiValidationTypesResponse } from '../helpers/multiValidationTypes';
import { Input as GdsInput } from './govuk-react-jsx';

export interface InputProps {
    name: string;
    className?: string;
    type?: 'text' | 'number' | 'password' | 'hidden' | 'email';
    defaultValue?: string;
    value?: string | number;
    label?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    widthSize?: '' | '30' | '20' | '10' | '7' | '5' | '4' | '3' | '2';
    labelSize?: 's' | 'm' | 'l';
    hint?: string | JSX.Element;
    placeholder?: string;
    describedBy?: string;
    validation?: ValidationResult;
    disableErrorMessage?: boolean;
    //errorMessages and isError are deprecated, use validation instead
    errorMessages?: string[];
    formGroupClassName?: string;
    useFormGroup?: boolean;
    isError?: boolean;
    disabled?: boolean;
    disableSteps?: boolean;
    step?: number;
    additionalLabelClasses?: string;
    maxLength?: number;
    minLength?: number;
    prefix?: {
        className?: string;
        children: JSX.Element;
    };
    suffix?: {
        className?: string;
        children: JSX.Element;
    };
}

const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const invalidKeys = ['ArrowUp', 'ArrowDown'];
    if (invalidKeys.indexOf(event.key.valueOf()) >= 0) {
        event.preventDefault();
        return false;
    }
    return true;
};

const onMouseWheel = (event: React.WheelEvent<HTMLInputElement>) => {
    (event.target as HTMLElement).blur();
};

// eslint-disable-next-line complexity
export const Input = (props: InputProps): JSX.Element => {
    const {
        name,
        label,
        widthSize,
        hint,
        className,
        defaultValue,
        value,
        labelSize = 's',
        onChange,
        formGroupClassName,
        useFormGroup = true,
        validation,
        onFocus,
        errorMessages,
        isError,
        disableErrorMessage,
        disabled,
        maxLength,
        minLength,
        disableSteps,
    } = props;
    const multiValidation = multiValidationTypes({
        validationResult: validation,
        isError: isError,
        errorMessages: errorMessages,
        showError: disableErrorMessage,
    });
    const classNames: string[] = generateClassNames(widthSize, className, multiValidation);

    let renderErrorMessage: { children: string | string[] } | null = null;
    if (multiValidation.showError) {
        renderErrorMessage =
            multiValidation.errorMessages && multiValidation.errorMessages.length !== 0
                ? { children: multiValidation.errorMessages }
                : null;
    }

    const {
        formGroupClassName: _formGroupClassName,
        isError: _isError,
        errorMessages: _errorMessages,
        widthSize: _widthSize,
        ...reactAllowedProps
    } = props;

    let extraParams = {};

    if (disableSteps !== undefined && disableSteps) {
        extraParams = {
            onWheel: (e: React.WheelEvent<HTMLInputElement>) => {
                onMouseWheel(e);
            },
            onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                onKeyDown(e);
            },
        };
    }

    return (
        <GdsInput
            {...reactAllowedProps}
            {...extraParams}
            id={name}
            {...(hint ? { hint: { children: [hint] } } : {})}
            formGroup={useFormGroup ? formGroupClassName && { className: formGroupClassName } : undefined}
            label={
                label && {
                    children: [label],
                    id: `gds-label-${name}`,
                    className: `govuk-label--${labelSize}${
                        props.additionalLabelClasses ? ' ' + props.additionalLabelClasses : ''
                    }`,
                }
            }
            defaultValue={value ? value : defaultValue}
            errorMessage={renderErrorMessage}
            className={classNames && classNames.join(' ')}
            onChange={
                onChange
                    ? (e: React.ChangeEvent<HTMLInputElement>) => {
                          onChange(e);
                      }
                    : undefined
            }
            onFocus={
                onFocus
                    ? (e: React.FocusEvent<HTMLInputElement>): void => {
                          onFocus(e);
                      }
                    : undefined
            }
            disable={disabled}
            {...(maxLength ? { maxLength: maxLength } : {})}
            {...(minLength ? { minLength: minLength } : {})}
        />
    );
};
function generateClassNames(
    widthSize: string | undefined,
    className: string | undefined,
    multiValidation: multiValidationTypesResponse<string[] | undefined>,
) {
    const classNames: string[] = [];
    if (widthSize) {
        classNames.push(`govuk-input--width-${widthSize}`);
    }
    if (className) {
        classNames.push(className);
    }
    if (!multiValidation.isValid) {
        classNames.push('govuk-input--error');
    }
    return classNames;
}
