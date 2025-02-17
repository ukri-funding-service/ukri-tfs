import { describe, expect, it } from '@jest/globals';
import { ApplicationEmailData, EmailConfigType } from './data';
import { ResearchOrganisationUnsuccessfulApplicationEmailGenerator } from './researchOrganisationUnsuccessfulApplicationEmailGenerator';

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

const applicantUnsuccessfulApplicationEmailDataGenerator: ResearchOrganisationUnsuccessfulApplicationEmailGenerator =
    new ResearchOrganisationUnsuccessfulApplicationEmailGenerator();

describe('ResearchOrganisationUnsuccessfulApplicationEmailGenerator', () => {
    it('should work for html', () => {
        const emailContent = applicantUnsuccessfulApplicationEmailDataGenerator.generateHtml(
            applicantUnsuccessfulApplicationEmailData,
        );

        expect(emailContent).toContain('An application for funding from your organisation has not been successful');
        expect(emailContent).toContain('Dear John Doe,');
        expect(emailContent).toContain(
            'We regret to inform you that an application for funding from your organisation has not been successful.',
        );
        expect(emailContent).toContain('Application');
        expect(emailContent).toContain('APP001: Super cool application');
        expect(emailContent).toContain('Opportunity');
        expect(emailContent).toContain('OPP001: Super cool opportunity');
        expect(emailContent).toContain('What happens next');
        expect(emailContent).toContain('You do not need to do anything else.');
        expect(emailContent).toContain('Thank you for taking the time to submit an application for this Opportunity.');
        expect(emailContent).toContain(
            'We would appreciate your feedback on your experience so we can improve the Funding Service. Please fill out <a href="https://forms.office.com/e/KhmVCx49cz">anonymous survey (link)</a>',
        );
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

        expect(emailContent).toContain('An application for funding from your organisation has not been successful');
        expect(emailContent).toContain('Dear John Doe,');
        expect(emailContent).toContain(
            'We regret to inform you that an application for funding from your organisation has not been successful.',
        );
        expect(emailContent).toContain('Application');
        expect(emailContent).toContain('APP001: Super cool application');
        expect(emailContent).toContain('Opportunity');
        expect(emailContent).toContain('OPP001: Super cool opportunity');
        expect(emailContent).toContain('What happens next');
        expect(emailContent).toContain('You do not need to do anything else.');
        expect(emailContent).toContain('Thank you for taking the time to submit an application for this Opportunity.');
        expect(emailContent).toContain(
            'We would appreciate your feedback on your experience so we can improve the Funding Service. Please fill out anonymous survey (https://forms.office.com/e/KhmVCx49cz)',
        );
        expect(emailContent).toContain('Yours sincerely,');
        expect(emailContent).toContain('The UKRI Funding Service');
        expect(emailContent).toContain('Email: support@funding-service.ukri.org');
        expect(emailContent).toContain('Telephone: +44 (0)1793 547 490');
        expect(emailContent).toContain('This is an automated message – do not reply.');
    });

    it('should generate a generic Email object', () => {
        const toAddresses = ['a', 'f'];
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
