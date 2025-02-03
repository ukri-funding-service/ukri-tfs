// import 'govuk-frontend/govuk/core/_typography.scss';
import React, { ReactNode } from 'react';
import cx from 'classnames';
import { GdsRadioButton, RadioButtonProps } from './radioButton';
import { Paragraph } from './paragraph';

export interface RadiosWithConditionalProps {
    legend: string;
    radioGroupName: string;
    radioData: RadioButtonProps[];
    legendSize?: 'xl' | 'l' | 'm' | 's' | 'hidden';
    radioSize?: 'normal' | 'small';
    radioGroupId?: string;
    className?: string;
    hint?: string | ReactNode;
    errorMessage?: { children: string };
    disabled?: boolean;
}

export const RadiosWithConditional: React.FunctionComponent<RadiosWithConditionalProps> = (props): JSX.Element => {
    if (!props.radioData) return <React.Fragment />;

    const className = props.className ?? 'govuk-radios__item__hack';

    const radioSizeClass = cx({
        'govuk-radios--small': props.radioSize === 'small',
    });

    const legendHidden = props.legendSize === 'hidden';

    const legendClass = cx('govuk-fieldset__legend', {
        [`govuk-fieldset__legend--${props.legendSize}`]: props.legendSize && !legendHidden,
        'govuk-visually-hidden': legendHidden,
    });

    const legend = legendHidden ? (
        props.legend
    ) : (
        <span className="govuk-fieldset__heading govuk-!-font-weight-bold">{props.legend}</span>
    );

    const hint = props.hint ? <div className="govuk-hint">{props.hint}</div> : <></>;

    const errorMessage = props.errorMessage ? (
        <Paragraph id={`${props.radioGroupId}-error`} className="govuk-error-message">
            <span className="govuk-visually-hidden">Error: </span>
            {props.errorMessage.children}
        </Paragraph>
    ) : (
        <></>
    );

    return (
        <div className={`govuk-form-group ${props.errorMessage ? 'govuk-form-group--error' : ''}`}>
            <fieldset className="govuk-fieldset">
                <legend className={legendClass}>{legend}</legend>
                {hint}
                {errorMessage}
                <div className={`govuk-radios ${className} ${radioSizeClass}`} id={props.radioGroupId}>
                    {props.radioData.map(
                        (radioItem): JSX.Element => (
                            <GdsRadioButton
                                classname={radioItem.classname}
                                key={`${props.radioGroupName}_${radioItem.id}`}
                                id={radioItem.id}
                                name={props.radioGroupName}
                                value={radioItem.value}
                                hint={radioItem.hint}
                                checked={radioItem.checked}
                                text={radioItem.text}
                                revealContent={radioItem.revealContent}
                                revealContentBottom={radioItem.revealContentBottom}
                                revealContentClassName={radioItem.revealContentClassName}
                                divider={radioItem.divider}
                                disabled={radioItem.disabled}
                            />
                        ),
                    )}
                </div>
            </fieldset>
        </div>
    );
};
