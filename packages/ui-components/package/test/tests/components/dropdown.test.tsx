import React from 'react';
import { expect } from 'chai';
import { Dropdown } from '../../../src/components/dropdown';
import { render } from '@testing-library/react';

describe('<NavigationList /> component tests', () => {
    it('should set the correct items and header', () => {
        const { container } = render(
            <Dropdown id="dropdown" heading={'heading'} items={[{ url: 'Test url', name: 'Test name' }]} />,
        );

        const buttonComponent = container.querySelector('button');
        expect(buttonComponent).to.not.be.null;
        expect(buttonComponent!.textContent).to.equal('heading');

        const anchorComponent = container.querySelector('a');
        expect(anchorComponent).to.not.be.null;
        expect(anchorComponent!.textContent).to.equal('Test name');
        expect(anchorComponent!.getAttribute('href')).to.equal('Test url');
    });

    it('should set the correct number of items', () => {
        const { container } = render(
            <Dropdown id="dropdown" heading={'heading'} items={[{ url: 'Test url', name: 'Test name' }]} />,
        );
        expect(container.querySelectorAll('a').length).to.equal(1);
    });
});
