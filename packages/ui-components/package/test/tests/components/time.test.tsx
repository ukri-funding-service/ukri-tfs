import React from 'react';
import { expect } from 'chai';
import { TfsTime, MeridianValue } from '../../../src/components/time';
import { ValidationResult, ValidationResults } from '@ukri-tfs/validation';
import { render } from '@testing-library/react';

describe('<TfsTime /> component tests', () => {
    const mainLabel = 'label:not(.govuk-visually-hidden)';
    const meridianLabel = 'label.govuk-visually-hidden';

    it('should show the main label when label text is defined', () => {
        const component = render(<TfsTime name="timeField" label="Test" />);
        expect(component.container.querySelector('label')).to.exist;
    });

    it('should render the correct main label text when label text is defined', () => {
        const component = render(<TfsTime name="timeField" label="Test" />);

        const mainLabelComponent = component.container.querySelector(mainLabel);
        expect(mainLabelComponent).to.not.be.null;

        expect(mainLabelComponent!.textContent).to.equal('Test');
    });

    it('should show the hint when hint text is defined', () => {
        const component = render(<TfsTime name="timeField" label="Test" hint="Hint text" />);
        const hintComponent = component.container.querySelector('.govuk-hint');
        expect(hintComponent).to.not.be.null;
        expect(hintComponent!.textContent).to.equal('Hint text');
    });

    it('should not show the hint when hint text is empty', () => {
        const component = render(<TfsTime name="timeField" label="Test" />);
        const hintComponent = component.container.querySelector('.govuk-hint');
        expect(hintComponent).to.not.be.null;
        expect(hintComponent!.textContent).to.be.empty;
    });

    it('should show the error message when in an error state', () => {
        const results: ValidationResults<{}> = new ValidationResults({}, true);
        const validation: ValidationResult = new ValidationResult(
            results,
            true,
            false,
            'Error message',
            'Error summary',
            true,
            'timeField',
        );
        const component = render(<TfsTime name="timeField" label="Test" validation={validation} />);

        const errorMessageComponent = component.container.querySelector('.govuk-error-message');
        expect(errorMessageComponent).to.not.be.null;

        expect(errorMessageComponent!.textContent).to.equal('Error: Error message');
    });

    it('should render the AM/PM label in a hidden state', () => {
        const component = render(<TfsTime name="timeField" label="Test" />);
        expect(component.container.querySelector(meridianLabel)).to.exist;
    });

    it('should render the correct AM/PM label text', () => {
        const component = render(<TfsTime name="timeField" label="Test" />);

        const meridianLabelComponent = component.container.querySelector(meridianLabel);
        expect(meridianLabelComponent).to.not.be.null;

        expect(meridianLabelComponent!.textContent).to.equal('Before or after midday');
    });

    it('should set the main field value to "09:00" when a defaultTime of 09:00 am is supplied', () => {
        const component = render(
            <TfsTime name="timeField" label="Test" defaultTime={{ time: '09:00', ampm: MeridianValue.am }} />,
        );

        const selectedTimeComponent = component.container.querySelector('#timeField [selected]');
        expect(selectedTimeComponent).to.not.be.null;

        expect(selectedTimeComponent!.textContent).to.equal('09:00');
    });

    it('should set the drop-down field value to "am" when a defaultTime of 09:00 am is supplied', () => {
        const component = render(
            <TfsTime name="timeField" label="Test" defaultTime={{ time: '09:00', ampm: MeridianValue.am }} />,
        );

        const meridianSelectedComponent = component.container.querySelector('#timeFieldMeridian [selected]');
        expect(meridianSelectedComponent).to.not.be.null;

        expect(meridianSelectedComponent!.textContent).to.equal('am');
    });

    it('should set the main field value to "05:00" when a defaultTime of 05:00 pm is supplied', () => {
        const component = render(
            <TfsTime name="timeField" label="Test" defaultTime={{ time: '05:00', ampm: MeridianValue.pm }} />,
        );

        const selectedTimeComponent = component.container.querySelector('#timeField [selected]');
        expect(selectedTimeComponent).to.not.be.null;

        expect(selectedTimeComponent!.textContent).to.equal('05:00');
    });

    it('should set the drop-down field value to "pm" when a defaultTime of 05:00 pm is supplied', () => {
        const component = render(
            <TfsTime name="timeField" label="Test" defaultTime={{ time: '05:00', ampm: MeridianValue.pm }} />,
        );

        const meridianSelectedComponent = component.container.querySelector('#timeFieldMeridian [selected]');
        expect(meridianSelectedComponent).to.not.be.null;

        expect(meridianSelectedComponent!.textContent).to.equal('pm');
    });

    it('should set the main field value to "07:00" when a value of 07:00 am is supplied', () => {
        const component = render(
            <TfsTime name="timeField" label="Test" defaultTime={{ time: '07:00', ampm: MeridianValue.am }} />,
        );

        const selectedTimeComponent = component.container.querySelector('#timeField [selected]');
        expect(selectedTimeComponent).to.not.be.null;

        expect(selectedTimeComponent!.textContent).to.equal('07:00');
    });

    it('should set the drop-down field value to "am" when a value of 07:00 am is supplied', () => {
        const component = render(
            <TfsTime name="timeField" label="Test" defaultTime={{ time: '07:00', ampm: MeridianValue.am }} />,
        );

        const meridianSelectedComponent = component.container.querySelector('#timeFieldMeridian [selected]');
        expect(meridianSelectedComponent).to.not.be.null;

        expect(meridianSelectedComponent!.textContent).to.equal('am');
    });

    it('should set the main field value to "3:00" when a value of 3:00 pm is supplied', () => {
        const component = render(
            <TfsTime name="timeField" label="Test" defaultTime={{ time: '03:00', ampm: MeridianValue.pm }} />,
        );

        const selectedTimeComponent = component.container.querySelector('#timeField [selected]');
        expect(selectedTimeComponent).to.not.be.null;

        expect(selectedTimeComponent!.textContent).to.equal('03:00');
    });

    it('should set the drop-down field value to "pm" when a value of 3:00 pm is supplied', () => {
        const component = render(
            <TfsTime name="timeField" label="Test" defaultTime={{ time: '3:00', ampm: MeridianValue.pm }} />,
        );

        const meridianSelectedComponent = component.container.querySelector('#timeFieldMeridian [selected]');
        expect(meridianSelectedComponent).to.not.be.null;

        expect(meridianSelectedComponent!.textContent).to.equal('pm');
    });
});
