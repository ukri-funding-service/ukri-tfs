import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import * as Components from '../../../../src';
import { TfsApplicationSectionType } from '../../../../src';

describe('<ApplicationView /> tests', () => {
    const id = 'application-view';
    const alert = 'This is how reviewers will see your proposal.';
    const applicationInfo = [
        { key: 'Application reference:', value: 'APP500' },
        { key: 'Applicant:', value: 'John Doe' },
        { key: 'Organisation:', value: 'University of Bristol' },
    ];
    const applicationContent: Components.TfsApplicationViewContent = {
        name: 'Development of a Novel Inhibitor of Ricin',
        showEditLinks: false,
        sections: [
            {
                type: TfsApplicationSectionType.Details,
                title: 'Details',
                summary: 'Summary',
                displayStartDateAndDuration: true,
                projectDuration: '2 months',
                projectStartDate: '1st January 2021',
            },
            {
                type: TfsApplicationSectionType.Applicants,
                title: 'Applicants',
                applicants: [
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
                        role: 'Researcher',
                        organisationName: 'University of Swansea',
                    },
                ],
            },
            {
                type: TfsApplicationSectionType.Custom,
                title: 'Custom Question 1',
                questionSubTitleLabel: 'sub-title 1',
                questionGuidanceNotesContent: 'notes 1',
                questionsetId: '1',
                answer: 'one',
                fileMetadata: [{ id: '2', fileName: 'myFile', fileType: 'pdf', status: 'SCANNED', size: 2 }],
            },
            {
                type: TfsApplicationSectionType.Costs,
                title: 'Resources and costs',
                costPolicy: {
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
                },
            },
            {
                type: TfsApplicationSectionType.ProjectPartners,
                title: 'Project partners',
                partners: [],
            },
        ],
    };

    it('should render with table of contents when showTableOfContents prop is true', () => {
        const component = render(
            <Components.TfsApplicationView
                applicationContent={applicationContent}
                id={id}
                applicationInfo={applicationInfo}
                statusText="Submitted 3:30pm 12 August 2020"
                alert={alert}
                showTableOfContents
            />,
        );
        expect(component.container.querySelectorAll('#application-view')).to.have.lengthOf(1);
        expect(component.container.querySelectorAll('#application-view-toc')).to.have.lengthOf(1);
        expect(component.container.querySelectorAll('#application-view-content')).to.have.lengthOf(1);
    });

    it('should render without table of contents when showTableOfContents prop is false', () => {
        const component = render(
            <Components.TfsApplicationView
                applicationContent={applicationContent}
                id={id}
                applicationInfo={applicationInfo}
                statusText="Submitted 3:30pm 12 August 2020"
                alert={alert}
                showTableOfContents={false}
            />,
        );
        expect(component.container.querySelectorAll('#application-view')).to.have.lengthOf(1);
        expect(component.container.querySelectorAll('#application-view-toc')).to.have.lengthOf(0);
        expect(component.container.querySelectorAll('#application-view-content')).to.have.lengthOf(1);
    });

    it('should render with alert when alert prop is set', () => {
        const alertText = 'This is how reviewers will see your proposal.';
        const wrapper = render(
            <Components.TfsApplicationView
                applicationContent={applicationContent}
                id="application-view"
                applicationInfo={applicationInfo}
                statusText="Submitted 3:30pm 12 August 2020"
                alert={alertText}
            />,
        );

        expect(wrapper.container.querySelector('#application-view-content-alert')?.textContent).to.eq(alertText);
    });

    it('should render without alert when alert prop is not set', () => {
        const wrapper = render(
            <Components.TfsApplicationView
                applicationContent={applicationContent}
                id="application-view"
                applicationInfo={applicationInfo}
                statusText="Submitted 3:30pm 12 August 2020"
            />,
        );
        expect(wrapper.container.querySelector('#application-view-content-alert')).to.be.null;
        wrapper.unmount();
    });

    it('should render with application name as heading', () => {
        const wrapper = render(
            <Components.TfsApplicationView
                applicationContent={applicationContent}
                id="application-view"
                applicationInfo={applicationInfo}
                statusText="Submitted 3:30pm 12 August 2020"
            />,
        );

        expect(wrapper.container.querySelector('#application-view-content-heading')?.textContent).to.equal(
            applicationContent.name,
        );
        wrapper.unmount();
    });

    it('should render with details section heading', () => {
        const wrapper = render(
            <Components.TfsApplicationView
                applicationContent={applicationContent}
                id="application-view"
                applicationInfo={applicationInfo}
                statusText="Submitted 3:30pm 12 August 2020"
            />,
        );

        expect(wrapper.container.querySelector('#application-view-content-details-heading')?.textContent).to.equal(
            `1. ${applicationContent.sections[0].title}`,
        );
        wrapper.unmount();
    });

    it('should render with applicants section heading', () => {
        const wrapper = render(
            <Components.TfsApplicationView
                applicationContent={applicationContent}
                id="application-view"
                applicationInfo={applicationInfo}
                statusText="Submitted 3:30pm 12 August 2020"
            />,
        );

        expect(wrapper.container.querySelector('#application-view-content-applicants-heading')?.textContent).to.equal(
            `2. ${applicationContent.sections[1].title}`,
        );
        wrapper.unmount();
    });

    it('should render with custom section heading', () => {
        const wrapper = render(
            <Components.TfsApplicationView
                applicationContent={applicationContent}
                id="application-view"
                applicationInfo={applicationInfo}
                statusText="Submitted 3:30pm 12 August 2020"
            />,
        );

        expect(wrapper.container.querySelector('#application-view-content-custom-1-heading')?.textContent).to.equal(
            `3. ${applicationContent.sections[2].title}`,
        );
        wrapper.unmount();
    });

    it('should render with resources and costs heading', () => {
        const wrapper = render(
            <Components.TfsApplicationView
                applicationContent={applicationContent}
                id="application-view"
                applicationInfo={applicationInfo}
                statusText="Submitted 3:30pm 12 August 2020"
            />,
        );

        expect(wrapper.container.querySelector('#application-view-content-costs-heading')?.textContent).to.equal(
            `4. ${applicationContent.sections[3].title}`,
        );
        wrapper.unmount();
    });

    const detailsBoxPrintShowOccuranceCount = 3;

    it('should render without applicationInfo', () => {
        const wrapper = render(
            <Components.TfsApplicationView
                applicationContent={applicationContent}
                id="application-view"
                statusText="Submitted 3:30pm 12 August 2020"
            />,
        );

        expect(wrapper.container.querySelector('#application-view-content-custom-1-heading')?.textContent).to.equal(
            `3. ${applicationContent.sections[2].title}`,
        );

        expect(wrapper.container.querySelectorAll('.print-show').length).to.equal(detailsBoxPrintShowOccuranceCount);
        wrapper.unmount();
    });

    it('should render without statusText', () => {
        const wrapper = render(
            <Components.TfsApplicationView
                applicationContent={applicationContent}
                id="application-view"
                applicationInfo={applicationInfo}
            />,
        );

        expect(wrapper.container.querySelector('#application-view-content-custom-1-heading')?.textContent).to.equal(
            `3. ${applicationContent.sections[2].title}`,
        );
        expect(wrapper.container.querySelectorAll('.print-show').length).to.equal(detailsBoxPrintShowOccuranceCount);
        wrapper.unmount();
    });

    it('should not render edit links if showEditLinks is false', () => {
        const wrapper = render(
            <Components.TfsApplicationView
                applicationContent={applicationContent}
                id="application-view"
                applicationInfo={applicationInfo}
                statusText="Submitted 3:30pm 12 August 2020"
            />,
        );

        expect(wrapper.container.querySelectorAll('.govuk-heading_additional-link')).to.have.lengthOf(0);
        wrapper.unmount();
    });

    it('should render edit links if showEditLinks is true', () => {
        const wrapper = render(
            <Components.TfsApplicationView
                applicationContent={{ ...applicationContent, showEditLinks: true }}
                id="application-view"
                applicationInfo={applicationInfo}
                statusText="Submitted 3:30pm 12 August 2020"
            />,
        );

        expect(wrapper.container.querySelector('.govuk-heading_additional-link')?.textContent).to.include(
            'Edit Details',
        );
        wrapper.unmount();
    });
});
