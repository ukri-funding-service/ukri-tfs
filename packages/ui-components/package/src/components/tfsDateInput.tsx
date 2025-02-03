import { DateInput } from 'govuk-react-jsx';
import React, { ReactElement } from 'react';

export type TfsDateInputProps = {
    defaultValueDay?: string;
    defaultValueMonth?: string;
    defaultValueYear?: string;
    errorMessage?: string;
    heading: string;
    componentId: string;
    namePrefixValue?: string;
    hint?: string | ReactElement;
    disabled?: boolean;
};

export const TfsDateInput = ({
    defaultValueDay,
    defaultValueMonth,
    defaultValueYear,
    errorMessage,
    heading,
    componentId,
    namePrefixValue = 'date-picker-date',
    hint,
    disabled,
}: TfsDateInputProps): ReactElement => {
    const cellErrorMessageStyle = errorMessage ? ' govuk-input--error' : '';

    return (
        <div className="govuk-body">
            <DateInput
                fieldset={{
                    legend: {
                        children: <strong>{heading}</strong>,
                    },
                }}
                errorMessage={
                    errorMessage
                        ? {
                              children: errorMessage,
                          }
                        : undefined
                }
                hint={
                    hint
                        ? {
                              children: hint,
                          }
                        : undefined
                }
                id={componentId}
                namePrefix={namePrefixValue}
                items={[
                    {
                        className: 'govuk-input--width-2' + cellErrorMessageStyle,
                        name: 'day',
                        defaultValue: defaultValueDay ? defaultValueDay : undefined,
                        disabled,
                    },
                    {
                        className: 'govuk-input--width-2' + cellErrorMessageStyle,
                        name: 'month',
                        defaultValue: defaultValueMonth ? defaultValueMonth : undefined,
                        disabled,
                    },
                    {
                        className: 'govuk-input--width-4' + cellErrorMessageStyle,
                        name: 'year',
                        defaultValue: defaultValueYear ? defaultValueYear : undefined,
                        disabled,
                    },
                ]}
            />
        </div>
    );
};
