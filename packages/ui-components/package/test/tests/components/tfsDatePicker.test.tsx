import moment from 'moment';
import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { TfsDatePicker } from '../../../src/components/tfsDatePicker';
import { ValidationResult, ValidationResults } from '@ukri-tfs/validation';

const dateInputFormat = (date: Date) => moment(date).format('DD/MM/YYYY');
const monthDisplayFormat = (date: Date) => moment(date).format('MMMM YYYY');
const getContainer = () => document.getElementById('dateField')!;

describe('<TfsDatePicker /> component tests', () => {
    it('should show the name', () => {
        const { container } = render(
            <TfsDatePicker
                name="dateField"
                label="Test"
                formatDateInput={dateInputFormat}
                formatMonthDropdown={monthDisplayFormat}
                container={getContainer}
            />,
        );
        expect(container.getElementsByTagName('input')[0].name).to.equal('dateField');
    });

    it('should show the label when label text is defined', () => {
        const { container } = render(
            <TfsDatePicker
                name="dateField"
                label="Test"
                formatDateInput={dateInputFormat}
                formatMonthDropdown={monthDisplayFormat}
                container={getContainer}
            />,
        );
        expect(container.getElementsByTagName('label')[0].textContent).to.equal('Test');
    });

    it('should show the hint when hint text is defined', () => {
        const { container } = render(
            <TfsDatePicker
                name="dateField"
                label="Test"
                hint="Hint text"
                formatDateInput={dateInputFormat}
                formatMonthDropdown={monthDisplayFormat}
                container={getContainer}
            />,
        );
        expect(container.getElementsByClassName('govuk-hint')[0].textContent).to.equal('Hint text');
    });

    it('should not show the hint when hint text is empty', () => {
        const { container } = render(
            <TfsDatePicker
                name="dateField"
                label="Test"
                formatDateInput={dateInputFormat}
                formatMonthDropdown={monthDisplayFormat}
                container={getContainer}
            />,
        );
        expect(container.getElementsByClassName('govuk-hint')[0].textContent).to.be.empty;
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
            'dateField',
        );
        const { container } = render(
            <TfsDatePicker
                name="dateField"
                label="Test"
                validation={validation}
                formatDateInput={dateInputFormat}
                formatMonthDropdown={monthDisplayFormat}
                container={getContainer}
            />,
        );
        expect(container.getElementsByClassName('govuk-error-message')[0].textContent).to.eql('Error: Error message');
    });

    it('should set the input type to "text"', () => {
        const { container } = render(
            <TfsDatePicker
                name="dateField"
                label="Test"
                formatDateInput={dateInputFormat}
                formatMonthDropdown={monthDisplayFormat}
                container={getContainer}
            />,
        );
        expect(container.getElementsByTagName('input')[0].type).to.eql('text');
    });

    it('should set the width class to "govuk-input--width-7"', () => {
        const { container } = render(
            <TfsDatePicker
                name="dateField"
                label="Test"
                formatDateInput={dateInputFormat}
                formatMonthDropdown={monthDisplayFormat}
                container={getContainer}
            />,
        );
        expect(container.getElementsByClassName('govuk-input--width-7')[0]).to.exist;
    });

    it('should set the field value correctly when a valid value is supplied', () => {
        const { container } = render(
            <TfsDatePicker
                name="dateField"
                label="Test"
                value="14/01/2020"
                formatDateInput={dateInputFormat}
                formatMonthDropdown={monthDisplayFormat}
                container={getContainer}
            />,
        );
        expect(container.getElementsByTagName('input')[0].value).to.equal('14/01/2020');
    });

    it('should set the field value correctly when an invalid value is supplied', () => {
        const { container } = render(
            <TfsDatePicker
                name="dateField"
                label="Test"
                value="2020-01-14"
                formatDateInput={dateInputFormat}
                formatMonthDropdown={monthDisplayFormat}
                container={getContainer}
            />,
        );
        expect(container.getElementsByTagName('input')[0].value).to.equal('2020-01-14');
    });

    it('should set the field value correctly when a non-date value is supplied', () => {
        const { container } = render(
            <TfsDatePicker
                name="dateField"
                label="Test"
                value="qwertyuiop"
                formatDateInput={dateInputFormat}
                formatMonthDropdown={monthDisplayFormat}
                container={getContainer}
            />,
        );
        expect(container.getElementsByTagName('input')[0].value).to.equal('qwertyuiop');
    });
});
