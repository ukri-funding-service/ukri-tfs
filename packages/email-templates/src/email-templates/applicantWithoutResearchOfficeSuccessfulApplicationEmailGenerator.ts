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

      ${generateEmailParagraph('We are pleased to inform you that your application for funding has been successful.')}

      ${generateEmailH2Header('Application')}
      ${generateEmailParagraph(emailText.getApplicationParagraph(emailData.application))}            
      
      ${generateEmailH2Header('Opportunity')}
      ${generateEmailParagraph(emailText.getOpportunityParagraph(emailData.application))}

      ${generateEmailH2Header('What happens next')}

      ${generateEmailParagraph('We will create a grant agreement and send it to you.')}

      ${generateEmailParagraph('You must agree to the grant agreement before we can issue funding.')}

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

        We are pleased to inform you that your application for funding has been successful.
        
        Application
        ${emailText.getApplicationParagraph(emailData.application)}            
        
        Opportunity
        ${emailText.getOpportunityParagraph(emailData.application)}

        What happens next

        We will create a grant agreement and send it to you.

        You must agree to the grant agreement before we can issue funding.

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
    getSuccessfulDecisionHeading: 'Your application for funding has been successful',
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
