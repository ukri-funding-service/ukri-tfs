import React from 'react';

interface TabGroupProps {
    id: string;
    heading?: string;
    children?: React.ReactNode | React.ReactNode[];
    sticky?: boolean;
}

const augmentTab = (tab: React.ReactNode, idx: number): JSX.Element => {
    const tabElement = tab as React.ReactElement;
    const { url, id } = tabElement.props;

    return React.cloneElement(tab as React.ReactElement, {
        url: url ?? `#${id}`,
        mode: 'tab',
        key: 'tab' + idx,
    });
};

const augmentButton = (tab: React.ReactNode, index: number): JSX.Element =>
    React.cloneElement(tab as React.ReactElement, { mode: 'button', key: 'button-' + index });

export const GdsTabGroup = ({ children, id, heading, sticky }: TabGroupProps): JSX.Element => {
    const tabs = (Array.isArray(children) ? children : [children]).map(augmentTab);
    const buttons = tabs.map(augmentButton);

    const className = 'govuk-tabs tfs-tabs' + (sticky ? ' tabs-sticky' : '');
    return (
        <div id={id} className={className} data-module="govuk-tabs">
            {heading && <h2 className="govuk-tabs__title">{heading}</h2>}
            <ul className="govuk-tabs__list" role="tablist">
                {buttons}
            </ul>
            {tabs}
        </div>
    );
};
