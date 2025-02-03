import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { withFormField, withLabel, withGuidance, withValidation, withFormGroup } from '../../../src/wrappers';
import { WithValidationProps } from '../../../src/propDefinition';
import { ValidationResult } from '@ukri-tfs/validation';

describe('withLabel wrapper tests', () => {
    it('should contain a htmlFor prop in the label element when the name prop is set', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withLabel(testComponent);
        const wrappedComponent = render(<WrappedField name="fieldName" label="label text" />);

        const labelComponent = wrappedComponent.container.querySelector('label');
        expect(labelComponent).to.not.be.null;

        expect(labelComponent!.getAttribute('for')).to.equal('fieldName');
    });

    it('should contain label text in the label element when the label prop is set', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withLabel(testComponent);
        const wrappedComponent = render(<WrappedField name="fieldName" label="label text" />);

        const labelComponent = wrappedComponent.container.querySelector('label');
        expect(labelComponent).to.not.be.null;

        expect(labelComponent!.textContent).to.equal('label text');
    });

    it('should contain hint text when the hint prop is set', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withLabel(testComponent);
        const wrappedComponent = render(<WrappedField name="fieldName" label="label text" hint="hint text" />);

        const hintComponent = wrappedComponent.container.querySelector('div.govuk-hint');
        expect(hintComponent).to.not.be.null;

        expect(hintComponent!.textContent).to.equal('hint text');
    });
});

describe('withValidation wrapper tests', () => {
    it('should not contain an error message span when no props are set', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withValidation(testComponent);
        const wrappedComponent = render(<WrappedField name="fieldName" />);
        expect(wrappedComponent.container.querySelectorAll('span.govuk-error-message')).to.have.lengthOf(0);
    });

    it('should not contain an error message span when the isError prop is not set', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withValidation(testComponent);
        const wrappedComponent = render(<WrappedField name="fieldName" errorMessage="You must enter a value" />);
        expect(wrappedComponent.container.querySelectorAll('span.govuk-error-message')).to.have.lengthOf(0);
    });

    it('should contain an error message span when the isError prop is set', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withValidation(testComponent);
        const wrappedComponent = render(<WrappedField name="fieldName" isError />);
        expect(wrappedComponent.container.querySelectorAll('span.govuk-error-message')).to.have.lengthOf(1);
    });

    it('should not set the isError prop on the wrapped element when the isError prop is not set', () => {
        const testComponent: React.FunctionComponent<WithValidationProps> = (props: WithValidationProps) => {
            return <input type="text" data-error={props.isError} />;
        };
        const WrappedField = withValidation(testComponent);
        const wrappedComponent = render(<WrappedField name="fieldName" />);

        const inputComponent = wrappedComponent.container.querySelector('input');
        expect(inputComponent).to.not.be.null;

        expect(inputComponent!.getAttribute('data-error')).to.equal('false');
    });

    it('should set the isError prop on the wrapped element when the isError prop is set', () => {
        const testComponent: React.FunctionComponent<WithValidationProps> = (props: WithValidationProps) => {
            return <input type="text" data-error={props.isError} />;
        };
        const WrappedField = withValidation(testComponent);
        const wrappedComponent = render(<WrappedField name="fieldName" isError />);

        const inputComponent = wrappedComponent.container.querySelector('input');
        expect(inputComponent).to.not.be.null;

        expect(inputComponent!.getAttribute('data-error')).to.equal('true');
    });

    it('should contain error message text when the isError and errorMessage props are set', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withValidation(testComponent);
        const wrappedComponent = render(
            <WrappedField name="fieldName" isError errorMessage="You must enter a value" />,
        );

        const errorMessageComponent = wrappedComponent.container.querySelector('span.govuk-error-message');
        expect(errorMessageComponent).to.not.be.null;

        expect(errorMessageComponent!.textContent).to.equal('Error:You must enter a value');
    });

    it('should not contain an error message when the validation prop is set and isValid is true', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withValidation(testComponent);
        const validationResult = new ValidationResult(
            null,
            true,
            true,
            'You must enter a value',
            '',
            true,
            'fieldName',
        );
        const wrappedComponent = render(<WrappedField name="fieldName" validation={validationResult} />);
        expect(wrappedComponent.container.querySelectorAll('span.govuk-error-message')).to.have.lengthOf(0);
    });

    it('should not set the isError prop on the wrapped element when the validation prop is set and isValid is true', () => {
        const testComponent: React.FunctionComponent<WithValidationProps> = (props: WithValidationProps) => {
            return <input type="text" data-error={props.isError} />;
        };
        const WrappedField = withValidation(testComponent);
        const validationResult = new ValidationResult(
            null,
            true,
            true,
            'You must enter a value',
            '',
            true,
            'fieldName',
        );
        const wrappedComponent = render(<WrappedField name="fieldName" validation={validationResult} />);

        const inputComponent = wrappedComponent.container.querySelector('input');
        expect(inputComponent).to.not.be.null;

        expect(inputComponent!.getAttribute('data-error')).to.equal('false');
    });

    it('should contain error message text when the validation prop is set and isValid is false', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withValidation(testComponent);
        const validationResult = new ValidationResult(
            null,
            true,
            false,
            'You must enter a value',
            '',
            true,
            'fieldName',
        );
        const wrappedComponent = render(<WrappedField name="fieldName" validation={validationResult} />);

        const errorMessageComponent = wrappedComponent.container.querySelector('span.govuk-error-message');
        expect(errorMessageComponent).to.not.be.null;

        expect(errorMessageComponent!.textContent).to.equal('Error:You must enter a value');
    });

    it('should set the isError prop on the wrapped element when the validation prop is set and isValid is false', () => {
        const testComponent: React.FunctionComponent<WithValidationProps> = (props: WithValidationProps) => {
            return <input type="text" data-error={props.isError} />;
        };
        const WrappedField = withValidation(testComponent);
        const validationResult = new ValidationResult(
            null,
            true,
            false,
            'You must enter a value',
            '',
            true,
            'fieldName',
        );
        const wrappedComponent = render(<WrappedField name="fieldName" validation={validationResult} />);

        const inputComponent = wrappedComponent.container.querySelector('input');
        expect(inputComponent).to.not.be.null;

        expect(inputComponent!.getAttribute('data-error')).to.equal('true');
    });
});

