import React from 'react';
import { expect } from 'chai';
import { GdsErrorMessage } from '../../../src/components/errorMessage';
import { render } from '@testing-library/react';

describe('<GdsErrorMessage /> component tests', () => {
    it('should set the correct error message', () => {
        const { container } = render(
            <GdsErrorMessage message="You must enter a username" name="Username_Error" showError={true} />,
        );

        const errorMessageComponent = container.querySelector('.govuk-error-message');
        expect(errorMessageComponent).to.not.be.null;

        expect(errorMessageComponent!.textContent).to.equal('Error:You must enter a username');
    });

    it('should not be visible when showError is false', () => {
        const { container } = render(
            <GdsErrorMessage message="You must enter a username" name="Username_Error" showError={false} />,
        );
        expect(container.querySelectorAll('.govuk-error-message')).to.be.empty;
    });

    it('should set the correct id when the name is non-empty', () => {
        const { container } = render(
            <GdsErrorMessage message="You must enter a username" name="Username_Error" showError={true} />,
        );

        const errorMessageComponent = container.querySelector('.govuk-error-message');
        expect(errorMessageComponent).to.not.be.null;

        expect(errorMessageComponent!.getAttribute('id')).to.equal('error_Username_Error');
    });

    it('should not set an id when the name is empty', () => {
        const { container } = render(<GdsErrorMessage message="You must enter a username" name="" showError={true} />);

        const errorMessageComponent = container.querySelector('.govuk-error-message');
        expect(errorMessageComponent).to.not.be.null;

        expect(errorMessageComponent!.getAttribute('id')).to.be.null;
    });

    it('should add all error messages in messages', () => {
        const { container } = render(
            <GdsErrorMessage
                messages={['You must enter a username', 'You have exceeded the word count']}
                name="Username_Error"
                showError={true}
            />,
        );
        expect(container.querySelectorAll('.govuk-error-message span:not(.govuk-visually-hidden)').length).to.equal(2);
    });

    it('should have visually hidden Errors for all messages', () => {
        const { container } = render(
            <GdsErrorMessage
                messages={['You must enter a username', 'You have exceeded the word count']}
                name="Username_Error"
                showError={true}
            />,
        );
        expect(container.querySelectorAll('.govuk-error-message span.govuk-visually-hidden').length).to.equal(2);
    });

    it('should set the correct error message for all messages', () => {
        const { container } = render(
            <GdsErrorMessage
                messages={['You must enter a username', 'You have exceeded the word count']}
                name="Username_Error"
                showError={true}
            />,
        );
        expect(
            container.querySelectorAll('.govuk-error-message span:not(.govuk-visually-hidden)')[0].textContent,
        ).to.equal('You must enter a username');
        expect(
            container.querySelectorAll('.govuk-error-message span:not(.govuk-visually-hidden)')[1].textContent,
        ).to.equal('You have exceeded the word count');
    });
});
