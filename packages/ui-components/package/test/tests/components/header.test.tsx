import React from 'react';
import { RenderResult, render } from '@testing-library/react';
import { expect } from 'chai';
import { Header } from '../../../src/components';

interface HeaderLink {
    id: string;
    text: string;
    url?: string;
    currentlySelected?: boolean;
    isActive: boolean;
    navType: 'TOP' | 'USER';
}

describe('<Header /> component tests', () => {
    let wrapper: RenderResult;

    afterEach(() => {
        wrapper.unmount();
    });

    it('should render with default props', () => {
        wrapper = render(<Header items={[]} />);
        expect(wrapper.container.querySelector('.new-header')).to.not.be.null;
    });

    it('should add the js-enabled class to the top level html element if javascript enabled', () => {
        wrapper = render(<Header items={[]} />);
        expect(wrapper.container.querySelector('.js-enabled')).to.not.be.null;
    });

    it('should render yellow for admin version', () => {
        wrapper = render(<Header items={[]} isAdmin={true} />);
        expect(wrapper.container.querySelector('.new-header.new-header--admin')).to.not.be.null;
    });

    it('should render purple for external version', () => {
        wrapper = render(<Header items={[]} isAdmin={false} />);
        expect(wrapper.container.querySelector('.new-header.new-header--external')).to.not.be.null;
    });

    it('should render a signout button if signedIn prop is true', () => {
        wrapper = render(<Header items={[]} signedIn={true} />);
        expect(wrapper.container.querySelector('a[href="/signOut"]')).to.not.be.null;
    });

    it('should render the id if supplied', () => {
        wrapper = render(<Header items={[]} id="test" />);
        expect(wrapper.container.querySelector('#test')).to.not.be.null;
    });

    it('should render the overridden signOut link if supplied', () => {
        const signOutLink: HeaderLink = {
            id: 'overriddenId',
            text: 'overriddenText',
            isActive: true,
            navType: 'USER',
            url: '/overriddenUrl',
        };
        wrapper = render(<Header items={[]} signOutItem={signOutLink} id="test" signedIn={true} />);
        expect(wrapper.container.querySelector('a[href="/overriddenUrl"]')).to.not.be.null;
    });

    it('should render a list of active items within the header', () => {
        // given
        const headerItems: HeaderLink[] = [
            {
                id: 'headerOpportunitiesLink',
                text: 'Opportunties',
                url: '/foo',
                isActive: true,
                navType: 'TOP',
            },
            {
                id: 'headerApplicationsLink',
                text: 'Applications',
                url: '/bar',
                isActive: true,
                navType: 'TOP',
            },
        ];

        // when
        wrapper = render(<Header items={headerItems} id="test" />);

        // then
        expect(wrapper.container.querySelector('#headerOpportunitiesLink')).to.not.be.null;
        expect(wrapper.container.querySelector('#headerApplicationsLink')).to.not.be.null;
    });

    it('should render a list of items within the header and not render the inactive item', () => {
        // given
        const headerItems: HeaderLink[] = [
            {
                id: 'headerOpportunitiesLink',
                text: 'Opportunties',
                url: '/foo',
                currentlySelected: false,
                isActive: true,
                navType: 'TOP',
            },
            {
                id: 'inactiveLink',
                text: 'Inactive',
                url: '/inactive',
                currentlySelected: false,
                isActive: false,
                navType: 'TOP',
            },
            {
                id: 'headerApplicationsLink',
                text: 'Applications',
                url: '/bar',
                currentlySelected: false,
                isActive: true,
                navType: 'TOP',
            },
        ];

        // when
        wrapper = render(<Header items={headerItems} id="test" />);

        // then
        expect(wrapper.container.querySelector('#inactiveLink')).to.be.null;
    });

    it(`should render dropdown when signed in but no items are passed in`, () => {
        // given
        const items: HeaderLink[] = [];

        // when
        wrapper = render(<Header items={items} id="test" signedIn={true} />);

        // then
        expect(wrapper.container.querySelector('.new-header__nav')).to.not.be.null;
    });

    it(`should render dropdown when signed in with one item passed in that is active`, () => {
        // given
        const items: HeaderLink[] = [
            {
                id: 'headerOpportunitiesLink',
                text: 'Opportunties',
                url: '/foo',
                isActive: true,
                navType: 'TOP',
            },
        ];

        // when
        wrapper = render(<Header items={items} id="test" signedIn={true} />);

        // then
        expect(wrapper.container.querySelector('.new-header__nav')).to.not.be.null;
    });

    it(`should render dropdown when signed in with one item passed in that is inactive`, () => {
        // given
        const items: HeaderLink[] = [
            {
                id: 'headerOpportunitiesLink',
                text: 'Opportunties',
                url: '/foo',
                isActive: false,
                navType: 'TOP',
            },
        ];

        // when
        wrapper = render(<Header items={items} id="test" signedIn={true} />);

        // then
        expect(wrapper.container.querySelector('.new-header__nav')).to.not.be.null;
    });

    it(`should not render dropdown when signed out and no items are passed in`, () => {
        // given
        const items: HeaderLink[] = [];

        // when
        wrapper = render(<Header items={items} id="test" signedIn={false} />);

        // then
        expect(wrapper.container.querySelector('.new-header__nav')).to.be.null;
    });

    it(`should not render dropdown when signed out and one item passed in that is inactive`, () => {
        // given
        const items: HeaderLink[] = [
            {
                id: 'headerOpportunitiesLink',
                text: 'Opportunties',
                url: '/foo',
                isActive: false,
                navType: 'TOP',
            },
        ];

        // when
        wrapper = render(<Header items={items} id="test" signedIn={false} />);

        // then
        expect(wrapper.container.querySelector('.new-header__nav')).to.be.null;
    });

    it(`should render dropdown when signed out and one item passed in that is active`, () => {
        // given
        const items: HeaderLink[] = [
            {
                id: 'headerOpportunitiesLink',
                text: 'Opportunties',
                url: '/foo',
                isActive: true,
                navType: 'TOP',
            },
        ];

        // when
        wrapper = render(<Header items={items} id="test" signedIn={false} />);

        // then
        expect(wrapper.container.querySelector('.new-header__nav')).to.not.be.null;
    });

    it('should render the nav bar when active list items are passed in and user is signed in without displayName', () => {
        // given
        const headerItems: HeaderLink[] = [
            {
                id: 'headerOpportunitiesLink',
                text: 'Opportunties',
                url: '/foo',
                currentlySelected: false,
                isActive: true,
                navType: 'TOP',
            },
            {
                id: 'inactiveLink',
                text: 'Inactive',
                url: '/inactive',
                currentlySelected: false,
                isActive: false,
                navType: 'TOP',
            },
            {
                id: 'headerApplicationsLink',
                text: 'Applications',
                url: '/bar',
                isActive: true,
                navType: 'TOP',
            },
        ];

        // when
        wrapper = render(<Header items={headerItems} signedIn={true} id="test" />);

        // then
        expect(wrapper.container.querySelector('#inactiveLink')).to.be.null;
        expect(wrapper.container.querySelector('#user-dropdown-menu')).to.be.null;
    });

    it('should render the nav bar when active list items are passed in and user is signed in with displayName', () => {
        // given
        const headerItems: HeaderLink[] = [
            {
                id: 'headerOpportunitiesLink',
                text: 'Opportunties',
                url: '/foo',
                currentlySelected: false,
                isActive: true,
                navType: 'TOP',
            },
            {
                id: 'inactiveLink',
                text: 'Inactive',
                url: '/inactive',
                currentlySelected: false,
                isActive: false,
                navType: 'TOP',
            },
            {
                id: 'headerApplicationsLink',
                text: 'Applications',
                url: '/bar',
                isActive: true,
                navType: 'TOP',
            },
        ];

        // when
        wrapper = render(<Header items={headerItems} signedIn={true} id="test" displayName="test user" />);

        // then
        expect(wrapper.container.querySelector('#user-dropdown-menu')?.textContent).to.equal('test user');
    });

    it('should render the nav bar with 1 currentlySelected item', () => {
        // given
        const headerItems: HeaderLink[] = [
            {
                id: 'headerOpportunitiesLink',
                text: 'Opportunties',
                url: '/foo',
                currentlySelected: true,
                isActive: true,
                navType: 'TOP',
            },
            {
                id: 'headerApplicationsLink',
                text: 'Applications',
                url: '/foo',
                currentlySelected: false,
                isActive: true,
                navType: 'TOP',
            },
        ];

        // when
        wrapper = render(<Header items={headerItems} id="test" />);

        // then
        const active = wrapper.container.querySelectorAll('.new-header__nav-link--active[aria-current=page]');
        expect(active.length).to.equal(1);
    });

    it('should render the skip link', () => {
        wrapper = render(<Header items={[]} />);
        expect(wrapper.container.querySelector('.govuk-skip-link')).to.not.be.null;
    });
});
