import React from 'react';
import { HeaderLink, SkipLink } from 'govuk-react-jsx';
import logo from '../../images/ukri_logo_new.svg';
import externalImage from '../../images/external_graphic.svg';
import adminImage from '../../images/admin_graphic.svg';
import { Dropdown } from './dropdown';

export interface HeaderProps {
    isAdmin?: boolean;
    signedIn?: boolean;
    items: HeaderLink[];
    signOutItem?: HeaderLink;
    id?: string;
    displayName?: string;
}

export interface HeaderState {
    jsEnabled: boolean;
    mobileMenuOpen: boolean;
}

const join = (originalValue: string, newValue: string, check: boolean) => {
    return check ? `${originalValue} ${newValue}` : originalValue;
};

const navItem = (item: HeaderLink, onlyShowOnMobileMenu = false) => {
    const listItemClassName = join('new-header__nav-item', 'new-header__nav-item--user', onlyShowOnMobileMenu);
    const anchorClassName = join('new-header__nav-link', 'new-header__nav-link--active', !!item.currentlySelected);

    if (item.url === undefined) {
        return (
            <li key={item.id} className={listItemClassName}>
                <span className="new-header__nav-link-not">{item.text}</span>
            </li>
        );
    }
    return (
        <li key={item.id} className={listItemClassName}>
            {item.url === undefined}
            <a
                id={item.id}
                href={item.url}
                className={anchorClassName}
                aria-current={item.currentlySelected ? 'page' : undefined}
            >
                {item.text}
            </a>
        </li>
    );
};

const areAnyItemsActive = (items: HeaderLink[]) => {
    return items.reduce((active, item) => {
        return active || !!item.isActive;
    }, false);
};

// for rendering a default signout menu item
const defaultSignOutItemConfig: HeaderLink = {
    id: 'headerSignOutItemLink',
    text: 'Sign out',
    url: '/signOut',
    currentlySelected: false,
    isActive: true,
    navType: 'USER',
};

export class Header extends React.Component<HeaderProps, HeaderState> {
    state = {
        jsEnabled: false,
        mobileMenuOpen: false,
    };

    componentDidMount(): void {
        this.setState(() => ({ jsEnabled: true }));
    }

    toggleMobileMenu = (): void => this.setState(() => ({ mobileMenuOpen: !this.state.mobileMenuOpen }));

    getSignOutItem(headerProps: HeaderProps): HeaderLink {
        return headerProps.signOutItem || defaultSignOutItemConfig;
    }

    render(): React.ReactNode {
        const { isAdmin, signedIn, id, items, displayName } = this.props;
        const signOutItem = this.getSignOutItem(this.props);
        const { jsEnabled, mobileMenuOpen } = this.state;
        const adminClass = isAdmin ? 'new-header--admin' : 'new-header--external';
        const isDropdownMenuRequired = (items.length > 0 && areAnyItemsActive(items)) || signedIn;
        const backgroundImage = isAdmin ? adminImage : externalImage;
        const navItems = signedIn ? [...items, signOutItem] : items;

        const mobileDropdownMenu = (
            <React.Fragment>
                <button
                    onClick={this.toggleMobileMenu}
                    className="mobile-menu"
                    type="button"
                    aria-controls="mobile-nav"
                    aria-expanded={mobileMenuOpen}
                >
                    Menu <span>▼</span>
                </button>
                <nav className={`new-header__nav ${!mobileMenuOpen && 'new-header__nav--touch-hide'}`}>
                    <ul className="new-header__nav-list">
                        {/* render top navigational items */}
                        {navItems
                            .filter(itemConfig => itemConfig.navType === 'TOP')
                            .map(itemConfig => {
                                return itemConfig.isActive ? navItem(itemConfig, false) : null;
                            })}
                        {/* render user navigation items */}
                        {navItems
                            .filter(itemConfig => itemConfig.navType === 'USER')
                            .map(itemConfig => {
                                return itemConfig.isActive ? navItem(itemConfig, true) : null;
                            })}
                    </ul>
                    <ul className="new-header__nav-list">
                        {navItems
                            .filter(itemConfig => itemConfig.navType === 'ORGANISATION')
                            .map(itemConfig => {
                                return itemConfig.isActive ? navItem(itemConfig, true) : null;
                            })}
                    </ul>
                </nav>
            </React.Fragment>
        );

        const userNavigationItems = navItems
            .filter(itemConfig => itemConfig.navType === 'USER')
            .filter(itemConfig => itemConfig.url !== undefined)
            .map(itemConfig => ({ url: itemConfig.url || '#', name: itemConfig.text }));

        const organisationNavigationItems = navItems
            .filter(itemConfig => itemConfig.navType === 'ORGANISATION')
            .filter(itemConfig => itemConfig.url !== undefined)
            .map(itemConfig => ({ url: itemConfig.url || '#', name: itemConfig.text }));

        const signedInDropDown =
            signedIn && displayName ? (
                <React.Fragment>
                    {organisationNavigationItems && organisationNavigationItems.length > 0 && (
                        <Dropdown
                            id="organisations-dropdown-menu"
                            heading="Account view"
                            items={organisationNavigationItems}
                        />
                    )}
                    <Dropdown
                        id="user-dropdown-menu"
                        heading={displayName || 'Display name'}
                        items={userNavigationItems}
                    />
                </React.Fragment>
            ) : (
                ''
            );

        return (
            <React.Fragment>
                <SkipLink href="#main-content">Skip to main content</SkipLink>
                <header className={`new-header ${adminClass} ${jsEnabled && 'js-enabled'}`} id={id} role="banner">
                    <div className="container new-header__top">
                        <div className="columns">
                            <div className="column ">
                                <a
                                    href="https://www.ukri.org/"
                                    className="new-header__brand"
                                    title="(UKRI) UK Research and Innovation Funding Service homepage"
                                    aria-label="Return to (UKRI) UK Research and Innovation Funding Service homepage"
                                >
                                    <img src={logo} alt="UKRI logo" />
                                </a>
                                {isDropdownMenuRequired && mobileDropdownMenu}
                            </div>
                        </div>
                    </div>
                    <div className="new-header__bar" style={{ backgroundImage: `url(${backgroundImage})` }}>
                        <div className="container">
                            <div className="columns">
                                <div className="column">
                                    <span className="new-header__service">Funding Service</span>
                                    <div className="nav-wrapper">
                                        <div className="user-header">{signedIn && signedInDropDown}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </React.Fragment>
        );
    }
}
