import {
    generateEmailHeader,
    generateEmailLinkButton,
    generateEmailParagraph,
    generateEmailSignOffHtml,
    generateEmailSignOffText,
    generateTemplatedEmail,
} from '../components';
import { Email } from '../email';
import {
    ApplicationSubmittedEmailData,
    ApplicationSubmittedEmailGeneratorData,
    EmailConfigType,
    EmailGenerator,
} from './data';

export class ApplicationSubmittedEmailGenerator extends EmailGenerator<ApplicationSubmittedEmailData> {
    private getSubjectText = 'UKRI Funding Service submission confirmation';
    private titleText = 'Your application has been received';

    generateEmail(
        toAddresses: string[],
        emailData: ApplicationSubmittedEmailData,
        { sourceEmail, sourceDisplayName, applicationManagerUrl }: EmailConfigType,
    ): Email {
        const applicationLink = `${applicationManagerUrl}/applications/${emailData.application.applicationRef}`;
        return {
            html: this.generateHtml({ ...emailData, applicationLink }),
            text: this.generateText({ ...emailData, applicationLink }),
            subject: this.getSubjectText,
            toAddresses,
            sourceEmail: sourceEmail,
            sourceDisplayName: sourceDisplayName,
        };
    }
    generateHtml(emailData: ApplicationSubmittedEmailGeneratorData): string {
        return generateTemplatedEmail(
            this.titleText,
            `
${generateEmailHeader(this.titleText)}
${generateEmailParagraph(`Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},`)}
${generateEmailParagraph(
    `This is to confirm that ${emailData.application.applicationRef}: ${emailData.application.applicationName} was successfully submitted to us on ${emailData.submissionTime} by ${emailData.submitter.firstName} ${emailData.submitter.lastName}. Provided it meets the required eligibility criteria, it will go forward for assessment.`,
)}
${generateEmailParagraph(
    `You can read the application in full, by signing into your UKRI Funding Service account at any time. Full details about this Opportunity, including 'What happens next' can be found in the <a href="https://www.ukri.org/opportunity/develop-programme-ideas-with-the-bbc-new-generation-thinkers/">guidance on the Opportunity webpage</a>.`,
)}
${generateEmailParagraph(
    `If you can spare a few moments, we would welcome you selecting the 'Take survey' button to give feedback.`,
)}
${generateEmailLinkButton(emailData.applicationLink, `View application`, true)}
${generateEmailLinkButton('https://forms.office.com/e/cCd0b1SveT', `Take Survey`, true, 'leftMargin')}
${generateEmailParagraph(`If the 'View application' button does not work, use the link below or copy and paste it into your
browser's address bar.`)}
${generateEmailParagraph(`<a href="${emailData.applicationLink}">${emailData.applicationLink}</a>`)}
${generateEmailParagraph(
    `If the ‘Take survey' button does not work, use the link below or copy and paste it into your browser's address bar.`,
)}
${generateEmailParagraph(`<a href="https://forms.office.com/e/cCd0b1SveT">https://forms.office.com/e/cCd0b1SveT</a>`)}
${generateEmailSignOffHtml()}`,
        );
    }

    generateText(emailData: ApplicationSubmittedEmailGeneratorData): string {
        return `
${this.titleText}

Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},

This is to confirm that ${emailData.application.applicationRef}: ${
            emailData.application.applicationName
        } was successfully submitted to us on ${emailData.submissionTime} by ${emailData.submitter.firstName} ${
            emailData.submitter.lastName
        }. Provided it meets the required eligibility criteria, it will go forward for assessment.

You can read the application in full, by signing into your UKRI Funding Service account at any time. Full details about this Opportunity, including 'What happens next' can be found in the guidance on the Opportunity webpage.

If you can spare a few moments, we would welcome you selecting the 'Take survey' button to give feedback.

If the 'View application' button does not work, use the link below or copy and paste it into your browser's address bar.
${emailData.applicationLink}

If the Take survey' button does not work, use the link below or copy and paste it into your browser's address bar.
https://forms.office.com/e/cCd0b1SveT

${generateEmailSignOffText()}`;
    }
}
