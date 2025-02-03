import React from 'react';
import { render, screen } from '@testing-library/react';
import { RadiosWithConditional, RadiosWithConditionalProps } from '../../../src/components';
import { expect } from 'chai';

describe('RadiosWithConditional', () => {
    const props: RadiosWithConditionalProps = {
        legend: 'Select an option',
        radioGroupName: 'options',
        radioData: [
            {
                id: 'option-1',
                value: 'option-1',
                text: 'Option 1',
                hint: 'This is the first option',
                name: 'test1',
            },
            {
                id: 'option-2',
                value: 'option-2',
                text: 'Option 2',
                hint: 'This is the second option',
                checked: true,
                name: 'test2',
            },
            {
                id: 'option-3',
                value: 'option-3',
                text: 'Option 3',
                hint: 'This is the third option',
                revealContent: 'Some additional content for option 3',
                revealContentBottom: true,
                revealContentClassName: 'example-class-bottom',
                // divider: true,
                name: 'test3',
            },
            {
                id: 'option-4',
                value: 'option-4',
                text: 'Option 4',
                hint: 'This is the fourth option',
                revealContent: 'Some additional content for option 4',
                revealContentClassName: 'example-class',
                name: 'test4',
            },
            {
                id: 'option-5',
                value: 'option-5',
                text: 'Option 5',
                hint: 'This is the fifth option',
                revealContent: 'Some additional content for option 5',
                name: 'test5',
                disabled: true,
            },
        ],
    };

    it('should render the legend', () => {
        render(<RadiosWithConditional {...props} />);
        expect(screen.getByText(props.legend)).to.exist;
    });

    it('should render the radio buttons', () => {
        render(<RadiosWithConditional {...props} />);
        props.radioData.forEach(item => {
            expect(screen.getByLabelText(item.text)).to.exist;
        });
    });

    it('should render the hint for each radio button', () => {
        render(<RadiosWithConditional {...props} />);
        props.radioData.forEach(item => {
            expect(screen.getByText(item.hint as string)).to.exist;
        });
    });

    it('should render the reveal content for the third radio button', () => {
        render(<RadiosWithConditional {...props} />);
        const option3 = screen.getByText('Some additional content for option 3');
        expect(option3).to.exist;
        expect(option3.className).to.contain('example-class-bottom');
    });

    it('should render the reveal content class for the fourth radio button', () => {
        render(<RadiosWithConditional {...props} />);
        const option4 = screen.getByText('Some additional content for option 4');

        expect(option4).to.exist;
        expect(option4.className).to.contain('example-class');
    });

    it('should render the radio as disabled for the fifth radio button if disabled is true', () => {
        render(<RadiosWithConditional {...props} />);

        const radioOptions = screen.getAllByRole('radio');
        expect(radioOptions[4]).to.have.property('disabled', true);
    });

    it('should render the error message', () => {
        const errorProps: RadiosWithConditionalProps = {
            ...props,
            errorMessage: { children: 'some-error-message' },
        };
        const renderedComponent = render(<RadiosWithConditional {...errorProps} />);
        const { getByText } = renderedComponent;

        expect(getByText('some-error-message')).not.to.be.null;
        expect(renderedComponent.container.querySelector('.govuk-form-group.govuk-form-group--error')).not.to.be.null;
    });
});
