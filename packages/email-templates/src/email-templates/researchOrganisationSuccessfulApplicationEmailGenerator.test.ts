import { describe, expect, it } from '@jest/globals';
import { ApplicationEmailData, EmailConfigType } from './data';
import { ResearchOrganisationSuccessfulApplicationEmailGenerator } from './researchOrganisationSuccessfulApplicationEmailGenerator';

describe('Research Office successful application email generator', () => {
    const generator: ResearchOrganisationSuccessfulApplicationEmailGenerator =
        new ResearchOrganisationSuccessfulApplicationEmailGenerator();
    const emailData: ApplicationEmailData = {
        application: {
            applicationRef: 'APP1000',
            applicationName: 'Bird watching',
            opportunityRef: 'OP200',
            opportunityName: 'Finding new species',
        },
        recipient: { firstName: 'John', lastName: 'Doe' },
    };
    const emailConfig: EmailConfigType = {
        sourceEmail: 'test@example.com',
        sourceDisplayName: 'Test User',
        applicationManagerUrl: '',
    };

    it('should generate email with the correct html', () => {
        const email = generator.generateHtml(emailData);

        expect(email).toContain('An application for funding from your organisation has been successful');
        expect(email).toContain(emailData.recipient.firstName);
        expect(email).toContain(emailData.recipient.lastName);
        expect(email).toContain(
            'We are pleased to inform you that an application for funding from your organisation has been successful.',
        );
        expect(email).toContain('If you were not involved in submitting this application, you can ignore this email.');
        expect(email).toContain('Application');
        expect(email).toContain(`${emailData.application.applicationRef}: ${emailData.application.applicationName}`);
        expect(email).toContain('Opportunity');
        expect(email).toContain(`${emailData.application.opportunityRef}: ${emailData.application.opportunityName}`);
        expect(email).toContain('What happens next');
        expect(email).toContain('We will create a grant agreement and send it to you.');
        expect(email).toContain('You must agree to the grant agreement before we can issue funding.');
        expect(email).toContain('Yours sincerely,');
        expect(email).toContain('The UKRI Funding Service');
        expect(email).toContain('Email: support@funding-service.ukri.org');
        expect(email).toContain('Telephone: +44 (0)1793 547 490');
        expect(email).toContain('This is an automated message – do not reply.');
    });

    it('should generate email with the correct text', () => {
        const email = generator.generateText(emailData);

        expect(email).toContain('An application for funding from your organisation has been successful');
        expect(email).toContain(emailData.recipient.firstName);
        expect(email).toContain(emailData.recipient.lastName);
        expect(email).toContain(
            'We are pleased to inform you that an application for funding from your organisation has been successful.',
        );
        expect(email).toContain('If you were not involved in submitting this application, you can ignore this email.');
        expect(email).toContain('Application');
        expect(email).toContain(`${emailData.application.applicationRef}: ${emailData.application.applicationName}`);
        expect(email).toContain('Opportunity');
        expect(email).toContain(`${emailData.application.opportunityRef}: ${emailData.application.opportunityName}`);
        expect(email).toContain('What happens next');
        expect(email).toContain('We will create a grant agreement and send it to you.');
        expect(email).toContain('You must agree to the grant agreement before we can issue funding.');
        expect(email).toContain('Yours sincerely,');
        expect(email).toContain('The UKRI Funding Service');
        expect(email).toContain('Email: support@funding-service.ukri.org');
        expect(email).toContain('Telephone: +44 (0)1793 547 490');
        expect(email).toContain('This is an automated message – do not reply.');
    });

    it('should generate a generic Email object', () => {
        const toAddresses = ['a', 'rm', 'fdf'];
        const email = generator.generateEmail(toAddresses, emailData, emailConfig);

        expect(email.html).toContain('Dear John Doe');
        expect(email.text).toContain('Dear John Doe');
        expect(email.subject).toContain('Funding decision - UKRI');
        expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
        expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
        expect(email.toAddresses).toEqual(toAddresses);
    });
});
