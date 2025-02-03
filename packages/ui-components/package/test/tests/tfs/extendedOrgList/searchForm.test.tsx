/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { SearchForm } from '../../../../src/tfs/extendedOrgList/searchForm';

describe('<SearchForm>', () => {
    it('should render', () => {
        const component = render(SearchForm({} as any, { csrfToken: 'csrfToken' } as any));
        expect(component.container.querySelectorAll('form').length).to.equal(1);
    });

    it('should display errors', () => {
        const component = render(
            SearchForm(
                { errors: [{ fieldName: 'term', message: 'an error message' }] } as any,
                { csrfToken: 'csrfToken' } as any,
            ),
        );
        expect(component.container.outerHTML).to.contain('an error message');
    });
});
