import React, { MouseEventHandler } from 'react';

interface TableCheckboxProps {
    value?: string;
    name: string;
    hiddenLabel: string;
    disabled?: boolean;
    checked?: boolean;
    onClick?: MouseEventHandler;
    className?: string;
}

export const TableCheckbox: React.FC<TableCheckboxProps> = props => {
    const id = `${props.name}-${props.value}`;
    let classes = 'govuk-checkboxes__item govuk-checkboxes__item--snug govuk-checkboxes--small';
    if (props.className) {
        classes += ' ' + props.className;
    }

    return (
        <div className={classes}>
            <input
                className="govuk-checkboxes__input govuk-checkboxes--small"
                id={id}
                name={props.name}
                type="checkbox"
                value={props.value}
                disabled={props.disabled}
                defaultChecked={props.checked}
                onClick={props.onClick}
            />
            <label className="govuk-label govuk-checkboxes__label govuk-label--s " htmlFor={id}>
                <span className="govuk-visually-hidden">Check: {props.hiddenLabel}</span>
            </label>
        </div>
    );
};
