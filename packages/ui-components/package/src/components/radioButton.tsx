import { Hint, Label } from 'govuk-react-jsx';
import React from 'react';

export interface RadioButtonProps {
    id: string;
    name: string;
    classname?: string;
    value: string;
    text: string;
    checked?: boolean;
    hint?: string;
    revealContent?: React.ReactNode | React.ReactNode[];
    revealContentBottom?: boolean;
    revealContentClassName?: string;
    divider?: string;
    disabled?: boolean;
}

export const GdsRadioButton: React.FunctionComponent<RadioButtonProps> = (props): JSX.Element => {
    if (!props.text || !props.text.trim()) return <React.Fragment />;

    return (
        <>
            {props.divider && <div className="govuk-radios__divider">{props.divider}</div>}
            <div className={`govuk-radios__item ${props.classname ?? ''}`}>
                <input
                    className="govuk-radios__input"
                    id={props.id}
                    name={props.name}
                    type="radio"
                    value={props.value}
                    defaultChecked={props.checked}
                    disabled={props.disabled ?? false}
                />
                <Label htmlFor={props.id} className="govuk-label govuk-radios__label">
                    {props.text}
                </Label>
                {props.hint && <Hint className="govuk-radios__hint">{props.hint}</Hint>}
                {!props.revealContentBottom && props.revealContent && (
                    <div
                        className={`govuk-radios__conditional shift-left ${props.revealContentClassName}`}
                        id={`conditional-${props.id}`}
                    >
                        {props.revealContent}
                    </div>
                )}
            </div>
            {props.revealContentBottom && props.revealContent && (
                <div
                    className={`govuk-radios__conditional ${props.revealContentClassName}`}
                    id={`conditional-${props.id}`}
                >
                    {props.revealContent}
                </div>
            )}
        </>
    );
};
