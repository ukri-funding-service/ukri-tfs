import {
    baseEmailText,
    generateEmailH2Header,
    generateEmailHeader,
    generateEmailParagraph,
    generateTemplatedEmail,
} from '../components';
import { Email } from '../email';
import { ApplicationEmailData, EmailConfigType, EmailGenerator } from './data';

export class ResearchOrganisationUnsuccessfulApplicationEmailGenerator extends EmailGenerator<ApplicationEmailData> {
    private subject = 'Funding decision - UKRI';

    generateHtml(emailData: ApplicationEmailData): string {
        return generateTemplatedEmail(
            this.subject,
            `
            </br>
            ${generateEmailHeader(emailText.getUnsuccessfulDecisionHeading)}
            ${generateEmailParagraph(`Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},`)}

      ${generateEmailParagraph(
          'We regret to inform you that an application for funding from your organisation has not been successful.',
      )}

      ${generateEmailH2Header('Application')}
      ${generateEmailParagraph(emailText.getApplicationParagraph(emailData.application))}            
      
      ${generateEmailH2Header('Opportunity')}
      ${generateEmailParagraph(emailText.getOpportunityParagraph(emailData.application))}

      ${generateEmailH2Header('What happens next')}

      ${generateEmailParagraph('You do not need to do anything else.')}
      
      ${generateEmailParagraph('Thank you for taking the time to submit an application for this Opportunity.')}

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
        return `${emailText.getUnsuccessfulDecisionHeading}

        Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},

        We regret to inform you that an application for funding from your organisation has not been successful.
        
        Application
        ${emailText.getApplicationParagraph(emailData.application)}            
        
        Opportunity
        ${emailText.getOpportunityParagraph(emailData.application)}

        What happens next

        You do not need to do anything else.

        Thank you for taking the time to submit an application for this Opportunity.

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
    getUnsuccessfulDecisionHeading: 'An application for funding from your organisation has not been successful',
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
