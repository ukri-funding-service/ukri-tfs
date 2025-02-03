import { describe, expect, it } from '@jest/globals';
import { ApplicantUnsuccessfulChecksEmailGeneratorData, EmailConfigType } from './data';
import { ApplicantUnsuccessfulChecksApplicationEmailGenerator } from './applicantUnsuccessfulChecksApplicationEmailGenerator';

const emailData: ApplicantUnsuccessfulChecksEmailGeneratorData = {
    recipient: { firstName: 'John', lastName: 'Doe' },
    application: {
        applicationRef: 'APP001',
        applicationName: 'Super cool application',
        opportunityRef: 'OPP001',
        opportunityName: 'Super cool opportunity',
    },
    userType: 'Applicant',
    applicationLink: 'some-application-link',
    leadApplicant: { firstName: 'lead-applicant-firstname', lastName: 'lead-applicant-lastname' },
};

const emailConfig: EmailConfigType = {
    sourceEmail: 'test@example.com',
    sourceDisplayName: 'Test User',
    applicationManagerUrl: '',
};

const applicantUnsuccessfulChecksApplicationEmailDataGenerator: ApplicantUnsuccessfulChecksApplicationEmailGenerator =
    new ApplicantUnsuccessfulChecksApplicationEmailGenerator();

jest.mock('../components', () => ({
    generateEmailHeader: (param: string) => `<header>${param}</header>`,
    generateEmailH2Header: (param: string) => `<header>${param}</header>`,
    generateEmailParagraph: (param: string) => `<p>${param}</p>`,
    generateEmailSignOffHtml: () => 'mock email sign off html',
    generateEmailSignOffText: () => 'mock email sign off text',
    generateTemplatedEmail: (subjectText: string, emailHtml: string) => `${subjectText} ${emailHtml}`,
}));

describe('ApplicantUnsuccessfulChecksApplicationEmailDataGenerator', () => {
    describe('applicant', () => {
        it('should work for html', () => {
            const email = applicantUnsuccessfulChecksApplicationEmailDataGenerator.generateHtml(emailData);

            expect(email).toBe(`Your application has been unsuccessful - UKRI Funding Service 

            <header>Your application for funding has not been successful</header>
            <p>Dear John Doe,</p>

            <p>We regret to inform you that your application for funding will not be progressed to assessment. It did not pass our preliminary checks.</p>

            <p>For more feedback, <a href=some-application-link>sign in to the Funding Service</a></p>

            <header>Application</header>
            <p>APP001: Super cool application</p>
            
            
            
            
            <header>Opportunity</header>
            <p>OPP001: Super cool opportunity</p>

            <p>Thank you for taking the time to submit an application for this Opportunity.</p>

            mock email sign off html
      `);
        });

        it('should work for text only', () => {
            const email = applicantUnsuccessfulChecksApplicationEmailDataGenerator.generateText(emailData);

            expect(email).toBe(`Your application for funding has not been successful

        Dear John Doe,

        We regret to inform you that your application for funding will not be progressed to assessment. It did not pass our preliminary checks.

        For more feedback, sign in to the Funding Service
        
        Application
        APP001: Super cool application
        
        
        
        
        Opportunity
        OPP001: Super cool opportunity

        Thank you for taking the time to submit an application for this Opportunity.

        mock email sign off text
        `);
        });
    });

    describe('research officer', () => {
        it('should work for html', () => {
            const email = applicantUnsuccessfulChecksApplicationEmailDataGenerator.generateHtml({
                ...emailData,
                userType: 'ResearchOfficer',
            });

            expect(email).toBe(`Your application has been unsuccessful - UKRI Funding Service 

            <header>An application for funding from your organisation has not been successful</header>
            <p>Dear John Doe,</p>

            <p>We regret to inform you that your application for funding will not be progressed to assessment. It did not pass our preliminary checks.</p>

            <p>For more information about why it was rejected <a href=some-application-link>sign in to the Funding Service</a></p>

            <header>Application</header>
            <p>APP001: Super cool application</p>
            
            <header>Lead applicant</header>
            <p>lead-applicant-firstname lead-applicant-lastname</p>
            
            <header>Opportunity</header>
            <p>OPP001: Super cool opportunity</p>

            <p>Thank you for taking the time to submit an application for this Opportunity.</p>

            mock email sign off html
      `);
        });

        it('should work for text only', () => {
            const email = applicantUnsuccessfulChecksApplicationEmailDataGenerator.generateText({
                ...emailData,
                userType: 'ResearchOfficer',
            });

            expect(email).toBe(`An application for funding from your organisation has not been successful

        Dear John Doe,

        We regret to inform you that your application for funding will not be progressed to assessment. It did not pass our preliminary checks.

        For more information about why it was rejected sign in to the Funding Service
        
        Application
        APP001: Super cool application
        
        Lead applicant
        lead-applicant-firstname lead-applicant-lastname
        
        Opportunity
        OPP001: Super cool opportunity

        Thank you for taking the time to submit an application for this Opportunity.

        mock email sign off text
        `);
        });
    });

    it('should generate a generic Email object', () => {
        const toAddresses = ['j@fakeemail.com'];

        const email = applicantUnsuccessfulChecksApplicationEmailDataGenerator.generateEmail(
            toAddresses,
            emailData,
            emailConfig,
        );

        expect(email.html).toContain('Dear John Doe');
        expect(email.text).toContain('Dear John Doe');
        expect(email.subject).toContain('Your application has been unsuccessful - UKRI Funding Service');
        expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
        expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
        expect(email.toAddresses).toEqual(toAddresses);
    });
});
