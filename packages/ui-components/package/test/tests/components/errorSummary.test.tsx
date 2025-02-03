import { expect } from 'chai';
import React from 'react';
import { GdsErrorSummary } from '../../../src/components/errorSummary';
import { render } from '@testing-library/react';

describe('<GdsErrorSummary /> component tests', () => {
    it('correct text should be set', () => {
        const { container } = render(
            <GdsErrorSummary errors={[{ fieldName: 'username', message: 'Your username is incorrect' }]} />,
        );

        const listElementComponent = container.querySelector('li');
        expect(listElementComponent).to.not.be.null;

        expect(listElementComponent!.textContent).to.equal('Your username is incorrect');
    });

    it('correct link should be set', () => {
        const { container } = render(
            <GdsErrorSummary errors={[{ fieldName: 'username', message: 'Your username is incorrect' }]} />,
        );

        const anchorComponent = container.querySelector('a');
        expect(anchorComponent).to.not.be.null;

        expect(anchorComponent!.getAttribute('href')).to.equal('#username');
    });

    it('multiple error messages should be displayed correctly', () => {
        const { container } = render(
            <GdsErrorSummary
                errors={[
                    { fieldName: 'username', message: 'Your username is incorrect' },
                    { fieldName: 'password', message: 'Your password must be at least 8 characters long' },
                ]}
            />,
        );
        expect(container.querySelectorAll('li').length).to.equal(2);
    });

    it('link should not be present if fieldname is not set', () => {
        const { container } = render(
            <GdsErrorSummary errors={[{ fieldName: '', message: 'Unable to perform action' }]} />,
        );
        expect(container.querySelectorAll('a')).to.be.empty;

        const spanComponent = container.querySelector('span');
        expect(spanComponent).to.not.be.null;

        expect(spanComponent!.textContent).to.equal('Unable to perform action');
    });

    it('nothing should be rendered if no errors are found', () => {
        const { container } = render(<GdsErrorSummary errors={[]} />);
        expect(container.querySelectorAll('div').length).to.equal(0);
    });
});
