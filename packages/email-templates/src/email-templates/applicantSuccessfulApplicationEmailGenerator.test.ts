import { describe, expect, it } from '@jest/globals';
import { ApplicantSuccessfulApplicationEmailGenerator } from './applicantSuccessfulApplicationEmailGenerator';
import { ApplicationEmailData, EmailConfigType } from './data';

describe('Applicant successful application email generator', () => {
    const generator: ApplicantSuccessfulApplicationEmailGenerator = new ApplicantSuccessfulApplicationEmailGenerator();

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

        expect(email).toContain('Your application for funding has been successful');
        expect(email).toContain(emailData.recipient.firstName);
        expect(email).toContain(emailData.recipient.lastName);
        expect(email).toContain('We are pleased to inform you that your application for funding has been successful.');
        expect(email).toContain('Application');
        expect(email).toContain(`${emailData.application.applicationRef}: ${emailData.application.applicationName}`);
        expect(email).toContain('Opportunity');
        expect(email).toContain(`${emailData.application.opportunityRef}: ${emailData.application.opportunityName}`);
        expect(email).toContain('What happens next');
        expect(email).toContain('We will create a grant agreement and send it to your research organisation.');
        expect(email).toContain(
            'Your research organisation must agree to the grant agreement before we can issue funding.',
        );
        expect(email).toContain(`You don't need to do anything until your research organisation contacts you.`);
        expect(email).toContain('Yours sincerely,');
        expect(email).toContain('The UKRI Funding Service');
        expect(email).toContain('Email: support@funding-service.ukri.org');
        expect(email).toContain('Telephone: +44 (0)1793 547 490');
        expect(email).toContain('This is an automated message – do not reply.');
    });

    it('should generate email with the correct text', () => {
        const email = generator.generateText(emailData);

        expect(email).toContain('Your application for funding has been successful');
        expect(email).toContain(emailData.recipient.firstName);
        expect(email).toContain(emailData.recipient.lastName);
        expect(email).toContain('We are pleased to inform you that your application for funding has been successful.');
        expect(email).toContain('Application');
        expect(email).toContain(`${emailData.application.applicationRef}: ${emailData.application.applicationName}`);
        expect(email).toContain('Opportunity');
        expect(email).toContain(`${emailData.application.opportunityRef}: ${emailData.application.opportunityName}`);
        expect(email).toContain('What happens next');
        expect(email).toContain('We will create a grant agreement and send it to your research organisation.');
        expect(email).toContain(
            'Your research organisation must agree to the grant agreement before we can issue funding.',
        );
        expect(email).toContain(`You don't need to do anything until your research organisation contacts you.`);
        expect(email).toContain('Yours sincerely,');
        expect(email).toContain('The UKRI Funding Service');
        expect(email).toContain('Email: support@funding-service.ukri.org');
        expect(email).toContain('Telephone: +44 (0)1793 547 490');
        expect(email).toContain('This is an automated message – do not reply.');
    });

    it('should generate a generic Email object', () => {
        const toAddresses = ['email1', 'email2'];

        const email = generator.generateEmail(toAddresses, emailData, emailConfig);

        expect(email.html).toContain('Dear John Doe');
        expect(email.text).toContain('Dear John Doe');
        expect(email.subject).toContain('Funding decision - UKRI');
        expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
        expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
        expect(email.toAddresses).toEqual(toAddresses);
    });
});
