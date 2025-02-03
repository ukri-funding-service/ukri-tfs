import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { expect } from 'chai';
import { TfsApplicationContentApplicantsSection } from '../../../../../src';

describe('<TfsApplicationContentApplicantsSection /> component tests', () => {
    const applicants = [
        {
            name: 'Dr Jane Doe',
            email: 'jane.doe@cardiff.ac.uk',
            role: 'Lead applicant',
            organisationName: 'University of Cardiff',
        },
        {
            name: 'Dr Fred Bloggs',
            email: 'fred.bloggs@cardiff.ac.uk',
            role: 'Researcher',
            organisationName: 'University of Cardiff',
        },
        {
            name: 'Dr Alice Applicant',
            email: 'alice.applicant@swansea.ac.uk',
            role: 'Fellow',
            organisationName: 'University of Swansea',
        },
    ];

    let componentWithoutEmail: RenderResult;
    let componentWithEmail: RenderResult;

    beforeEach(() => {
        componentWithoutEmail = render(
            <TfsApplicationContentApplicantsSection
                hideEmail
                id="section-id"
                className="serif"
                applicants={applicants}
            />,
        );

        componentWithEmail = render(
            <TfsApplicationContentApplicantsSection
                hideEmail={false}
                id="section-id"
                className="serif"
                applicants={applicants}
            />,
        );
    });

    describe('component without email', () => {
        it('should have the name role and organisation as the three columns in that order', () => {
            const tableComponent = componentWithoutEmail.container.querySelector('table');
            expect(tableComponent).to.not.be.null;

            expect(tableComponent!.querySelectorAll('th')).to.have.lengthOf(3);
            expect(tableComponent!.querySelectorAll('th')[0].textContent).to.equal('Name');
            expect(tableComponent!.querySelectorAll('th')[1].textContent).to.equal('Role');
            expect(tableComponent!.querySelectorAll('th')[2].textContent).to.equal('Organisation');
        });

        it('should have one row per applicant', () => {
            const tableComponent = componentWithoutEmail.container.querySelector('table');
            expect(tableComponent).to.not.be.null;

            const bodyComponent = tableComponent!.querySelector('tbody');
            expect(bodyComponent).to.not.be.null;

            expect(bodyComponent!.querySelectorAll('tr')).to.have.lengthOf(3);

            const tableRowComponents = tableComponent!.querySelectorAll('tr');
            expect(tableRowComponents).to.not.be.null;

            //names
            const firstCellComponent = tableRowComponents[1].querySelector('td');
            expect(firstCellComponent).to.not.be.null;
            expect(firstCellComponent!.textContent).to.equal('Dr Jane Doe');

            const secondCellComponent = tableRowComponents[2].querySelector('td');
            expect(secondCellComponent).to.not.be.null;
            expect(secondCellComponent!.textContent).to.equal('Dr Fred Bloggs');

            const thirdCellComponent = tableRowComponents[3].querySelector('td');
            expect(thirdCellComponent).to.not.be.null;
            expect(thirdCellComponent!.textContent).to.equal('Dr Alice Applicant');

            const firstRowComponent = tableComponent!.querySelectorAll('tr')[1];
            const secondRowComponent = tableComponent!.querySelectorAll('tr')[2];
            const thirdRowComponent = tableComponent!.querySelectorAll('tr')[3];

            //roles
            expect(firstRowComponent.querySelectorAll('td')[1].textContent).to.equal('Lead applicant');
            expect(secondRowComponent.querySelectorAll('td')[1].textContent).to.equal('Researcher');
            expect(thirdRowComponent.querySelectorAll('td')[1].textContent).to.equal('Fellow');

            //orgs
            expect(firstRowComponent.querySelectorAll('td')[2].textContent).to.equal('University of Cardiff');
            expect(secondRowComponent.querySelectorAll('td')[2].textContent).to.equal('University of Cardiff');
            expect(thirdRowComponent.querySelectorAll('td')[2].textContent).to.equal('University of Swansea');
        });
    });

    describe('component with email', () => {
        it('should have Email as fourth column', () => {
            const tableComponent = componentWithEmail.container.querySelector('table');
            expect(tableComponent).to.not.be.null;

            expect(tableComponent!.querySelectorAll('th')[3].textContent).to.equal('Email');
        });

        it('should have the correct number of columns', () => {
            const tableComponent = componentWithEmail.container.querySelector('table');
            expect(tableComponent).to.not.be.null;

            expect(tableComponent!.querySelectorAll('th')).to.have.lengthOf(4);
        });

        it('should have applicant emails in the fourth column of each row', () => {
            const tableComponent = componentWithEmail.container.querySelector('table');
            expect(tableComponent).to.not.be.null;

            const row1Component = tableComponent!.querySelectorAll('tr')[1];
            const row2Component = tableComponent!.querySelectorAll('tr')[2];
            const row3Component = tableComponent!.querySelectorAll('tr')[3];

            expect(row1Component.querySelectorAll('td')[3].textContent).to.equal('jane.doe@cardiff.ac.uk');
            expect(row2Component.querySelectorAll('td')[3].textContent).to.equal('fred.bloggs@cardiff.ac.uk');
            expect(row3Component.querySelectorAll('td')[3].textContent).to.equal('alice.applicant@swansea.ac.uk');
        });

        it('should have the print hidden on emails', () => {
            const tableComponent = componentWithEmail.container.querySelector('table');
            expect(tableComponent).to.not.be.null;

            const row0Component = tableComponent!.querySelectorAll('tr')[0];
            const row1Component = tableComponent!.querySelectorAll('tr')[1];
            const row2Component = tableComponent!.querySelectorAll('tr')[2];
            const row3Component = tableComponent!.querySelectorAll('tr')[3];

            expect(row0Component.querySelectorAll('th')[3].className).to.contain('print-hide');
            expect(row1Component.querySelectorAll('td')[3].className).to.contain('print-hide');
            expect(row2Component.querySelectorAll('td')[3].className).to.contain('print-hide');
            expect(row3Component.querySelectorAll('td')[3].className).to.contain('print-hide');
        });
    });
});
