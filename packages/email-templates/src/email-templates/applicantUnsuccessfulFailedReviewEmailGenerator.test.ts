import { describe, expect, it } from '@jest/globals';
import { ApplicantUnsuccessfulFailedReviewEmailGenerator } from './applicantUnsuccessfulFailedReviewEmailGenerator';
import { ApplicationEmailDataWithReviewLinkAndApplicant, EmailConfigType } from './data';

const applicantUnsuccessfulApplicationEmailData: ApplicationEmailDataWithReviewLinkAndApplicant = {
    recipient: { firstName: 'John', lastName: 'Doe' },
    userType: 'Applicant',
    application: {
        applicationRef: 'APP001',
        applicationName: 'Super cool application',
        opportunityRef: 'OPP001',
        opportunityName: 'Super cool opportunity',
    },
    reviewLink: 'some-url',
};

const emailConfig: EmailConfigType = {
    sourceEmail: 'test@example.com',
    sourceDisplayName: 'Test User',
    applicationManagerUrl: 'testurl',
};

const applicantUnsuccessfulFailedReviewEmailGenerator: ApplicantUnsuccessfulFailedReviewEmailGenerator =
    new ApplicantUnsuccessfulFailedReviewEmailGenerator();

describe('ApplicantUnsuccessfulFailedReviewEmailGenerator', () => {
    it('should generate a generic Email object', () => {
        const toAddresses = ['j@fakeemail.com'];

        const email = applicantUnsuccessfulFailedReviewEmailGenerator.generateEmail(
            toAddresses,
            applicantUnsuccessfulApplicationEmailData,
            emailConfig,
        );

        expect(email.html).toContain('Dear John Doe');
        expect(email.text).toContain('Dear John Doe');
        expect(email.text).toContain('testurl/applications/APP001?tab=reviewsTab');
        expect(email.subject).toContain('UKRI Funding Service - Your application for funding was unsuccessful');
        expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
        expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
        expect(email.toAddresses).toEqual(toAddresses);
    });

    describe('Emailing the applicant', () => {
        it('should work for html', () => {
            const emailContent = applicantUnsuccessfulFailedReviewEmailGenerator.generateHtml(
                applicantUnsuccessfulApplicationEmailData,
            );

            expect(emailContent).toContain('Your application for funding was unsuccessful');
            expect(emailContent).toContain('Dear John Doe,');
            expect(emailContent).toContain(
                'Unfortunately your application will not progress further than expert review.',
            );

            expect(emailContent).toContain(
                'Your reviews are now available to read by signing in to The Funding Service at <a href=some-url>some-url</a>',
            );

            expect(emailContent).toContain(
                'We look at all reviews and scores thoroughly during the application process. We will not be able to provide any further feedback on your application.',
            );
            expect(emailContent).toContain('Application');
            expect(emailContent).toContain('APP001: Super cool application');
            expect(emailContent).toContain('Opportunity');
            expect(emailContent).toContain('OPP001: Super cool opportunity');
            expect(emailContent).toContain(
                'Thank you for taking the time to submit an application for this Opportunity.',
            );
            expect(emailContent).toContain(
                'We would appreciate your feedback on your experience so we can improve the Funding Service. Please fill out <a href="https://forms.office.com/e/KhmVCx49cz">anonymous survey (link)</a>',
            );
            expect(emailContent).toContain('Kind regards,');
            expect(emailContent).toContain('The UKRI Funding Service');
            expect(emailContent).toContain('Email: support@funding-service.ukri.org');
            expect(emailContent).toContain('Telephone: +44 (0)1793 547 490');
            expect(emailContent).toContain('This is an automated message – do not reply.');
        });

        it('should work for text only', () => {
            const emailContent = applicantUnsuccessfulFailedReviewEmailGenerator.generateText(
                applicantUnsuccessfulApplicationEmailData,
            );

            expect(emailContent).toContain('Dear John Doe,');

            expect(emailContent).toContain(
                'Unfortunately your application will not progress further than expert review.',
            );

            expect(emailContent).toContain(
                'Your reviews are now available to read by signing in to The Funding Service at some-url',
            );

            expect(emailContent).toContain(
                'We look at all reviews and scores thoroughly during the application process. We will not be able to provide any further feedback on your application.',
            );

            expect(emailContent).toContain('Application');
            expect(emailContent).toContain('APP001: Super cool application');
            expect(emailContent).toContain('Opportunity');
            expect(emailContent).toContain('OPP001: Super cool opportunity');
            expect(emailContent).toContain(
                'Thank you for taking the time to submit an application for this Opportunity.',
            );
            expect(emailContent).toContain(
                'We would appreciate your feedback on your experience so we can improve the Funding Service. Please fill out anonymous survey (https://forms.office.com/e/KhmVCx49cz)',
            );
            expect(emailContent).toContain('Kind regards,');
            expect(emailContent).toContain('The UKRI Funding Service');
            expect(emailContent).toContain('Email: support@funding-service.ukri.org');
            expect(emailContent).toContain('Telephone: +44 (0)1793 547 490');
            expect(emailContent).toContain('This is an automated message – do not reply.');
        });
    });

    describe('Emailing the research office', () => {
        it('should work for html', () => {
            const emailContent = applicantUnsuccessfulFailedReviewEmailGenerator.generateHtml({
                ...applicantUnsuccessfulApplicationEmailData,
                userType: 'ResearchOfficer',
                leadApplicant: {
                    firstName: 'Davey',
                    lastName: 'McDaveson',
                },
            });

            expect(emailContent).toContain('Your application for funding was unsuccessful');
            expect(emailContent).toContain('Dear John Doe,');
            expect(emailContent).toContain(
                'Unfortunately your application will not progress further than expert review.',
            );

            expect(emailContent).toContain(
                'Your reviews are now available to read by signing in to The Funding Service at <a href=some-url>some-url</a>',
            );

            expect(emailContent).toContain(
                'We look at all reviews and scores thoroughly during the application process. We will not be able to provide any further feedback on your application.',
            );
            expect(emailContent).toContain('Applicant');
            expect(emailContent).toContain('Davey McDaveson');
            expect(emailContent).toContain('Application');
            expect(emailContent).toContain('APP001: Super cool application');
            expect(emailContent).toContain('Opportunity');
            expect(emailContent).toContain('OPP001: Super cool opportunity');
            expect(emailContent).toContain(
                'Thank you for taking the time to submit an application for this Opportunity.',
            );
            expect(emailContent).toContain('Kind regards,');
            expect(emailContent).toContain('The UKRI Funding Service');
            expect(emailContent).toContain('Email: support@funding-service.ukri.org');
            expect(emailContent).toContain('Telephone: +44 (0)1793 547 490');
            expect(emailContent).toContain('This is an automated message – do not reply.');
        });

        it('should work for text only', () => {
            const emailContent = applicantUnsuccessfulFailedReviewEmailGenerator.generateText({
                ...applicantUnsuccessfulApplicationEmailData,
                userType: 'ResearchOfficer',
                leadApplicant: {
                    firstName: 'Davey',
                    lastName: 'McDaveson',
                },
            });

            expect(emailContent).toContain('Dear John Doe,');

            expect(emailContent).toContain(
                'Unfortunately your application will not progress further than expert review.',
            );

            expect(emailContent).toContain(
                'Your reviews are now available to read by signing in to The Funding Service at some-url',
            );

            expect(emailContent).toContain(
                'We look at all reviews and scores thoroughly during the application process. We will not be able to provide any further feedback on your application.',
            );

            expect(emailContent).toContain('Applicant');
            expect(emailContent).toContain('Davey McDaveson');
            expect(emailContent).toContain('Application');
            expect(emailContent).toContain('APP001: Super cool application');
            expect(emailContent).toContain('Opportunity');
            expect(emailContent).toContain('OPP001: Super cool opportunity');
            expect(emailContent).toContain(
                'Thank you for taking the time to submit an application for this Opportunity.',
            );
            expect(emailContent).toContain('Kind regards,');
            expect(emailContent).toContain('The UKRI Funding Service');
            expect(emailContent).toContain('Email: support@funding-service.ukri.org');
            expect(emailContent).toContain('Telephone: +44 (0)1793 547 490');
            expect(emailContent).toContain('This is an automated message – do not reply.');
        });
    });
});
