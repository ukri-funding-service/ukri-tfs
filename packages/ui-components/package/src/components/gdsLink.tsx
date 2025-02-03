import React from 'react';

interface GDSLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    testId?: string;
    id?: string;
}

export const GdsLink: React.FunctionComponent<GDSLinkProps> = props => {
    return (
        <a id={props.id} href={props.href} className={`govuk-link ${props.className ?? ''}`} data-testid={props.testId}>
            {props.children}
        </a>
    );
};
