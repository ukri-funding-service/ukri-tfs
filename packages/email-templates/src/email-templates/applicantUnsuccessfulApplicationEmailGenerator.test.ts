import { describe, expect, it } from '@jest/globals';
import { ApplicantUnsuccessfulApplicationEmailGenerator } from './applicantUnsuccessfulApplicationEmailGenerator';
import { ApplicationEmailData, EmailConfigType } from './data';

const applicantUnsuccessfulApplicationEmailData: ApplicationEmailData = {
    recipient: { firstName: 'John', lastName: 'Doe' },
    application: {
        applicationRef: 'APP001',
        applicationName: 'Super cool application',
        opportunityRef: 'OPP001',
        opportunityName: 'Super cool opportunity',
    },
};

const emailConfig: EmailConfigType = {
    sourceEmail: 'test@example.com',
    sourceDisplayName: 'Test User',
    applicationManagerUrl: '',
};

const applicantUnsuccessfulApplicationEmailDataGenerator: ApplicantUnsuccessfulApplicationEmailGenerator =
    new ApplicantUnsuccessfulApplicationEmailGenerator();

describe('ApplicantUnsuccessfulApplicationEmailDataGenerator', () => {
    it('should work for html', () => {
        const emailContent = applicantUnsuccessfulApplicationEmailDataGenerator.generateHtml(
            applicantUnsuccessfulApplicationEmailData,
        );

        expect(emailContent).toContain('Your application for funding has not been successful');
        expect(emailContent).toContain('Dear John Doe,');
        expect(emailContent).toContain(
            'We regret to inform you that your application for funding has not been successful.',
        );
        expect(emailContent).toContain('Application');
        expect(emailContent).toContain('APP001: Super cool application');
        expect(emailContent).toContain('Opportunity');
        expect(emailContent).toContain('OPP001: Super cool opportunity');
        expect(emailContent).toContain('What happens next');
        expect(emailContent).toContain('You do not need to do anything else.');
        expect(emailContent).toContain('We have let your research organisation know about this decision.');
        expect(emailContent).toContain('Thank you for taking the time to submit an application for this Opportunity.');
        expect(emailContent).toContain('Yours sincerely,');
        expect(emailContent).toContain('The UKRI Funding Service');
        expect(emailContent).toContain('Email: support@funding-service.ukri.org');
        expect(emailContent).toContain('Telephone: +44 (0)1793 547 490');
        expect(emailContent).toContain('This is an automated message – do not reply.');
    });

    it('should work for text only', () => {
        const emailContent = applicantUnsuccessfulApplicationEmailDataGenerator.generateText(
            applicantUnsuccessfulApplicationEmailData,
        );

        expect(emailContent).toContain('Your application for funding has not been successful');
        expect(emailContent).toContain('Dear John Doe,');
        expect(emailContent).toContain(
            'We regret to inform you that your application for funding has not been successful.',
        );
        expect(emailContent).toContain('Application');
        expect(emailContent).toContain('APP001: Super cool application');
        expect(emailContent).toContain('Opportunity');
        expect(emailContent).toContain('OPP001: Super cool opportunity');
        expect(emailContent).toContain('What happens next');
        expect(emailContent).toContain('You do not need to do anything else.');
        expect(emailContent).toContain('We have let your research organisation know about this decision.');
        expect(emailContent).toContain('Thank you for taking the time to submit an application for this Opportunity.');
        expect(emailContent).toContain('Yours sincerely,');
        expect(emailContent).toContain('The UKRI Funding Service');
        expect(emailContent).toContain('Email: support@funding-service.ukri.org');
        expect(emailContent).toContain('Telephone: +44 (0)1793 547 490');
        expect(emailContent).toContain('This is an automated message – do not reply.');
    });

    it('should generate a generic Email object', () => {
        const toAddresses = ['j@fakeemail.com'];

        const email = applicantUnsuccessfulApplicationEmailDataGenerator.generateEmail(
            toAddresses,
            applicantUnsuccessfulApplicationEmailData,
            emailConfig,
        );

        expect(email.html).toContain('Dear John Doe');
        expect(email.text).toContain('Dear John Doe');
        expect(email.subject).toContain('Funding decision - UKRI');
        expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
        expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
        expect(email.toAddresses).toEqual(toAddresses);
    });
});
