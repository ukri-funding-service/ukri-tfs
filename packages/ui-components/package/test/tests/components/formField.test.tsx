import React from 'react';
import 'mocha';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { FormField } from '../../../src';
import { ValidationResult, ValidationResults } from '@ukri-tfs/validation';

describe('Form field tests', () => {
    it('should not render label if no title provided', () => {
        const formField = render(<FormField>test</FormField>);
        expect(formField.container.querySelectorAll('label').length).to.eq(0);
    });

    it('should render label with correct title', () => {
        const formField = render(<FormField title="Test title">test</FormField>);
        expect(formField.container.querySelector('label')?.textContent).to.eq('Test title');
    });

    it('should not render label hint if not provided', () => {
        const formField = render(<FormField title="Test title">test</FormField>);
        expect(formField.container.querySelectorAll('.govuk-hint').length).to.eq(0);
    });

    it('should render label hint if provided', () => {
        const formField = render(
            <FormField title="Test title" labelHint="Label hint">
                test
            </FormField>,
        );
        expect(formField.container.querySelector('.govuk-hint')?.textContent).to.eq('Label hint');
    });

    it('should not have error class if validation is successful', () => {
        const validator = new ValidationResult(new ValidationResults({}, false), true, true, '', '', false);
        const formField = render(
            <FormField title="Test title" validation={validator}>
                test
            </FormField>,
        );
        expect(formField.container.querySelector('.govuk-form-group')?.classList.contains('govuk-form-group--error')).to
            .be.false;
    });

    it('should not render error message if validation is successful', () => {
        const validator = new ValidationResult(new ValidationResults({}, false), true, true, '', '', false);
        const formField = render(
            <FormField title="Test title" validation={validator}>
                test
            </FormField>,
        );
        expect(formField.container.querySelectorAll('.govuk-error-message').length).to.eql(0);
    });

    it('should not have error class if validation is set to not show', () => {
        const validator = new ValidationResult(new ValidationResults({}, false), false, false, '', '', false);
        const formField = render(
            <FormField title="Test title" validation={validator}>
                test
            </FormField>,
        );
        expect(formField.container.querySelector('.govuk-form-group')?.classList.contains('govuk-form-group--error')).to
            .be.false;
    });

    it('should not render error message if validation is set to not show', () => {
        const validator = new ValidationResult(new ValidationResults({}, false), false, false, '', '', false);
        const formField = render(
            <FormField title="Test title" validation={validator}>
                test
            </FormField>,
        );
        expect(formField.container.querySelectorAll('.govuk-error-message').length).to.eql(0);
    });

    it('should render validation class if validation failure is provided and validation errors are shown', () => {
        const validator = new ValidationResult(new ValidationResults({}, true), true, false, 'Error', 'Error', false);
        const formField = render(
            <FormField title="Test title" validation={validator}>
                test
            </FormField>,
        );
        expect(formField.container.querySelector('.govuk-form-group')?.classList.contains('govuk-form-group--error')).to
            .be.true;
    });

    it('should render validation message if validation failure is provided and validation errors are shown', () => {
        const validator = new ValidationResult(new ValidationResults({}, true), true, false, 'Error', 'Error', false);
        const formField = render(
            <FormField title="Test title" validation={validator}>
                test
            </FormField>,
        );
        expect(formField.container.querySelectorAll('.govuk-error-message').length).to.eql(1);
    });

    it('should render children correctly', () => {
        const formField = render(
            <FormField title="Test title">
                <div className="testClass" />
            </FormField>,
        );
        expect(formField.container.querySelectorAll('.testClass').length).to.eql(1);
    });
});
