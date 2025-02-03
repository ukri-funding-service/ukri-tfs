import React from 'react';
import { expect } from 'chai';
import { Footer, FooterSectionProps } from '../../../src/components/footer';
import { render } from '@testing-library/react';

describe('<Footer /> component tests', () => {
    it('should render the component', () => {
        const component = render(<Footer />);
        expect(component.container.querySelector('.govuk-footer')).to.exist;
    });

    it('should have three inline columns', () => {
        const component = render(<Footer />);
        expect(component.container.querySelectorAll('.is-one-third').length).to.equal(3);
    });

    it('should have a heading for each column', () => {
        const component = render(<Footer />);
        expect(component.container.querySelectorAll('h2').length).to.equal(3);
    });

    it('should contain copyright information', () => {
        const component = render(<Footer />);
        expect(component.container.querySelector('p.govuk-body-xs')?.textContent).to.equal('Copyright UKRI 2020 ©');
    });

    it('should have one heading when custom config is passed in with one section', () => {
        // given
        const props: FooterSectionProps[] = [
            {
                heading: 'foo',
                widthClass: 'is-full',
                footerLinks: [
                    {
                        id: 'foo',
                        isActive: true,
                        text: 'foo',
                        url: '/foo',
                        opensInNewTab: true,
                    },
                ],
            },
        ];

        // when
        const component = render(<Footer footerSections={props} />);

        // then
        expect(component.container.querySelectorAll('.govuk-footer').length).to.equal(1);
    });

    it('should have two headings when custom config is passed in with two sections', () => {
        // given
        const props: FooterSectionProps[] = [
            {
                heading: 'foo',
                widthClass: 'is-full',
                footerLinks: [
                    {
                        id: 'foo',
                        isActive: true,
                        text: 'foo',
                        url: '/foo',
                        opensInNewTab: true,
                    },
                ],
            },
            {
                heading: 'bar',
                widthClass: 'is-full',
                footerLinks: [
                    {
                        id: 'bar',
                        isActive: true,
                        text: 'bar',
                        url: '/bar',
                        opensInNewTab: true,
                    },
                ],
            },
        ];

        // when
        const component = render(<Footer footerSections={props} />);

        // then
        expect(component.container.querySelectorAll('.govuk-footer__list').length).to.equal(2);
    });

    it('should have 4 links when 2 headings are passed in each with 2 links', () => {
        // given
        const props: FooterSectionProps[] = [
            {
                heading: 'foo',
                widthClass: 'is-full',
                footerLinks: [
                    {
                        id: 'foo1',
                        isActive: true,
                        text: 'foo1',
                        url: '/foo1',
                        opensInNewTab: true,
                    },
                    {
                        id: 'bar1',
                        isActive: true,
                        text: 'bar1',
                        url: '/bar1',
                        opensInNewTab: true,
                    },
                ],
            },
            {
                heading: 'bar',
                widthClass: 'is-full',
                footerLinks: [
                    {
                        id: 'foo2',
                        isActive: true,
                        text: 'foo2',
                        url: '/foo2',
                        opensInNewTab: true,
                    },
                    {
                        id: 'bar2',
                        isActive: true,
                        text: 'bar2',
                        url: '/bar2',
                        opensInNewTab: true,
                    },
                ],
            },
        ];

        // when
        const component = render(<Footer footerSections={props} />);

        // then
        expect(component.container.querySelectorAll('a').length).to.equal(4);
    });

    it('should render a link that opens in a new tab when opensInNewTab is true', () => {
        // given
        const props: FooterSectionProps[] = [
            {
                heading: 'foo',
                widthClass: 'is-full',
                footerLinks: [
                    {
                        id: 'foo',
                        isActive: true,
                        text: 'foo',
                        url: '/foo',
                        opensInNewTab: true,
                    },
                ],
            },
        ];

        // when
        const component = render(<Footer footerSections={props} />);

        // then
        expect(component.container.querySelector('a')?.outerHTML).includes('target="_blank"');
    });

    it('should render a link that opens in the same tab when opensInNewTab is false', () => {
        // given
        const props: FooterSectionProps[] = [
            {
                heading: 'foo',
                widthClass: 'is-full',
                footerLinks: [
                    {
                        id: 'foo',
                        isActive: true,
                        text: 'foo',
                        url: '/foo',
                        opensInNewTab: false,
                    },
                ],
            },
        ];

        // when
        const component = render(<Footer footerSections={props} />);

        // then
        expect(component.container.querySelector('a')?.outerHTML).does.not.include('target="_blank"');
    });

    it('should render a link that opens in a new tab with noreferrer and nooperner rel properties to prevent window.opener API exploitation attacks', () => {
        // given
        const props: FooterSectionProps[] = [
            {
                heading: 'foo',
                widthClass: 'is-full',
                footerLinks: [
                    {
                        id: 'foo',
                        isActive: true,
                        text: 'foo',
                        url: '/foo',
                        opensInNewTab: true,
                    },
                ],
            },
        ];

        // when
        const component = render(<Footer footerSections={props} />);

        // then
        expect(component.container.querySelector('a')?.outerHTML).includes('rel="noopener noreferrer"');
    });
});
