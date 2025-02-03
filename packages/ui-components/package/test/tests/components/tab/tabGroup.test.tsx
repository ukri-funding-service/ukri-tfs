import React from 'react';
import { expect } from 'chai';
import { GdsTabGroup, GdsTab } from '../../../../src';
import { render } from '@testing-library/react';

describe('<GdsTabGroup /> component tests', () => {
    it('should set id', () => {
        const component = render(
            <GdsTabGroup id="my-tabs" heading="Tab Heading">
                <GdsTab id="tab1" label="Tab 1" selected>
                    Some content
                </GdsTab>
                <GdsTab id="tab2" label="Tab 2">
                    Some other content
                </GdsTab>
            </GdsTabGroup>,
        );
        expect(component.container.querySelector('div.govuk-tabs')).property('id').to.equal('my-tabs');
    });

    it('should render tab buttons', () => {
        const component = render(
            <GdsTabGroup id="my-tabs" heading="Tab Heading">
                <GdsTab id="tab1" label="Tab 1" selected>
                    Some content
                </GdsTab>
                <GdsTab id="tab2" label="Tab 2">
                    Some other content
                </GdsTab>
            </GdsTabGroup>,
        );
        expect(component.container.querySelector('a#tab1-tab-button')?.textContent).to.equal('Tab 1');
        expect(component.container.querySelector('a#tab2-tab-button')?.textContent).to.equal('Tab 2');
    });

    it('should render tab content', () => {
        const component = render(
            <GdsTabGroup id="my-tabs" heading="Tab Heading">
                <GdsTab id="tab1" label="Tab 1" selected>
                    Some content
                </GdsTab>
                <GdsTab id="tab2" label="Tab 2">
                    Some other content
                </GdsTab>
            </GdsTabGroup>,
        );
        expect(component.container.querySelector('div#tab1')?.textContent).to.equal('Some content');
        expect(component.container.querySelector('div#tab2')?.textContent).to.equal('Some other content');
    });

    it('should select the correct tab', () => {
        const component = render(
            <GdsTabGroup id="my-tabs" heading="Tab Heading">
                <GdsTab id="tab1" label="Tab 1">
                    Some content
                </GdsTab>
                <GdsTab id="tab2" label="Tab 2" selected>
                    Some other content
                </GdsTab>
            </GdsTabGroup>,
        );
        expect(component.container.querySelector('.govuk-tabs__list-item--selected a')?.textContent).to.equal('Tab 2');
    });
});
