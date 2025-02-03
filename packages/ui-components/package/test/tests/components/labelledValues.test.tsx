import React from 'react';
import { expect } from 'chai';
import { LabelledValues, LabelValuePair } from '../../../src/components/labelledValues';
import { render } from '@testing-library/react';

describe('<LabelledValues /> component tests', () => {
    let data: LabelValuePair[];

    beforeEach(function () {
        data = [
            { label: 'labelValueOne', value: 'columnValueOne', testId: 'testId1' },
            { label: 'labelValueTwo', value: 'columnValueTwo', testId: 'testId2', className: 'testClass1' },
            {
                label: 'labelValueThree',
                value: 'columnValueThree',
                testId: 'testId3',
            },
        ];
    });

    it('should render labelled values', () => {
        const { container } = render(<LabelledValues labelledValues={data} />);
        expect(container.querySelector('.labelled-value-item')).to.not.be.null;
        expect(container.querySelector('.labelled-title--top')).to.be.null;
    });

    it('should render labelled values with align top', () => {
        const { container } = render(<LabelledValues labelledValues={data} alignTop={true} />);
        expect(container.querySelector('.labelled-title--top')).to.not.be.null;
    });

    it('should add custom classname', () => {
        const { container } = render(<LabelledValues labelledValues={data} />);
        expect(container.querySelector('.testClass1')).to.not.be.null;
    });
});
