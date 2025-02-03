import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { getErrorPageContent } from '../../../src';

describe('packages/ui-components - tfs/getErrorPageContent', () => {
    it('renders 404 page correctly', () => {
        const { pageTitle, content } = getErrorPageContent({ statusCode: 404 });

        expect(pageTitle).to.eql('404 - Page not found - UKRI Funding Service');
        const component = render(<>{content}</>);
        const errorText = component.getAllByText('If you entered a web address please check it was correct.');
        expect(errorText.length).to.eql(1);
    });

    it('renders 500 page correctly', () => {
        const { pageTitle, content } = getErrorPageContent({ statusCode: 500 });

        expect(pageTitle).to.eql('500 - Internal Server Error - UKRI Funding Service');
        const component = render(<>{content}</>);
        const errorText = component.getAllByText(
            'Currently there is server interruption. Please wait for a few minutes, then try refreshing the page.',
        );
        expect(errorText.length).to.eql(1);
    });

    it('renders correlationId correctly', () => {
        const { content } = getErrorPageContent({ correlationId: 'some-id' });
        const component = render(<>{content}</>);
        const errorText = component.getAllByText('Correlation: some-id');
        expect(errorText.length).to.eql(1);
    });
});
