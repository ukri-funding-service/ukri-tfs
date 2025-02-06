import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as generateEmailHeaderMock from '../components/emailHeader';
import { ApplicationSubmittedEmailGenerator } from './applicationSubmittedEmailGenerator';
import { ApplicationSubmittedEmailData, EmailConfigType } from './data';

jest.mock('../components', () => ({
    generateEmailHeader: (param: string) => `<h1>${param}</h1>`,
    generateEmailLinkButton: (param: string) => `<a>${param}</a>`,
    generateEmailParagraph: (param: string) => `<p>${param}</p>`,
    generateEmailSignOffHtml: () => 'mock email sign off html',
    generateEmailSignOffText: () => 'mock email sign off text',
    generateTemplatedEmail: (subjectText: string, emailHtml: string) => `${subjectText} ${emailHtml}`,
}));

describe('Group reassigned application email generator', () => {
    const generator: ApplicationSubmittedEmailGenerator = new ApplicationSubmittedEmailGenerator();
    const toAddresses = ['test@address.one'];
    const emailConfigType: EmailConfigType = {
        sourceEmail: 'source@email.one',
        sourceDisplayName: 'Source Display Name',
        applicationManagerUrl: 'some-application-manager-url',
    };
    const emailData: ApplicationSubmittedEmailData = {
        application: {
            applicationRef: '12345',
            applicationName: 'Test Application Name',
            opportunityRef: '543231',
            opportunityName: 'Test Opportunity Name',
        },
        submitter: { firstName: 'submitter-first-name', lastName: 'submitter-last-name' },
        recipient: { firstName: 'recipient-first-name', lastName: 'recipient-last-name' },
        submissionTime: 'some-submitted-time',
    };

    beforeEach(() => {
        jest.spyOn(generateEmailHeaderMock, 'generateEmailHeader').mockReturnValue('This is an html email header');
        jest.clearAllMocks();
    });

    it('should generate email with the correct html', () => {
        const email = generator.generateHtml({ ...emailData, ...{ applicationLink: 'some-application-link' } });

        expect(email).toBe(`Your application has been received 
<h1>Your application has been received</h1>
<p>Dear recipient-first-name recipient-last-name,</p>
<p>This is to confirm that 12345: Test Application Name was successfully submitted to us on some-submitted-time by submitter-first-name submitter-last-name. Provided it meets the required eligibility criteria, it will go forward for assessment.</p>
<p>You can read the application in full, by signing into your UKRI Funding Service account at any time. Full details about this Opportunity, including 'What happens next' can be found in the <a href="https://www.ukri.org/opportunity/develop-programme-ideas-with-the-bbc-new-generation-thinkers/">guidance on the Opportunity webpage</a>.</p>
<p>If you can spare a few moments, we would welcome you selecting the 'Take survey' button to give feedback.</p>
<a>some-application-link</a>
<a>https://forms.office.com/e/cCd0b1SveT</a>
<p>If the 'View application' button does not work, use the link below or copy and paste it into your
browser's address bar.</p>
<p><a href="some-application-link">some-application-link</a></p>
<p>If the ‘Take survey' button does not work, use the link below or copy and paste it into your browser's address bar.</p>
<p><a href="https://forms.office.com/e/cCd0b1SveT">https://forms.office.com/e/cCd0b1SveT</a></p>
mock email sign off html`);
    });

    it('should generate email with the correct text', () => {
        const email = generator.generateText({ ...emailData, ...{ applicationLink: 'some-application-link' } });

        expect(email).toBe(`
Your application has been received

Dear recipient-first-name recipient-last-name,

This is to confirm that 12345: Test Application Name was successfully submitted to us on some-submitted-time by submitter-first-name submitter-last-name. Provided it meets the required eligibility criteria, it will go forward for assessment.

You can read the application in full, by signing into your UKRI Funding Service account at any time. Full details about this Opportunity, including 'What happens next' can be found in the guidance on the Opportunity webpage.

If you can spare a few moments, we would welcome you selecting the 'Take survey' button to give feedback.

If the 'View application' button does not work, use the link below or copy and paste it into your browser's address bar.
some-application-link

If the Take survey' button does not work, use the link below or copy and paste it into your browser's address bar.
https://forms.office.com/e/cCd0b1SveT

mock email sign off text`);
    });

    it('should construct correct applicationLink', () => {
        const mockGenerateHtml = jest.spyOn(generator, 'generateHtml');
        const mockGenerateText = jest.spyOn(generator, 'generateText');

        const expectedEmailData = {
            ...emailData,
            ...{ applicationLink: 'some-application-manager-url/applications/12345' },
        };

        generator.generateEmail(toAddresses, emailData, emailConfigType);

        expect(mockGenerateHtml).toHaveBeenCalledWith(expectedEmailData);
        expect(mockGenerateText).toHaveBeenCalledWith(expectedEmailData);
    });
});