describe('withGuidance wrapper tests', () => {
    it('should contain the wrapped component', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withGuidance(testComponent);
        const wrappedComponent = render(
            <WrappedField name="fieldName" guidance={{ summary: 'Guidance summary', details: 'Guidance details' }} />,
        );
        expect(wrappedComponent.container.querySelectorAll('input')).has.lengthOf(1);
    });

    it('should have the guidance details element has the u-space-b5 class', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withGuidance(testComponent);
        const wrappedComponent = render(
            <WrappedField name="fieldName" guidance={{ summary: 'Guidance summary', details: 'Guidance details' }} />,
        );

        const detailsComponent = wrappedComponent.container.querySelector('details');
        expect(detailsComponent).to.not.be.null;

        expect(detailsComponent!.className).to.contain('u-space-b5');
    });

    it('should have the correct summary on guidance details element', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withGuidance(testComponent);
        const wrappedComponent = render(
            <WrappedField name="fieldName" guidance={{ summary: 'Guidance summary', details: 'Guidance details' }} />,
        );

        const summaryTextComponent = wrappedComponent.container.querySelector('.govuk-details__summary-text');
        expect(summaryTextComponent).to.not.be.null;

        expect(summaryTextComponent!.textContent).to.equal('Guidance summary');
    });

    it('should have the correct details text on guidance details element', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withGuidance(testComponent);
        const wrappedComponent = render(
            <WrappedField name="fieldName" guidance={{ summary: 'Guidance summary', details: 'Guidance details' }} />,
        );

        const textComponent = wrappedComponent.container.querySelector('.govuk-details__text');
        expect(textComponent).to.not.be.null;

        expect(textComponent!.textContent).to.equal('Guidance details');
    });
});

