import React from 'react';

interface NavigationItem {
    url: string;
    name: string;
}

interface NavigationListProps {
    heading: string;
    items: NavigationItem[];
}

export const NavigationList: React.FunctionComponent<NavigationListProps> = props => {
    return (
        <nav>
            <h2 className="govuk-heading-s govuk-heading--link">{props.heading}</h2>
            <ul className="govuk-list">
                {props.items.map(value => {
                    return (
                        <li key={value.url}>
                            <a href={value.url} className="govuk-link">
                                {value.name}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};
