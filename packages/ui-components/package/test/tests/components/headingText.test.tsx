import React from 'react';
import 'mocha';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { HeadingText } from '../../../src';

type sizeType = 'xl' | 'l' | 'm' | 's' | 'xs';
type headerType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

describe('<GdsHeaderText /> component tests', () => {
    const sizes: Array<sizeType> = ['xl', 'l', 'm', 's', 'xs'];
    const tags: Array<headerType> = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    const tests = sizes
        .map(s =>
            tags.map(t => {
                return { size: s, tag: t, showCaption: s !== 's' };
            }),
        )
        .reduce((acc, val) => acc.concat(val), []);

    tests.forEach(function (data) {
        it(`Tag: ${data.tag}, size: ${data.size} - correct header component should be loaded`, () => {
            const component = render(<HeadingText text="Header Text" tag={data.tag} size={data.size} />);
            expect(component.container.querySelector(data.tag)).to.exist;
        });

        it(`Tag: ${data.tag}, size: ${data.size} - correct css style should be applied to header`, () => {
            const component = render(<HeadingText text="Header Text" tag={data.tag} size={data.size} />);
            expect(component.container.querySelector(`${data.tag}.govuk-heading-${data.size}`)).to.exist;
        });

        if (data.size !== 's' && data.size !== 'xs') {
            it(`Tag: ${data.tag}, size: ${data.size} - caption should be visible when set`, () => {
                const component = render(
                    <HeadingText text="Header Text" tag={data.tag} size={data.size} caption="Caption Text" />,
                );
                expect(component.container.querySelectorAll('span').length).to.exist;
            });

            it(`Tag: ${data.tag}, size: ${data.size} - correct caption text should be set`, () => {
                const component = render(
                    <HeadingText text="Header Text" tag={data.tag} size={data.size} caption="Caption Text" />,
                );
                expect(component.container.querySelector('span')?.textContent).to.equal('Caption Text');
            });

            it(`Tag: ${data.tag}, size: ${data.size} - correct caption class should be set`, () => {
                const component = render(
                    <HeadingText text="Header Text" tag={data.tag} size={data.size} caption="Caption Text" />,
                );
                expect(component.container.querySelector(`span.govuk-caption-${data.size}`)).to.exist;
            });
        } else {
            it(`Tag: ${data.tag}, size: ${data.size} - caption should not be visible`, () => {
                const component = render(
                    <HeadingText text="Header Text" tag={data.tag} size={data.size} caption="Caption Text" />,
                );
                expect(component.container.querySelector('span')).to.be.null;
            });
        }

        it(`Tag: ${data.tag}, size: ${data.size} - caption should be hidden when empty`, () => {
            const component = render(<HeadingText text="Header Text" tag={data.tag} size={data.size} />);
            expect(component.container.querySelector('span')).to.be.null;
        });

        it(`Tag: ${data.tag}, size: ${data.size} - status label should be visible`, () => {
            const statusLabel = <span id="status-label-testing">Waiting On</span>;
            const component = render(
                <HeadingText text="Header Text" tag={data.tag} size={data.size} statusLabel={statusLabel} />,
            );
            expect(component.container.querySelector('#status-label-testing')?.textContent).to.equal('Waiting On');
        });
    });
});
