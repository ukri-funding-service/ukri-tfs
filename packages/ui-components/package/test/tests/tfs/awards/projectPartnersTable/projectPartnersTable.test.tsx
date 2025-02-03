import React from 'react';
import { render } from '@testing-library/react';
import {
    formatPenceAsPoundsCurrency,
    sortProjectPartners,
    TfsProjectPartner,
    TfsProjectPartnersTable,
} from '../../../../../src';
import { expect } from 'chai';

describe('packages/ui-components - tfs/projectPartnersTable', () => {
    describe('projectPartnersTable', () => {
        const projectPartner1 = {
            organisationName: 'First Organisation',
            country: 'United Kingdom',
            directContributionPence: 1000000,
            inKindContributionPence: 2000000,
            nameOfContact: 'Contact 1',
        } as TfsProjectPartner;

        const projectPartner2 = {
            organisationName: 'Second Organisation',
            country: 'United Kingdom',
            directContributionPence: 3000000,
            inKindContributionPence: 4000000,
            nameOfContact: 'Contact 2',
        } as TfsProjectPartner;

        const projectPartner3 = {
            organisationName: 'Third Organisation',
            country: 'United Kingdom',
            directContributionPence: 5000000,
            inKindContributionPence: 6000000,
            nameOfContact: 'Contact 3',
        } as TfsProjectPartner;

        const projectPartners = [projectPartner3, projectPartner1, projectPartner2] as TfsProjectPartner[];

        it('Should sort by organisation name', () => {
            const sortedProjectPartners = sortProjectPartners(projectPartners);
            expect(sortedProjectPartners[0]).to.eql(projectPartner1);
            expect(sortedProjectPartners[1]).to.eql(projectPartner2);
            expect(sortedProjectPartners[2]).to.eql(projectPartner3);
        });

        it('Should convert pence to pounds and return in currency format', () => {
            expect(formatPenceAsPoundsCurrency(0)).to.eql('0.00');
            expect(formatPenceAsPoundsCurrency(10)).to.eql('0.10');
            expect(formatPenceAsPoundsCurrency(100)).to.eql('1.00');
            expect(formatPenceAsPoundsCurrency(1000)).to.eql('10.00');
            expect(formatPenceAsPoundsCurrency(100000)).to.eql('1,000.00');
            expect(formatPenceAsPoundsCurrency(1000000)).to.eql('10,000.00');
        });

        it('should render the project partners table', () => {
            const component = render(<TfsProjectPartnersTable projectPartners={projectPartners} editMode={true} />);

            const table = component.getByRole('table');
            const tableHeaders = table.querySelectorAll('th');

            expect(tableHeaders.length).to.eq(6);
            expect(tableHeaders[0].textContent).to.eql('Organisation name');
            expect(tableHeaders[1].textContent).to.eql('Country');
            expect(tableHeaders[2].textContent).to.eql('Direct contribution (£)');
            expect(tableHeaders[3].textContent).to.eql('Indirect contribution (£)');
            expect(tableHeaders[4].textContent).to.eql('Name of contact');
            expect(tableHeaders[5].textContent).to.eql('');

            const removeButtons = table.querySelectorAll('.govuk-button--link');

            expect(removeButtons.length).to.eq(3);
        });

        it('should render the project partners table in read only mode', () => {
            const component = render(<TfsProjectPartnersTable projectPartners={projectPartners} editMode={false} />);

            const table = component.getByRole('table');
            const tableHeaders = table.querySelectorAll('th');

            expect(tableHeaders.length).to.eq(5);

            const removeButtons = table.querySelectorAll('.govuk-button--link');

            expect(removeButtons.length).to.eq(0);
        });
    });
});
