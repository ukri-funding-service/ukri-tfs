import { boolean, object, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import * as Components from '../';
import { FileMetadata } from '../components';
import {
    ApplicationReviewItemPageProps,
    PaginationPageProps,
    TfsPageHeading,
    TfsApplicationReviewList,
    TfsCostPolicyReport,
    TfsProjectPartnersTable,
    TfsProjectPartner,
} from '../tfs';
import * as TfsApplicationViewElements from '../tfs/applicationView/elements';
import { CostPolicy, TfsApplicationSectionType } from '../tfs/applicationView/types/applicationViewContent';

const stories = storiesOf('TFS Components', module);

stories.addDecorator(withKnobs);

stories.add('Application Content Applicants Section', () => {
    const className = text('Custom class attribute', 'serif');
    const id = text('Id', 'applicants-section-id');
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
            role: 'Researcher',
            organisationName: 'University of Swansea',
        },
    ];
    const hideEmail = false;

    return (
        <TfsApplicationViewElements.TfsApplicationContentApplicantsSection
            id={id}
            className={className}
            applicants={applicants}
            hideEmail={hideEmail}
        />
    );
});

stories.add('Application Content Custom Question Section', () => {
    const answer = text(
        'Answer',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    );
    const fileMetadata: FileMetadata[] = [
        { id: 'abcd', fileName: 'file', fileType: 'pdf', status: 'SCANNED', size: 2 },
    ];
    const questionSubtitleLabel = 'question subtitle label';
    const questionGuidanceNotesContent = 'question guidance notes content';

    return (
        <TfsApplicationViewElements.TfsApplicationContentCustomQuestionSection
            id="storybook-application-content-custom-question-section"
            answer={answer}
            fileMetadata={fileMetadata}
            questionSubTitleLabel={questionSubtitleLabel}
            questionGuidanceNotesContent={questionGuidanceNotesContent}
        />
    );
});

stories.add('Application Content Details Section', () => {
    const applicationSummary = text(
        'Summary',
        'Pellentesque molestie ante quis elit gravida euismod. Vestibulum egestas elementum sapien.',
    );
    const displayStartDateAndDuration = boolean('Display start date and duration', true);
    const startDate = text('Start date', 'August 2020');
    const duration = text('Duration', '24 months');

    return (
        <TfsApplicationViewElements.TfsApplicationContentDetailsSection
            id="storybook-application-content-details-section"
            applicationSummary={applicationSummary}
            displayStartDateAndDuration={displayStartDateAndDuration}
            projectStartDate={startDate}
            projectDuration={duration}
        />
    );
});

stories.add('Application Content Resources and costs Section', () => {
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

    return (
        <TfsApplicationViewElements.TfsApplicationContentResourcesAndCostsSection
            id="storybook-application-content-costs-section"
            costPolicy={costPolicy}
        />
    );
});

