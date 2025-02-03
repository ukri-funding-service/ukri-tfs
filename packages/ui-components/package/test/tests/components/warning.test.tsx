import { expect } from 'chai';
import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import { Warning } from '../../../src';

describe('<SearchInput /> component tests', () => {
    let component: RenderResult;

    afterEach(() => {
        component.unmount();
    });

    it('should render label, hint, textbox and search button', () => {
        component = render(<Warning text="Test warning text." />);

        const warningText = component.container.querySelector('strong');

        expect(warningText).to.exist;
        expect(warningText?.textContent).to.eql('WarningTest warning text.');
    });
});
