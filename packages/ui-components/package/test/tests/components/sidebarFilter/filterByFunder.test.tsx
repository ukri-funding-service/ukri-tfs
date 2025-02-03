import 'mocha';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { FilterByFunder } from '../../../../src/components/sideBarFilter/filterByFunder';

describe('filter-by-funder component', () => {
    const renderComponent = () => {
        render(<FilterByFunder totalRecords={0} csrfToken={'fake'} />);
    };

    it('should have a heading', () => {
        renderComponent();

        screen.getByRole('group', { name: 'Filter by Council' });
    });
});
