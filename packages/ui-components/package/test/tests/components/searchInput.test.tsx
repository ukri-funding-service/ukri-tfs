import { expect } from 'chai';
import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import { SearchInput } from '../../../src';

describe('<SearchInput /> component tests', () => {
    let component: RenderResult;
    afterEach(() => {
        component.unmount();
    });

    it('should render label, hint, textbox and search button', () => {
        component = render(
            <SearchInput label="My label" hint="My hint" buttonName="mySearchButton" defaultValue="defaultValue" />,
        );

        const label = component.container.querySelector('label');
        const hint = component.container.querySelector('span.govuk-hint');
        const textbox = component.container.querySelector('#searchQuery');
        const defaultValue = textbox?.getAttribute('value');
        const button = component.container.querySelector('button[name="mySearchButton"]');

        expect(label).to.exist;
        expect(label!.textContent).to.eql('My label');
        expect(hint).to.exist;
        expect(hint!.textContent).to.eq('My hint');
        expect(textbox).to.exist;
        expect(button).to.exist;
        expect(button!.textContent).to.eq('Search');
        expect(defaultValue).to.eq('defaultValue');
    });
});
