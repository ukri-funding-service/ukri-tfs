import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { CostPolicy, TfsApplicationContentResourcesAndCostsSection } from '../../../../../src';

describe('<TfsApplicationContentResourcesAndCostsSection /> component tests', () => {
    const costPolicy: CostPolicy = {
        id: 1,
        isComplete: false,
        costCategories: [
            {
                name: 'Test category 1',
                percentage: 80,
                sequence: 0,
                costAmount: 10000,
                opportunityCostPolicyCategoryId: 1,
            },
        ],
    };

    it('should render row as expected', () => {
        const wrapper = render(
            <TfsApplicationContentResourcesAndCostsSection id="test-section" costPolicy={costPolicy} />,
        );

        const row = wrapper.container.querySelectorAll('.costs-table table tbody tr');

        expect(row).to.have.lengthOf(1);
        expect(row[0].querySelectorAll('td')[0].textContent).to.equal('Test category 1');
        expect(row[0].querySelectorAll('td')[1].textContent).to.equal('10,000');
        expect(row[0].querySelectorAll('td')[2].textContent).to.equal('80');
        expect(row[0].querySelectorAll('td')[3].textContent).to.equal('8,000.00');
        wrapper.unmount();
    });

    it('should render total table as expected', () => {
        const wrapper = render(
            <TfsApplicationContentResourcesAndCostsSection id="test-section" costPolicy={costPolicy} />,
        );

        const table = wrapper.container.querySelector('.costs-total-table tbody');
        expect(table).to.not.be.null;

        expect(table!.querySelectorAll('tr')[0].querySelectorAll('td')[0].textContent).to.equal('£10,000');
        expect(table!.querySelectorAll('tr')[1].querySelectorAll('td')[0].textContent).to.equal('£2,000.00');
        expect(table!.querySelectorAll('tr')[2].querySelectorAll('td')[0].textContent).to.equal('£8,000.00');
        wrapper.unmount();
    });

    it('should render text if cost policy is missing', () => {
        const wrapper = render(<TfsApplicationContentResourcesAndCostsSection id="test-section" />);

        const table = wrapper.container.querySelectorAll('.costs-table');
        const noSection = wrapper.container.querySelector('p');

        expect(table).to.have.lengthOf(0);
        expect(noSection).to.not.be.null;
        expect(noSection!.textContent).to.equal('No resources and cost section.');
        wrapper.unmount();
    });
});
