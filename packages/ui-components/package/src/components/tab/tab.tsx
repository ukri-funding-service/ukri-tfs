import React from 'react';

interface TabProps {
    id: string;
    selected?: boolean;
    url?: string;
    label: string | React.ReactNode;
    children?: React.ReactNode | React.ReactNode[];
    onClick?: React.MouseEventHandler;
    mode?: 'button' | 'tab';
}

export const GdsTab = ({ children, id, label, mode, selected, url, onClick }: TabProps): JSX.Element | null => {
    switch (mode) {
        case 'button': {
            const className = selected
                ? 'govuk-tabs__list-item govuk-tabs__list-item--selected'
                : 'govuk-tabs__list-item';

            return (
                <li key={`${id}-tab-button`} className={className} role="presentation">
                    <a
                        className="govuk-tabs__tab"
                        href={url}
                        id={`${id}-tab-button`}
                        role="tab"
                        aria-selected={selected}
                        onClick={onClick}
                    >
                        {label}
                    </a>
                </li>
            );
        }
        default: {
            if (!children) return null;

            const className = selected ? 'govuk-tabs__panel' : 'govuk-tabs__panel govuk-tabs__panel--hidden';
            return (
                <div
                    className={className}
                    key={id}
                    id={id}
                    role="tabpanel"
                    aria-labelledby={`${id}-tab-button`}
                    onClick={onClick}
                >
                    {children}
                </div>
            );
        }
    }
};
