import { render, RenderResult } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { TfsApplicationStructuredCostsSection } from '../../../../../src/tfs/applicationView/elements/contentStructuredResourcesAndCost';
import { structuredCosts } from '../../../factories/StructuredCostSection';

describe('<TfsApplicationStructuredCostsSection /> component tests', () => {
    describe('Render component', () => {
        let wrapper: RenderResult;

        beforeEach(() => {
            wrapper = render(
                <TfsApplicationStructuredCostsSection id="test-section" structuredCosts={structuredCosts} />,
            );
        });

        afterEach(() => {
            wrapper.unmount();
        });

        it('should mount', () => {
            expect(wrapper?.container?.textContent).to.contain('Total full economic costs (fEC)');
            expect(wrapper?.container?.textContent).to.contain('Total funding applied for');
            expect(wrapper?.container?.textContent).to.contain('Total contribution from applying organisation(s)');
        });

        it('should render the applicants', () => {
            expect(wrapper?.container?.textContent).to.contain('UI Smoke');
            expect(wrapper?.container?.textContent).to.contain('Doctoral student');
            expect(wrapper?.container?.textContent).to.contain('Tim Berners-Lee');
        });

        it('should render the applicants', () => {
            expect(wrapper?.container?.textContent).to.contain('UI Smoke');
            expect(wrapper?.container?.textContent).to.contain('Doctoral student');
            expect(wrapper?.container?.textContent).to.contain('Tim Berners-Lee');
        });

        it('should render the directly allocated categories', () => {
            const directlyAllocatedTable = wrapper?.getByTestId('parent-table-1361');

            expect(directlyAllocatedTable.textContent).to.contain('Staff');
            expect(directlyAllocatedTable.textContent).to.contain('Estates');
            expect(directlyAllocatedTable.textContent).to.contain('Other');
        });

        it('should render the directly incurred categories', () => {
            const directlyAllocatedTable = wrapper?.getByTestId('parent-table-1362');

            expect(directlyAllocatedTable.textContent).to.contain('Staff');
            expect(directlyAllocatedTable.textContent).to.contain('Equipment');
            expect(directlyAllocatedTable.textContent).to.contain('Travel and subsistence');
            expect(directlyAllocatedTable.textContent).to.contain('Other');
        });

        it('should render the indirect categories', () => {
            const directlyAllocatedTable = wrapper?.getByTestId('parent-table-1363');

            expect(directlyAllocatedTable.textContent).to.contain('Indirect costs');
        });

        it('should render the directly exceptions categories', () => {
            const directlyAllocatedTable = wrapper?.getByTestId('parent-table-1364');

            expect(directlyAllocatedTable.textContent).to.contain('Staff');
            expect(directlyAllocatedTable.textContent).to.contain('Equipment');
            expect(directlyAllocatedTable.textContent).to.contain('Travel and subsistence');
            expect(directlyAllocatedTable.textContent).to.contain('Other');
        });
    });

    describe('Render breakdown link', () => {
        let wrapper: RenderResult;

        beforeEach(() => {
            structuredCosts.breakdownUrl = '/applications/example-url';
            wrapper = render(
                <TfsApplicationStructuredCostsSection id="test-section" structuredCosts={structuredCosts} />,
            );
        });

        afterEach(() => {
            wrapper.unmount();
        });

        it('should render the link', () => {
            expect(wrapper?.container?.textContent).to.contain('Full cost breakdown by organisation');
        });

        it('should have the right link', () => {
            expect(wrapper?.getByTestId('full-breakdown-url').getAttribute('href')).to.equal(
                '/applications/example-url',
            );
        });

        it('should not show the link when disabled', () => {
            structuredCosts.disableBreakdown = true;
            wrapper = render(
                <TfsApplicationStructuredCostsSection id="test-section" structuredCosts={structuredCosts} />,
            );
            expect(wrapper?.container?.textContent).to.not.contain('Full cost breakdown by organisation');
        });
    });

    describe('calculations', () => {
        let wrapper: RenderResult;

        beforeEach(() => {
            wrapper = render(
                <TfsApplicationStructuredCostsSection id="test-section" structuredCosts={structuredCosts} />,
            );
        });

        afterEach(() => {
            wrapper.unmount();
        });

        it('should display the correct "applied for" for each category', () => {
            const directlyAllocatedTable = wrapper?.getByTestId('parent-table-1361');

            expect(directlyAllocatedTable.textContent).to.contain('£808,000');
            expect(directlyAllocatedTable.textContent).to.contain('£160,006');
            expect(directlyAllocatedTable.textContent).to.contain('£80');
        });

        it('should display a dash for costs that have not been entered', () => {
            const directlyAllocatedTable = wrapper?.getByTestId('parent-table-1364');

            expect(directlyAllocatedTable.textContent).to.contain('£6,700');
            expect(directlyAllocatedTable.textContent?.match(/-/g)?.length).to.equal(3);
        });

        it('should correctly calculate totals', () => {
            const [fEC, totalContribution, totalAppliedFor] = Array.from(
                wrapper.container.querySelectorAll('.cost-summary-value'),
            );
            expect(fEC.textContent).to.equal('£3,767,140');
            expect(totalAppliedFor.textContent).to.equal('£3,015,053.20');
            expect(totalContribution.textContent).to.equal('£752,086.80');
        });
    });

    describe('justification', () => {
        let wrapper: RenderResult;

        beforeEach(() => {
            wrapper = render(
                <TfsApplicationStructuredCostsSection id="test-section" structuredCosts={structuredCosts} />,
            );
        });

        afterEach(() => {
            wrapper.unmount();
        });

        it('should display the read only justification', () => {
            expect(wrapper?.container?.textContent).to.contain(
                'Justification, I think we are qualified and we can do a good job',
            );
            expect(wrapper?.container?.innerHTML).to.contain(
                '<p>Justification, I think we are qualified and we can do a good job</p>',
            );
        });
    });
});
