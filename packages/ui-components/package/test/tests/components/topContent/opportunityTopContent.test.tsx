import 'mocha';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { topContent } from '../../../../src/components/topContent/opportunityTopContent';
import { OpportunityFunderFilterItem } from '../../../../src/enums/enums';

describe('opportunity top component', () => {
    const funder = OpportunityFunderFilterItem.UKRI;
    const topContentProps = {
        totalRecords: 30,
        checkedOpportunityFunderFilters: [funder],
        filterSummaryText: `opportunities with a council of '${funder}'`,
    };
    const renderComponent = () => {
        render(<>{topContent(topContentProps)}</>);
    };

    it('should have a heading', () => {
        renderComponent();
        screen.getByText(`opportunities with a council of '${funder}'`);
    });
});
