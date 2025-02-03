import React, { KeyboardEvent } from 'react';

interface NavigationItem {
    url: string;
    name: string;
}

interface DropdownProps {
    id: string;
    heading: string;
    items: NavigationItem[];
}

export const Dropdown: React.FunctionComponent<DropdownProps> = props => {
    /* istanbul ignore next */
    const escFunction = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            const main = document.getElementById('main-content');
            if (main) {
                const focusable = main.querySelectorAll('button, a, input, [tabindex="0"]');
                const firstElement = focusable[0] as HTMLElement;
                firstElement.focus();
            }
        }
    };

    return (
        <div className="nav-bar" role="navigation" aria-label="User Navigation" onKeyDown={escFunction}>
            <ul className="nav-bar__list">
                <li className="dropdown">
                    <button
                        id={props.id}
                        type="button"
                        className="dropdown__title"
                        aria-expanded="false"
                        aria-controls="user-dropdown"
                    >
                        {props.heading}
                    </button>
                    <ul className="dropdown__menu" id="user-dropdown">
                        {props.items.map(value => {
                            return (
                                <li key={`user-dropdown-item-${value.name}`}>
                                    <a id={value.name.replace(/\s/g, '').toLowerCase()} href={value.url}>
                                        {value.name}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </li>
            </ul>
        </div>
    );
};
