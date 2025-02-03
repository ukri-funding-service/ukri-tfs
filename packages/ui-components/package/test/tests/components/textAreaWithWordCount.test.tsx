import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import { TextAreaWithWordCount, TextAreaWithWordCountProps } from '../../../src/components/textAreaWithWordCount';

describe('Input with word count component tests', () => {
    const defaultProps: TextAreaWithWordCountProps = {
        name: '',
        rows: 3,
        maxWordCount: 3,
    };

    it('should show word count if showWordCount true and max word count provided', async () => {
        const component = await render(<TextAreaWithWordCount {...defaultProps} />);
        expect(component.container.querySelector('#more-detail-info-')).to.exist;
        expect(component.queryByText('You have 3 words remaining')).to.exist;
    });
    it('should update word count if value entered', async () => {
        const component = await render(<TextAreaWithWordCount {...defaultProps} maxWordCount={23} />);
        const testArgs = { target: { value: 'some words like' } };
        const textarea = component.container.querySelector('textarea')!;
        fireEvent.change(textarea, testArgs);
        expect(component.queryByText('You have 20 words remaining')).to.exist;
    });
    it('should update word count if defaultvalue provided', async () => {
        const component = await render(
            <TextAreaWithWordCount {...defaultProps} maxWordCount={23} defaultValue={'some text here'} />,
        );
        expect(component.queryByText('You have 20 words remaining')).to.exist;
    });
    it('should display 1 word remaining', async () => {
        const component = await render(<TextAreaWithWordCount {...defaultProps} maxWordCount={2} />);
        const testArgs = { target: { value: 'd' } };
        const textarea = component.container.querySelector('textarea')!;
        fireEvent.change(textarea, testArgs);
        expect(component.queryByText('You have 1 word remaining')).to.exist;
    });
    it('should display 0 remaining', async () => {
        const component = await render(<TextAreaWithWordCount {...defaultProps} maxWordCount={1} />);
        const testArgs = { target: { value: 'w' } };
        const textarea = component.container.querySelector('textarea')!;
        fireEvent.change(textarea, testArgs);
        expect(component.queryByText('You have 0 words remaining')).to.exist;
    });
    it('should display over word count text', async () => {
        const component = await render(<TextAreaWithWordCount {...defaultProps} maxWordCount={1} />);
        const testArgs = { target: { value: 'some words like this' } };
        const textarea = component.container.querySelector('textarea')!;
        fireEvent.change(textarea, testArgs);
        expect(component.queryByText('You are 3 words over the limit')).to.exist;
    });
    it('should display 1 word over word count text', async () => {
        const component = await render(<TextAreaWithWordCount {...defaultProps} />);
        const testArgs = { target: { value: 'some words like this' } };
        const textarea = component.container.querySelector('textarea')!;
        fireEvent.change(textarea, testArgs);
        expect(component.queryByText('You are 1 word over the limit')).to.exist;
    });
});
