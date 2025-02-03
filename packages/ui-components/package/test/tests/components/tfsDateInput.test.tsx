/**
 * @jest-environment jsdom
 */
import React from 'react';
import { describe, it } from 'mocha';
import { render, screen } from '@testing-library/react';
import { TfsDateInput } from '../../../src/components/tfsDateInput';
import { expect } from 'chai';

const defaultValueDay = '29';
const defaultValueMonth = '04';
const defaultValueYear = '2020';
const heading = 'test Component';
const hint = 'This is a hint';
const componentId = 'testDateInput';

describe('packages/ui-components - components/tfsDateInput', () => {
    describe('should render', () => {
        it('with minimum require props', () => {
            render(<TfsDateInput heading={heading} componentId={componentId} />);
            screen.getByText('test Component');
        });

        it('with specified default date', () => {
            render(
                <TfsDateInput
                    defaultValueDay={defaultValueDay}
                    defaultValueMonth={defaultValueMonth}
                    defaultValueYear={defaultValueYear}
                    heading={heading}
                    componentId={componentId}
                />,
            );
            screen.getByDisplayValue('29');
            screen.getByDisplayValue('04');
            screen.getByDisplayValue('2020');
        });

        it('date input as disabled if disabled is true', () => {
            render(
                <TfsDateInput
                    defaultValueDay={defaultValueDay}
                    defaultValueMonth={defaultValueMonth}
                    defaultValueYear={defaultValueYear}
                    heading={heading}
                    componentId={componentId}
                    disabled={true}
                />,
            );

            const dayInput = screen.getByDisplayValue('29');
            expect(dayInput).have.property('disabled', true);

            const monthInput = screen.getByDisplayValue('04');
            expect(monthInput).have.property('disabled', true);

            const yearInput = screen.getByDisplayValue('2020');
            expect(yearInput).have.property('disabled', true);
        });

        it('date input enabled if disabled is false', () => {
            render(
                <TfsDateInput
                    defaultValueDay={defaultValueDay}
                    defaultValueMonth={defaultValueMonth}
                    defaultValueYear={defaultValueYear}
                    heading={heading}
                    componentId={componentId}
                    disabled={false}
                />,
            );

            const dayInput = screen.getByDisplayValue('29');
            expect(dayInput).to.not.have.property('disabled', undefined);

            const monthInput = screen.getByDisplayValue('04');
            expect(monthInput).to.not.have.property('disabled', undefined);

            const yearInput = screen.getByDisplayValue('2020');
            expect(yearInput).to.not.have.property('disabled', undefined);
        });

        it('date input enabled if no disabled property provided', () => {
            render(
                <TfsDateInput
                    defaultValueDay={defaultValueDay}
                    defaultValueMonth={defaultValueMonth}
                    defaultValueYear={defaultValueYear}
                    heading={heading}
                    componentId={componentId}
                />,
            );

            const dayInput = screen.getByDisplayValue('29');
            expect(dayInput).to.not.have.property('disabled', undefined);

            const monthInput = screen.getByDisplayValue('04');
            expect(monthInput).to.not.have.property('disabled', undefined);

            const yearInput = screen.getByDisplayValue('2020');
            expect(yearInput).to.not.have.property('disabled', undefined);
        });

        it('with error message', () => {
            const tfsDateInput = render(
                <TfsDateInput
                    heading={'test Component'}
                    componentId={'testComponent'}
                    namePrefixValue={'testComponent'}
                    errorMessage={'there are errors'}
                />,
            );

            expect(
                tfsDateInput.container.getElementsByClassName('govuk-input--width-2 govuk-input--error').length,
            ).to.equal(2);
            expect(
                tfsDateInput.container.getElementsByClassName('govuk-input--width-4 govuk-input--error').length,
            ).to.equal(1);
        });

        it('with hint', () => {
            render(<TfsDateInput hint={hint} heading={heading} componentId={componentId} />);
            screen.getByText('This is a hint');
        });
    });
});