describe('withFormGroup wrapper tests', () => {
    it('should contain a govuk-form-group container', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withFormGroup(testComponent);
        const wrappedComponent = render(<WrappedField name="fieldName" />);
        expect(wrappedComponent.container.querySelectorAll('.govuk-form-group')).to.have.lengthOf(1);
    });

    it('should set the govuk-form-group container ID based on the field name', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withFormGroup(testComponent);
        const wrappedComponent = render(<WrappedField name="fieldName" />);

        const formGroupComponent = wrappedComponent.container.querySelector('.govuk-form-group');
        expect(formGroupComponent).to.not.be.null;

        expect(formGroupComponent!.getAttribute('id')).to.equal('fieldName-wrapper');
    });

    it('should not set the error class on the form group element when the isError prop is not set', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withFormGroup(testComponent);
        const wrappedComponent = render(<WrappedField name="fieldName" />);
        expect(wrappedComponent.container.querySelectorAll('.govuk-form-group--error')).to.have.lengthOf(0);
    });

    it('should not set the isError prop on the wrapped element when the isError prop is not set', () => {
        const testComponent: React.FunctionComponent<WithValidationProps> = (props: WithValidationProps) => {
            return <input type="text" data-error={props.isError} />;
        };
        const WrappedField = withFormGroup(testComponent);
        const wrappedComponent = render(<WrappedField name="fieldName" />);

        const inputComponent = wrappedComponent.container.querySelector('input');
        expect(inputComponent).to.not.be.null;

        expect(inputComponent!.getAttribute('data-error')).to.equal('false');
    });

    it('should set the error class on the form group element when the isError prop is set', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withFormGroup(testComponent);
        const wrappedComponent = render(<WrappedField name="fieldName" isError />);
        expect(wrappedComponent.container.querySelectorAll('.govuk-form-group--error')).to.have.lengthOf(1);
    });

    it('should set the isError prop on the wrapped element when the isError prop is set', () => {
        const testComponent: React.FunctionComponent<WithValidationProps> = (props: WithValidationProps) => {
            return <input type="text" data-error={props.isError} />;
        };
        const WrappedField = withFormGroup(testComponent);
        const wrappedComponent = render(<WrappedField name="fieldName" isError />);

        const inputComponent = wrappedComponent.container.querySelector('input');
        expect(inputComponent).to.not.be.null;

        expect(inputComponent!.getAttribute('data-error')).to.equal('true');
    });

    it('should not set the error class on the form group element when the validation prop is set and isValid is true', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withFormGroup(testComponent);
        const validationResult = new ValidationResult(
            null,
            true,
            true,
            'You must enter a value',
            '',
            true,
            'fieldName',
        );
        const wrappedComponent = render(<WrappedField name="fieldName" validation={validationResult} />);
        expect(wrappedComponent.container.querySelectorAll('.govuk-form-group--error')).to.have.lengthOf(0);
    });

    it('should not set the isError prop on the wrapped element when the validation prop is set and isValid is true', () => {
        const testComponent: React.FunctionComponent<WithValidationProps> = (props: WithValidationProps) => {
            return <input type="text" data-error={props.isError} />;
        };
        const WrappedField = withFormGroup(testComponent);
        const validationResult = new ValidationResult(
            null,
            true,
            true,
            'You must enter a value',
            '',
            true,
            'fieldName',
        );
        const wrappedComponent = render(<WrappedField name="fieldName" validation={validationResult} />);

        const inputComponent = wrappedComponent.container.querySelector('input');
        expect(inputComponent).to.not.be.null;

        expect(inputComponent!.getAttribute('data-error')).to.equal('false');
    });

    it('should set the error class on the form group element when the validation prop is set and isValid is false', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withFormGroup(testComponent);
        const validationResult = new ValidationResult(
            null,
            true,
            false,
            'You must enter a value',
            '',
            true,
            'fieldName',
        );
        const wrappedComponent = render(<WrappedField name="fieldName" validation={validationResult} />);
        expect(wrappedComponent.container.querySelectorAll('.govuk-form-group--error')).to.have.lengthOf(1);
    });

    it('should set the isError prop on the wrapped element when the validation prop is set and isValid is false', () => {
        const testComponent: React.FunctionComponent<WithValidationProps> = (props: WithValidationProps) => {
            return <input type="text" data-error={props.isError} />;
        };
        const WrappedField = withFormGroup(testComponent);
        const validationResult = new ValidationResult(
            null,
            true,
            false,
            'You must enter a value',
            '',
            true,
            'fieldName',
        );
        const wrappedComponent = render(<WrappedField name="fieldName" validation={validationResult} />);

        const inputComponent = wrappedComponent.container.querySelector('input');
        expect(inputComponent).to.not.be.null;

        expect(inputComponent!.getAttribute('data-error')).to.equal('true');
    });
});

describe('standardGdsComponent wrapper tests', () => {
    it('should set the govuk-form-group container ID based on the field name', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withFormField(testComponent);
        const wrappedComponent = render(<WrappedField name="fieldName" label="label text" />);

        const formGroupComponent = wrappedComponent.container.querySelector('.govuk-form-group');
        expect(formGroupComponent).to.not.be.null;

        expect(formGroupComponent!.getAttribute('id')).to.equal('fieldName-wrapper');
    });

    it('should contain label text in the label element when the label prop is set', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withFormField(testComponent);
        const wrappedComponent = render(<WrappedField name="fieldName" label="label text" />);

        const labelComponent = wrappedComponent.container.querySelector('label');
        expect(labelComponent).to.not.be.null;

        expect(labelComponent!.textContent).to.equal('label text');
    });

    it('should contain an error message span when the isError prop is set', () => {
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withFormField(testComponent);
        const wrappedComponent = render(<WrappedField name="fieldName" label="label text" isError />);
        expect(wrappedComponent.container.querySelectorAll('span.govuk-error-message')).to.have.lengthOf(1);
    });

    it('should set the isError prop on the wrapped element when the isError prop is set', () => {
        const testComponent: React.FunctionComponent<WithValidationProps> = (props: WithValidationProps) => {
            return <input type="text" data-error={props.isError} />;
        };
        const WrappedField = withFormField(testComponent);
        const wrappedComponent = render(<WrappedField name="fieldName" label="label text" isError />);

        const inputComponent = wrappedComponent.container.querySelector('input');
        expect(inputComponent).to.not.be.null;

        expect(inputComponent!.getAttribute('data-error')).to.equal('true');
    });

    it('should set the isError prop on the wrapped element when the validation prop is set and isValid is false', () => {
        const testComponent: React.FunctionComponent<WithValidationProps> = (props: WithValidationProps) => {
            return <input type="text" data-error={props.isError} />;
        };
        const WrappedField = withFormField(testComponent);
        const validationResult = new ValidationResult(
            null,
            true,
            false,
            'You must enter a value',
            '',
            true,
            'fieldName',
        );
        const wrappedComponent = render(
            <WrappedField name="fieldName" label="label text" validation={validationResult} />,
        );

        const inputComponent = wrappedComponent.container.querySelector('input');
        expect(inputComponent).to.not.be.null;

        expect(inputComponent!.getAttribute('data-error')).to.equal('true');
    });
});
