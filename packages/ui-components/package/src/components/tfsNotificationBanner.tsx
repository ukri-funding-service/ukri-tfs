import { NotificationBannerProps } from 'govuk-react-jsx';
import React, { ReactNode } from 'react';
import { HeadingText, TagSize } from './heading';

export const TfsNotificationBanner: React.FunctionComponent<NotificationBannerProps> = (
    props: NotificationBannerProps,
): JSX.Element => {
    const {
        titleId,
        type,
        disableAutoFocus,
        role,
        titleChildren,
        titleHeadingLevel,
        children,
        className,
        ...attributes
    } = props;

    let typeClass = '';
    let roleAttribute = 'region';
    let title = 'Important';

    if (type === 'success') {
        typeClass = `govuk-notification-banner--success`;
        roleAttribute = 'alert';
        title = 'Success';
    }

    if (role) {
        roleAttribute = role;
    }

    if (titleChildren) {
        title = titleChildren;
    }

    return (
        <div
            className={`govuk-notification-banner ${typeClass} ${className || ''}`}
            role={roleAttribute}
            aria-labelledby={titleId}
            data-module="govuk-notification-banner"
            {...(disableAutoFocus !== false ? { 'data-disable-auto-focus': 'true' } : {})}
            {...attributes}
        >
            <div className="govuk-notification-banner__header">
                <HeadingText
                    className="govuk-notification-banner__title"
                    id={titleId}
                    text={title}
                    size="no-size-tag"
                    tag={('h' + (titleHeadingLevel ?? 2)) as TagSize}
                />
            </div>
            <div className="govuk-notification-banner__content">
                {typeof children === 'string' ? (
                    <TfsNotificationBannerMainText>{children}</TfsNotificationBannerMainText>
                ) : (
                    children
                )}
            </div>
        </div>
    );
};

interface HeadingProps {
    children?: ReactNode;
}

// Only use a banner heading if you are introducing a body of text in the notification banner
export const TfsNotificationBannerHeading: React.FunctionComponent<HeadingProps> = (
    props: HeadingProps,
): JSX.Element => {
    return <h3 className="govuk-notification-banner__heading">{props.children}</h3>;
};

// Use banner main text when you want heading size text without other content
export const TfsNotificationBannerMainText: React.FunctionComponent<HeadingProps> = (
    props: HeadingProps,
): JSX.Element => {
    return <p className="govuk-notification-banner__heading">{props.children}</p>;
};
