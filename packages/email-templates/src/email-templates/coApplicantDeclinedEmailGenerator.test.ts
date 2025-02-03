import { beforeEach, describe, expect, it } from '@jest/globals';
import { CoApplicantDeclinedEmailGenerator } from './coApplicantDeclinedEmailGenerator';
import { CoApplicantEmailData, EmailConfigType } from './data';

const emailConfig: EmailConfigType = {
    sourceEmail: 'test@example.com',
    sourceDisplayName: 'Test User',
    applicationManagerUrl: '',
};
describe('Co-Applicant Declined email generator', () => {
    let generator: CoApplicantDeclinedEmailGenerator;
    let emailData: CoApplicantEmailData;

    beforeEach(() => {
        generator = new CoApplicantDeclinedEmailGenerator();
        emailData = {
            coApplicant: {
                firstName: 'John',
                lastName: 'Doe',
                role: 'role',
            },
            recipient: {
                firstName: 'Jane',
                lastName: 'Doe',
            },
            application: {
                applicationRef: 'APP001',
                applicationName: 'Super cool application',
                opportunityRef: 'OPP001',
                opportunityName: 'Super cool opportunity',
            },
        };
    });

    it('should generate email with the correct html', () => {
        const email = generator.generateHtml(emailData);

        expect(email).toContain(
            `${emailData.coApplicant.firstName} ${emailData.coApplicant.lastName} has removed themselves from your application team.`,
        );
        expect(email).toContain(emailData.recipient.firstName);
        expect(email).toContain(emailData.recipient.lastName);

        expect(email).toContain('Application');
        expect(email).toContain(emailData.application.opportunityName);
        expect(email).toContain('Opportunity');
        expect(email).toContain(emailData.application.applicationName);
        expect(email).toContain('Their role');
        expect(email).toContain(emailData.coApplicant.role);

        expect(email).toContain('Yours sincerely,');
        expect(email).toContain('The UKRI Funding Service');
        expect(email).toContain('Email: support@funding-service.ukri.org');
        expect(email).toContain('Telephone: +44 (0)1793 547 490');
        expect(email).toContain('This is an automated message – do not reply.');
    });

    it('should generate email with the correct text', () => {
        const email = generator.generateText(emailData);

        expect(email).toContain(
            `${emailData.coApplicant.firstName} ${emailData.coApplicant.lastName} has removed themselves from your application team.`,
        );
        expect(email).toContain(emailData.recipient.firstName);
        expect(email).toContain(emailData.recipient.lastName);

        expect(email).toContain('Application');
        expect(email).toContain(emailData.application.opportunityName);
        expect(email).toContain('Opportunity');
        expect(email).toContain(emailData.application.applicationName);
        expect(email).toContain('Their role');
        expect(email).toContain(emailData.coApplicant.role);

        expect(email).toContain('Yours sincerely,');
        expect(email).toContain('The UKRI Funding Service');
        expect(email).toContain('Email: support@funding-service.ukri.org');
        expect(email).toContain('Telephone: +44 (0)1793 547 490');
        expect(email).toContain('This is an automated message – do not reply.');
    });

    it('should generate the email object correctly', () => {
        const toAddresses = ['a', 'v'];
        const email = generator.generateEmail(toAddresses, emailData, emailConfig);

        expect(email.html).toContain('Dear Jane Doe');
        expect(email.text).toContain('Dear Jane Doe');
        expect(email.subject).toContain('Funding decision - UKRI');
        expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
        expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
        expect(email.toAddresses).toEqual(toAddresses);
    });
});