stories.add('Application Content TOC', () => {
    const id = text('ID', 'application-view-toc');
    const applicationContent: Components.TfsApplicationViewContent = {
        name: 'Development of a Novel Inhibitor of Ricin',
        showEditLinks: false,
        sections: [
            object('Details', {
                type: TfsApplicationSectionType.Details,
                title: 'Details',
                formUrl: '/?path=/story/container-components--fieldset',
                summary: 'Summary',
                displayStartDateAndDuration: true,
                projectDuration: '2 months',
                projectStartDate: 'January 2021',
            }),
            object('Applicants', {
                type: TfsApplicationSectionType.Applicants,
                title: 'Applicants',
                applicants: [
                    {
                        organisationName: 'University of Cardiff',
                        name: 'Dr Jane Doe',
                        email: 'jane.doe@cardiff.ac.uk',
                        role: 'Lead applicant',
                    },
                    {
                        organisationName: 'University of Cardiff',
                        name: 'Dr Fred Bloggs',
                        email: 'fred.bloggs@cardiff.ac.uk',
                        role: 'Researcher',
                    },
                    {
                        organisationName: 'University of Swansea',
                        name: 'Dr Alice Applicant',
                        email: 'alice.applicant@swansea.ac.uk',
                        role: 'Researcher',
                    },
                ],
            }),
            {
                type: TfsApplicationSectionType.Custom,
                title: 'Custom Question 1',
                questionsetId: '1',
                answer: 'one',
                fileMetadata: [],
                questionSubTitleLabel: 'question subtitle label',
                questionGuidanceNotesContent: 'question guidance notes content',
            },
            {
                type: TfsApplicationSectionType.Custom,
                title: 'Custom Question 2',
                questionsetId: '2',
                answer: 'two',
                fileMetadata: [],
                questionSubTitleLabel: 'question subtitle label',
                questionGuidanceNotesContent: 'question guidance notes content',
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
    return (
        <Components.TfsApplicationViewToC
            id={id}
            applicationContent={applicationContent}
            getSectionLinkId={() => 'section-id'}
        />
    );
});

stories.add('Application View', () => {
    const id = text('Id', 'application-view');
    const alert = text('Alert', 'This is how reviewers will see your proposal.');
    const showTableOfContents = boolean('Show Table of Contents', true);
    const applicationContent: Components.TfsApplicationViewContent = {
        name: 'Development of a Novel Inhibitor of Ricin',
        showEditLinks: boolean('Show edit links', true),
        sections: [
            object('Details', {
                type: TfsApplicationSectionType.Details,
                title: 'Details',
                formUrl: '/?path=/story/container-components--fieldset',
                summary: 'Summary',
                displayStartDateAndDuration: true,
                projectDuration: '2 months',
                projectStartDate: 'January 2021',
            }),
            object('Applicants', {
                type: TfsApplicationSectionType.Applicants,
                title: 'Applicants',
                formUrl: '/?path=/story/container-components--position',

                applicants: [
                    {
                        organisationName: 'University of Cardiff',
                        name: 'Dr Jane Doe',
                        email: 'jane.doe@cardiff.ac.uk',
                        role: 'Lead applicant',
                    },
                    {
                        organisationName: 'University of Cardiff',
                        name: 'Dr Fred Bloggs',
                        email: 'fred.bloggs@cardiff.ac.uk',
                        role: 'Researcher',
                    },
                    {
                        organisationName: 'University of Swansea',
                        name: 'Dr Alice Applicant',
                        email: 'alice.applicant@swansea.ac.uk',
                        role: 'Researcher',
                    },
                ],
            }),
            object('Custom question', {
                type: TfsApplicationSectionType.Custom,
                title: 'Custom question',
                questionsetId: '1',
                answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                fileMetadata: [],
                questionSubTitleLabel: 'question sub title label',
                questionGuidanceNotesContent: 'question guidance notes content',
            }),
            object('Resources and costs', {
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
            }),
        ],
    };
    const applicationInfo = [
        { key: 'Application reference:', value: 'APP500' },
        { key: 'Applicant:', value: 'John Doe' },
        { key: 'Organisation:', value: 'University of Bristol' },
    ];
    return (
        <Components.TfsApplicationView
            applicationContent={applicationContent}
            id={id}
            alert={alert}
            showTableOfContents={showTableOfContents}
            applicationInfo={applicationInfo}
            statusText="Submitted 3:30pm 12 August 2020"
        />
    );
});

stories.add('Page Heading', () => {
    const headingText = text('Text', 'Application');
    const resourceId = text('Resource ID', 'APP001');
    const resourceName = text('Resource Name', 'My application');

    return <TfsPageHeading text={headingText} resourceId={resourceId} resourceName={resourceName} />;
});

stories.add('Application Review List', () => {
    const reviews: ApplicationReviewItemPageProps[] = [
        {
            id: 1,
            opportunity: 'OPP001: Test Opp',
            applicationName: 'Application for Review 1',
            applicationReference: 'APP001',
            url: '',
            organisation: 'URKI',
            deadline: '09/02/2022',
            daysRemaining: 0,
            isComplete: false,
            cancelledAt: '',
        },
        {
            id: 2,
            opportunity: 'OPP001: Test Opp',
            applicationName: 'Application for Review 2',
            applicationReference: 'APP002',
            url: '',
            organisation: 'URKI',
            deadline: '09/02/2022',
            daysRemaining: 0,
            isComplete: false,
            cancelledAt: '',
        },
    ];

    const paginationProps: PaginationPageProps = {
        paginationPages: {
            currentPage: 1,
            totalPages: 1,
            pagesToShow: 5,
        },
        paginationSummary: {
            startResult: 1,
            endResult: 2,
            totalResults: 2,
        },
    };

    return <TfsApplicationReviewList items={reviews} pageInfo={paginationProps} />;
});

stories.add('Cost policy report with totals and tables', () => {
    const costPolicy = {
        awardTotal: 2621.06,
        totalAuthorisedFec: 3024.3,
        contributionFromApplyingOrganisation: 403.24,
        costPolicyItems: [
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
        ],
    };

    return <TfsCostPolicyReport costPolicy={costPolicy} />;
});

stories.add('Project partners table', () => {
    const projectPartners = [
        {
            organisationName: 'Third Organisation',
            country: 'United Kingdom',
            directContributionPence: 5000000,
            inKindContributionPence: 6000000,
            nameOfContact: 'Contact 3',
        },
        {
            organisationName: 'First Organisation',
            country: 'United Kingdom',
            directContributionPence: 1000000,
            inKindContributionPence: 2000000,
            nameOfContact: 'Contact 1',
        },
        {
            organisationName: 'Second Organisation',
            country: 'United Kingdom',
            directContributionPence: 3000000,
            inKindContributionPence: 4000000,
            nameOfContact: 'Contact 2',
        },
    ] as TfsProjectPartner[];

    return <TfsProjectPartnersTable projectPartners={projectPartners} editMode={true} />;
});
