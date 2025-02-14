import {
    baseEmailText,
    generateEmailH2Header,
    generateEmailHeader,
    generateEmailParagraph,
    generateTemplatedEmail,
} from '../components';
import { Email } from '../email';
import { ApplicationEmailData, EmailConfigType, EmailGenerator } from './data';

export class ApplicantWithoutResearchOfficeSuccessfulApplicationEmailGenerator extends EmailGenerator<ApplicationEmailData> {
    private subject = 'Funding decision - UKRI';

    generateHtml(emailData: ApplicationEmailData): string {
        return generateTemplatedEmail(
            this.subject,
            `
            </br>
            ${generateEmailHeader(emailText.getSuccessfulDecisionHeading)}
            ${generateEmailParagraph(`Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},`)}

      ${generateEmailParagraph('We are pleased to inform you that your application has been successful.')}

      ${generateEmailH2Header('Application')}
      ${generateEmailParagraph(emailText.getApplicationParagraph(emailData.application))}

      ${generateEmailH2Header('Opportunity')}
      ${generateEmailParagraph(emailText.getOpportunityParagraph(emailData.application))}

      ${generateEmailH2Header('What happens next')}

      ${generateEmailParagraph(
          'If there are no more stages to the application process, you will be sent a grant agreement. This must be agreed to before we can proceed further.',
      )}

      ${generateEmailParagraph(
          'If there are further stages to the application process, you will be contacted shortly with further details.',
      )}
      ${generateEmailParagraph(
          'Check the <a href="https://www.ukri.org/opportunity">funding finder for more information about the application process for this opportunity</a>.',
      )}
      ${generateEmailParagraph(
          'We would appreciate your feedback on your experience so we can improve the Funding Service. Please fill out <a href="https://forms.office.com/e/KhmVCx49cz">anonymous survey (link)</a>',
      )}
      ${generateEmailParagraph('Yours sincerely,', 'noMargin')}

      ${generateEmailParagraph('The UKRI Funding Service', 'noMargin')}
      ${generateEmailParagraph(emailText.email, 'noMargin')}
      ${generateEmailParagraph(emailText.telephone, 'noMargin')}
      </br>
      ${generateEmailParagraph(emailText.automatedMessage)}
      `,
        );
    }
    generateText(emailData: ApplicationEmailData): string {
        return `${emailText.getSuccessfulDecisionHeading}

        Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},

        We are pleased to inform you that your application has been successful.

        Application
        ${emailText.getApplicationParagraph(emailData.application)}

        Opportunity
        ${emailText.getOpportunityParagraph(emailData.application)}

        What happens next

        If there are no more stages to the application process, you will be sent a grant agreement. This must be agreed to before we can proceed further.

        If there are further stages to the application process, you will be contacted shortly with further details.

        Check the funding finder for more information about the application process for this opportunity (https://www.ukri.org/opportunity).

        We would appreciate your feedback on your experience so we can improve the Funding Service. Please fill out anonymous survey (https://forms.office.com/e/KhmVCx49cz)

        Yours sincerely,

        The UKRI Funding Service
        ${emailText.email}
        ${emailText.telephone}

        ${emailText.automatedMessage}
        `;
    }

    generateEmail(
        toAddresses: string[],
        emailData: ApplicationEmailData,
        { sourceEmail, sourceDisplayName }: EmailConfigType,
    ): Email {
        return {
            html: this.generateHtml(emailData),
            text: this.generateText(emailData),
            subject: this.subject,
            toAddresses: toAddresses,
            sourceEmail: sourceEmail,
            sourceDisplayName: sourceDisplayName,
        };
    }
}

const emailText = {
    ...baseEmailText,
    getSuccessfulDecisionHeading: 'Your application has been successful',
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
};
