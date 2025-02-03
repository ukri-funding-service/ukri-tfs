import React from 'react';
import { expect } from 'chai';
import { TimeEntry } from '../../../src/components/timeEntry';
import { render } from '@testing-library/react';

describe('<TimeEntry /> component tests', () => {
    it('should show the input elements', () => {
        const component = render(<TimeEntry name="timeField" label="Starting time" />);
        expect(component.container.querySelector('#timeField-hours')).to.exist;
        expect(component.container.querySelector('#timeField-minutes')).to.exist;
        expect(component.container.querySelector('#timeField-meridian')).to.exist;
        expect(component.container.querySelector('.govuk-form-group--error')).to.not.exist;
        expect(component.container.querySelector('.govuk-error-message')).to.not.exist;
    });

    it('should show the legend', () => {
        const component = render(<TimeEntry name="timeField" label="Starting time" />);
        const legend = component.container.querySelector('legend');
        expect(legend).to.exist;
        expect(legend!.textContent).to.equal('Starting time');
    });

    it('should show error message if added', () => {
        const component = render(
            <TimeEntry name="timeField" label="Starting time" errorMessage={{ children: 'some error' }} />,
        );
        expect(component.container.querySelector('.govuk-form-group--error')).to.exist;
        expect(component.container.querySelector('.govuk-error-message')!.textContent).to.equal('Error: some error');
    });
});
