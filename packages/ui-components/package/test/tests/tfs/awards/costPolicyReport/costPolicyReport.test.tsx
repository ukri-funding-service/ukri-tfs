import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { TfsCostPolicyReport } from '../../../../../src';

describe('packages/ui-components - tfs/costPolicyReport', () => {
    describe('costPolicyReport', () => {
        const defaultCostPolicy = {
            awardTotal: 2621.06,
            totalAuthorisedFec: 3024.3,
            contributionFromApplyingOrganisation: 403.24,
            costPolicyItems: [],
        };

        const directlyAllocatedCostPolicyItems = [
            {
                costCategory: 'Directly allocated',
                fundHeading: 'Estates',
                fecPercentage: 100,
                authorisedFecNet: 1000,
                authorisedFecIndexation: 8.1,
                authorisedFecTotal: 1008.1,
                rcContributionNet: 1000,
                rcContributionIndexation: 8.1,
                rcContributionTotal: 1008.1,
            },
        ];

        const directlyIncurredCostPolicyItems = [
            {
                costCategory: 'Directly incurred',
                fundHeading: 'Other',
                fecPercentage: 80,
                authorisedFecNet: 1000,
                authorisedFecIndexation: 8.1,
                authorisedFecTotal: 1008.1,
                rcContributionNet: 800,
                rcContributionIndexation: 6.48,
                rcContributionTotal: 806.48,
            },
            {
                costCategory: 'Directly incurred',
                fundHeading: 'Travel and subsistence',
                fecPercentage: 80,
                authorisedFecNet: 1000,
                authorisedFecIndexation: 8.1,
                authorisedFecTotal: 1008.1,
                rcContributionNet: 800,
                rcContributionIndexation: 6.48,
                rcContributionTotal: 806.48,
            },
        ];

        it('should render the cost policy totals and tables', () => {
            const costPolicy = {
                ...defaultCostPolicy,
                ...{
                    costPolicyItems: directlyAllocatedCostPolicyItems,
                },
            };

            const component = render(<TfsCostPolicyReport costPolicy={costPolicy} />);

            const labelledTitles = component.container.querySelectorAll('.labelled-title-text');

            expect(labelledTitles.length).to.eql(3);
            expect(labelledTitles[0].textContent).to.eql('Total fEC');
            expect(labelledTitles[1].textContent).to.eql('Contribution from applying organisation');
            expect(labelledTitles[2].textContent).to.eql('Award value');

            const table = component.queryByRole('table');
            const fundHeading = component.queryByText('Fund headings');
            const fecPercentage = component.queryByText('fEC (%)');
            const fullCosts = component.queryByText('Full costs (£)');
            const ukriContribution = component.queryByText('UKRI contribution (£)');
            const fecIndexation = component.queryByText('fEC Indexation (£)');
            const totalFec = component.queryByText('Total fEC (£)');
            const ukriIndexation = component.queryByText('UKRI Indexation (£)');
            const awardTotal = component.queryByText('Award total (£)');

            expect(table).to.not.be.null;
            expect(fundHeading).to.not.be.null;
            expect(fecPercentage).to.not.be.null;
            expect(fullCosts).to.not.be.null;
            expect(ukriContribution).to.not.be.null;
            expect(fecIndexation).to.not.be.null;
            expect(totalFec).to.not.be.null;
            expect(ukriIndexation).to.not.be.null;
            expect(awardTotal).to.not.be.null;
        });

        it('should render multiple tables if multiple cost categories are present', () => {
            const costPolicy = {
                ...defaultCostPolicy,
                ...{
                    costPolicyItems: [...directlyAllocatedCostPolicyItems, ...directlyIncurredCostPolicyItems],
                },
            };

            const component = render(<TfsCostPolicyReport costPolicy={costPolicy} />);

            const tables = component.container.querySelectorAll('table');

            expect(tables.length).to.eql(2);
        });

        it('should not render tables if no cost policy items are present', () => {
            const component = render(<TfsCostPolicyReport costPolicy={defaultCostPolicy} />);

            const table = component.queryByRole('table');

            expect(table).to.be.null;
        });

        it('should render the cost policy totals and categories for a list layout', () => {
            const costPolicy = {
                ...defaultCostPolicy,
                ...{
                    costPolicyItems: [...directlyAllocatedCostPolicyItems, ...directlyIncurredCostPolicyItems],
                },
            };

            const component = render(<TfsCostPolicyReport costPolicy={costPolicy} isListLayout={true} />);

            const headers = component.container.querySelectorAll('h3');

            expect(headers.length).to.eql(2);

            expect(component.getByTestId('total-fEC').tagName).to.eql('SPAN');
            expect(component.getByTestId('contribution-from-organisation').tagName).to.eql('SPAN');
            expect(component.getByTestId('total-award-value').tagName).to.eql('SPAN');
        });
    });
});
