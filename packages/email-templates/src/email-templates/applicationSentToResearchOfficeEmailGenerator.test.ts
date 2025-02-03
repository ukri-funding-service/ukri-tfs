import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as generateEmailHeaderMock from '../components/emailHeader';
import { ApplicationSentToResearchOfficeEmailGenerator } from './applicationSentToResearchOfficeEmailGenerator';
import { ApplicationSentToResearchOfficeEmailGeneratorData } from './data';

jest.mock('../components', () => ({
    generateEmailHeader: (param: string) => `<header>${param}</header>`,
    generateEmailParagraph: (param: string) => `<p>${param}</p>`,
    generateEmailSignOffHtml: () => 'mock email sign off html',
    generateEmailSignOffText: () => 'mock email sign off text',
    generateTemplatedEmail: (subjectText: string, emailHtml: string) => `${subjectText} ${emailHtml}`,
}));

describe('Application sent to research office email generator ro edit', () => {
    const generator: ApplicationSentToResearchOfficeEmailGenerator =
        new ApplicationSentToResearchOfficeEmailGenerator();
    const emailData: ApplicationSentToResearchOfficeEmailGeneratorData = {
        application: {
            applicationRef: '12345',
            applicationName: 'Test Application Name',
            opportunityRef: '543231',
            opportunityName: 'Test Opportunity Name',
        },
        applicant: { firstName: 'applicant-first-name', lastName: 'applicant-last-name' },
        recipient: { firstName: 'recipient-first-name', lastName: 'recipient-last-name' },
        opportunityCloseTime: 'Wednesday 21 February 2031, 5:30PM',
        applicationLink: 'some-application-link',
    };

    beforeEach(() => {
        jest.spyOn(generateEmailHeaderMock, 'generateEmailHeader').mockReturnValue('This is an html email header');
        jest.clearAllMocks();
    });

    it('should generate email with the correct html', () => {
        const email = generator.generateHtml(emailData);

        expect(email).toBe(`You've received an application for submission to UKRI - UKRI Funding Service 
            <header>Your research office has received an application for submission to UKRI</header>
            <p>applicant-first-name applicant-last-name has sent an application for you to submit to UKRI.</p>

            <p><strong>Application</strong></p>
            <p><a href=some-application-link>12345: Test Application Name</a></p>

            <p><strong>Opportunity</strong></p>
            <p>543231: Test Opportunity Name</p>

            <p><strong>Submission deadline</strong></p>
            <p>Wednesday 21 February 2031, 5:30PM</p>

            <p>If the application requires further editing, you can either make the changes yourself or return it to draft so that the applicant can work on it.</p>

            mock email sign off html`);
    });

    it('should generate email with the correct text', () => {
        const email = generator.generateText(emailData);
        expect(email).toBe(`
Your research office has received an application for submission to UKRI

applicant-first-name applicant-last-name has sent an application for you to submit to UKRI.

Application
12345: Test Application Name

Opportunity
543231: Test Opportunity Name

Submission deadline
Wednesday 21 February 2031, 5:30PM

If the application requires further editing, you can either make the changes yourself or return it to draft so that the applicant can work on it.

mock email sign off text`);
    });
});
