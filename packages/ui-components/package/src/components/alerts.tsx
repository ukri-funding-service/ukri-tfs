import React from 'react';
import { HeadingText } from './heading';
import { GdsLinkButton } from './linkButton';

export type TfsAlertType = 'success' | 'cross' | 'danger' | 'info' | 'warning' | 'mono';
type TfsAlertTypeMap = Record<TfsAlertType, string>;

interface AlertProps {
    id?: string;
    text: string;
    href?: string;
    linkText?: string;
    alertType?: TfsAlertType;
    headingText?: string;
}

// Tfs alert has an icon inidicating the message type. For screen readers we provide the text equivalent.
const accessibilityMap: TfsAlertTypeMap = {
    success: 'success',
    cross: 'error',
    danger: 'warning',
    info: 'info',
    warning: '',
    mono: 'info',
};

export const TfsAlert = (props: AlertProps): JSX.Element => {
    let className = 'alerts';
    const hasLink = props.href && props.linkText;
    if (hasLink) {
        className += ' alerts--link';
    }
    if (props.alertType) {
        className += ` alerts--${props.alertType}`;
    }
    const heading = props.headingText ? <HeadingText size="s" text={props.headingText} tag="h3" /> : undefined;
    const accessibilityMessage = props.alertType ? accessibilityMap[props.alertType] : '';
    return (
        <div className={className}>
            {
                <>
                    {!!accessibilityMessage && (
                        <span className="govuk-visually-hidden">{accessibilityMessage}:&nbsp;</span>
                    )}
                    {heading}
                    {props.text}{' '}
                    {hasLink ? <GdsLinkButton href={props.href!} text={props.linkText!}></GdsLinkButton> : <></>}
                </>
            }
        </div>
    );
};
