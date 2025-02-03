import React from 'react';
import { expect } from 'chai';
import { DescriptionList, DescriptionEntry } from '../../../src/components/descriptionList';
import { render } from '@testing-library/react';

describe('<DescriptionList /> component tests', () => {
    it('should create dd - dt pairs', () => {
        const { container, getByTestId } = render(
            <DescriptionList className="description-list" id="some-id">
                <DescriptionEntry
                    term="some term"
                    termClassName="term-class"
                    details="some details"
                    detailsClassName="details-class"
                    details-testid="testId"
                />
            </DescriptionList>,
        );
        expect(container.querySelector('.term-class')!.textContent).to.equal('some term');
        expect(container.querySelector('.details-class')!.textContent).to.equal('some details');
        expect(container.querySelector('.details-class')!.textContent).to.equal('some details');
        expect(getByTestId('testId').textContent).to.equal('some details');
    });
});
