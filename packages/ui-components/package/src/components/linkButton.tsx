import React from 'react';

export interface LinkButtonProps {
    id?: string;
    className?: string;
    href: string;
    text: React.ReactNode;
    openInNewTab?: boolean;
    ariaLabel?: string;
    ariaDescribedBy?: string;
}

export const GdsLinkButton: React.FC<LinkButtonProps> = ({
    className,
    id,
    href,
    openInNewTab = false,
    text,
    ariaLabel,
    ariaDescribedBy,
}) => {
    const props = {
        href: href,
        className: className || 'govuk-link',

        ...{ id },
    };
    return (
        <a
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            {...props}
            target={openInNewTab ? '_blank' : '_self'}
            rel={openInNewTab ? 'noopener noreferrer' : ''}
        >
            {text}
        </a>
    );
};
