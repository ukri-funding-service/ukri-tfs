import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ProjectPartnersTable, TfsApplicationContentProjectPartnerSection } from '../../../../../src';

const partner = {
    id: 1,
    organisation: {
        name: 'org 1',
        city: 'paris',
        country: 'france',
        id: 5,
    },
    contactData: {
        firstName: 'john',
        lastName: 'smith',
        email: 'wibble@org.com',
    },
    inKindContribution: {
        summary: 'inkind money',
        value: 444000,
    },
    directContribution: {
        summary: 'direct money',
        value: 555.5,
    },
};
describe('<ProjectPartnersTable /> component test', () => {
    it('renders text correctly', () => {
        const wrapper = render(<ProjectPartnersTable partners={[partner]} />);
        const rows = wrapper.container.querySelectorAll('tbody tr');
        expect(rows.length).to.equal(1);
        expect(rows[0].textContent).to.contain('org 1');
        expect(rows[0].textContent).to.contain('paris, france');
        expect(rows[0].textContent).to.contain('john smith');
        expect(rows[0].textContent).to.contain('wibble@org.com');
        expect(rows[0].textContent).to.contain('£555.50');
        expect(rows[0].textContent).to.contain('direct money');
        expect(rows[0].textContent).to.contain('£444,000');
        expect(rows[0].textContent).to.contain('inkind money');

        wrapper.unmount();
    });

    it('rows are generated off of partners', () => {
        const partner2 = { ...partner, id: 2 };
        const partner3 = { ...partner, id: 3 };

        const wrapper = render(<ProjectPartnersTable partners={[partner, partner2, partner3]} />);
        const rows = wrapper.container.querySelectorAll('tbody tr');
        expect(rows.length).to.equal(3);
        wrapper.unmount();
    });
});

describe('<TfsApplicationContentProjectPartnerSection /> component tests', () => {
    it('should display no project partner message', () => {
        const wrapper = render(<TfsApplicationContentProjectPartnerSection id="test-section" partners={[]} />);
        const paragraphs = wrapper.container.querySelectorAll('p');
        expect(paragraphs.length).to.equal(1);
        expect(paragraphs[0].textContent).to.equal('No project partners.');
        wrapper.unmount();
    });

    it('should display the project partner table', () => {
        const wrapper = render(<TfsApplicationContentProjectPartnerSection id="test-section" partners={[partner]} />);
        expect(wrapper.container.querySelectorAll('table').length).to.equal(1);
        wrapper.unmount();
    });
});
