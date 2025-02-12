import {
    baseEmailText,
    generateEmailH2Header,
    generateEmailHeader,
    generateEmailParagraph,
    generateTemplatedEmail,
} from '../components';
import { Email } from '../email';
import { ApplicationEmailData, EmailConfigType, EmailGenerator } from './data';

export class ApplicantSuccessfulApplicationEmailGenerator extends EmailGenerator<ApplicationEmailData> {
    private subject = 'Funding decision - UKRI';
    private fundingFinderlink = 'https://www.ukri.org/opportunity';

    generateEmail(
        toAddresses: string[],
        emailData: ApplicationEmailData,
        { sourceEmail, sourceDisplayName }: EmailConfigType,
    ): Email {
        return {
            html: this.generateHtml(emailData),
            text: this.generateText(emailData),
            subject: this.subject,
            toAddresses,
            sourceEmail: sourceEmail,
            sourceDisplayName: sourceDisplayName,
        };
    }
    generateHtml(emailData: ApplicationEmailData): string {
        return generateTemplatedEmail(
            this.subject,
            `
            </br>
            ${generateEmailHeader(emailText.getApplicationSuccessfulHeading)}
            ${generateEmailParagraph(`Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},`)}

            ${generateEmailParagraph(emailText.getBodyParagraph1)}

            ${generateEmailH2Header('Application')}
            ${generateEmailParagraph(emailText.getApplicationParagraph(emailData.application))}

            ${generateEmailH2Header('Opportunity')}
            ${generateEmailParagraph(emailText.getOpportunityParagraph(emailData.application))}

            ${generateEmailH2Header('What happens next')}

            ${generateEmailParagraph(emailText.getBodyParagraph2)}

            ${generateEmailParagraph(emailText.getBodyParagraph3)}

            ${generateEmailParagraph(emailText.getBodyParagraph4(this.fundingFinderlink, true))}

            ${generateEmailParagraph(emailText.getFeedbackParagraph)}

            ${generateEmailParagraph(emailText.signOff + ',', 'noMargin')}
            ${generateEmailParagraph(emailText.fundingService, 'noMargin')}
            ${generateEmailParagraph(emailText.email, 'noMargin')}
            ${generateEmailParagraph(emailText.telephone)}

            ${generateEmailParagraph(emailText.automatedMessage)}`,
        );
    }

    generateText(emailData: ApplicationEmailData): string {
        return `${emailText.getApplicationSuccessfulHeading}
        Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},

        ${emailText.getBodyParagraph1}

        Application
        ${emailText.getApplicationParagraph(emailData.application)}

        Opportunity
        ${emailText.getOpportunityParagraph(emailData.application)}

        What happens next

        ${emailText.getBodyParagraph2}

        ${emailText.getBodyParagraph3}

        ${emailText.getBodyParagraph4(this.fundingFinderlink, false)}
        
        ${emailText.getFeedbackParagraph}

        ${emailText.signOff},
        ${emailText.fundingService}
        ${emailText.email}
        ${emailText.telephone}

        ${emailText.automatedMessage}`;
    }
}
const emailText = {
    ...baseEmailText,
    getBodyParagraph1: 'We are pleased to inform you that your application has been successful.',
    getBodyParagraph2:
        'If there are no more stages to the application process, your research office (RO) will be sent a grant agreement. This must be agreed to before we can proceed further.',
    getBodyParagraph3:
        'If there are further stages to the application process, you will be contacted shortly with further details.',
    getBodyParagraph4: (fundingFinderlink: string, hasHtml: boolean) =>
        `Check the ${
            hasHtml
                ? `<a href="${fundingFinderlink}">funding finder for more information about the application process for this opportunity</a>`
                : `funding finder for more information about the application process for this opportunity (${fundingFinderlink})`
        }.`,
    getApplicationSuccessfulHeading: 'Your application has been successful',
    getApplicationParagraph: ({
        applicationName,
        applicationRef,
    }: {
        applicationName: string;
        applicationRef: string;
    }) => `${applicationRef}: ${applicationName}`,
    getOpportunityParagraph: ({
        opportunityName,
        opportunityRef,
    }: {
        opportunityName: string;
        opportunityRef: string;
    }) => `${opportunityRef}: ${opportunityName}`,
    getFeedbackParagraph:
        'We would appreciate your feedback on your experience so we can improve the Funding Service. Please fill out <a href="https://forms.office.com/e/KhmVCx49cz">anonymous survey (link)</a>',
};
