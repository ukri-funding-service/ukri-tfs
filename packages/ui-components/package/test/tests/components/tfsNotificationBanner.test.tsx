import { expect } from 'chai';
import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import { TfsNotificationBanner, TfsNotificationBannerHeading, TfsNotificationBannerMainText } from '../../../src';
describe('<TfsNotificationBanner /> component tests', () => {
    let component: RenderResult;
    afterEach(() => {
        component.unmount();
    });
    it('should render notification banners with defaults', () => {
        component = render(
            <TfsNotificationBanner titleId="test">
                <></>
            </TfsNotificationBanner>,
        );
        expect(component.container.querySelectorAll('h2').length).to.equal(1);
        expect(component.container.querySelector('h2')!.textContent).to.contain('Important');
        expect(component.container.querySelectorAll('div[role=region]').length).to.equal(1);
        expect(component.container.querySelectorAll('div[data-disable-auto-focus=true]').length).to.equal(1);
    });

    it('should render Success banner if success type provided', () => {
        component = render(
            <TfsNotificationBanner titleId="test" type="success">
                <></>
            </TfsNotificationBanner>,
        );
        expect(component.container.querySelectorAll('h2').length).to.equal(1);
        expect(component.container.querySelector('h2')!.textContent).to.contain('Success');
        expect(component.container.querySelectorAll('div[role=alert]').length).to.equal(1);
        expect(component.container.querySelectorAll('.govuk-notification-banner--success').length).to.equal(1);
    });

    it('should render a role roleAttribute provided', () => {
        component = render(
            <TfsNotificationBanner titleId="test" type="success" role="whatever">
                <></>
            </TfsNotificationBanner>,
        );
        expect(component.container.querySelectorAll('div[role=whatever]').length).to.equal(1);
    });

    it('title should be overwritable', () => {
        component = render(
            <TfsNotificationBanner titleId="test" titleChildren="some-title">
                <></>
            </TfsNotificationBanner>,
        );
        expect(component.container.querySelector('h2')!.textContent).to.contain('some-title');
    });

    it('disableAutoFocus should be overwritable', () => {
        component = render(
            <TfsNotificationBanner titleId="test" disableAutoFocus={false}>
                <></>
            </TfsNotificationBanner>,
        );
        expect(component.container.querySelectorAll('div[data-disable-auto-focus=true]').length).to.equal(0);
    });

    it('should handle string content as children', () => {
        component = render(
            <TfsNotificationBanner titleId="test" disableAutoFocus={false}>
                child content
            </TfsNotificationBanner>,
        );
        expect(component.container.querySelectorAll('p.govuk-notification-banner__heading').length).to.equal(1);
    });

    it('should handle string content as children', () => {
        component = render(
            <TfsNotificationBanner titleId="test" disableAutoFocus={false}>
                child content
            </TfsNotificationBanner>,
        );
        expect(component.container.querySelectorAll('p.govuk-notification-banner__heading').length).to.equal(1);
        expect(component.container.querySelector('p.govuk-notification-banner__heading')!.textContent).to.contain(
            'child content',
        );
    });

    it('TfsNotificationBannerHeading example', () => {
        component = render(
            <TfsNotificationBanner titleId="test">
                <TfsNotificationBannerHeading>child content</TfsNotificationBannerHeading>
                <p>paragraph</p>
            </TfsNotificationBanner>,
        );
        expect(component.container.querySelectorAll('h3.govuk-notification-banner__heading').length).to.equal(1);
        expect(component.container.querySelector('h3.govuk-notification-banner__heading')!.textContent).to.contain(
            'child content',
        );
    });

    it('TfsNotificationBannerHeading example', () => {
        component = render(
            <TfsNotificationBanner titleId="test">
                <TfsNotificationBannerMainText>child content</TfsNotificationBannerMainText>
            </TfsNotificationBanner>,
        );
        expect(component.container.querySelectorAll('p.govuk-notification-banner__heading').length).to.equal(1);
        expect(component.container.querySelector('p.govuk-notification-banner__heading')!.textContent).to.contain(
            'child content',
        );
    });
});
