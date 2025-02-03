import React from 'react';
import { Checkboxes, CheckboxesProps, CheckboxesItemProps } from 'govuk-react-jsx';

interface MarkAsCompleteProps {
    id: string;
    value: string;
    text: string;
    checked?: boolean;
    disabled?: boolean;
}

export const MarkAsComplete: React.FC<MarkAsCompleteProps> = props => {
    const markAsCompleteItem: CheckboxesItemProps = {
        id: props.id,
        name: props.id,
        children: [props.text],
        value: props.value,
        defaultChecked: props.checked,
        disabled: props.disabled,
    };

    const checkboxesProps: CheckboxesProps = {
        fieldset: {
            legend: {
                children: ['Mark as complete'],
                className: 'govuk-visually-hidden',
            },
        },
        items: [markAsCompleteItem],
    };

    return (
        <div className="mark-as-complete-wrapper">
            <Checkboxes {...checkboxesProps}></Checkboxes>
        </div>
    );
};
