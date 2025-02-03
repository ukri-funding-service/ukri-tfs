import React from 'react';
import { expect } from 'chai';
import { NavigationList } from '../../../src/components/navigationList';
import { render } from '@testing-library/react';

describe('<NavigationList /> component tests', () => {
    it('should set the correct url and header', () => {
        const { container } = render(
            <NavigationList heading={'heading'} items={[{ url: 'Test url', name: 'Test name' }]} />,
        );

        const linkComponent = container.querySelector('.govuk-heading--link');
        expect(linkComponent).to.not.be.null;

        expect(linkComponent!.textContent).to.equal('heading');
        expect(container.querySelectorAll('.govuk-link')[0].textContent).to.equal('Test name');
        expect(container.querySelectorAll('.govuk-link')[0].getAttribute('href')).to.equal('Test url');
    });

    it('should set the correct number of items', () => {
        const { container } = render(
            <NavigationList heading={'heading'} items={[{ url: 'Test url', name: 'Test name' }]} />,
        );
        expect(container.querySelectorAll('.govuk-link').length).to.equal(1);
    });
});
