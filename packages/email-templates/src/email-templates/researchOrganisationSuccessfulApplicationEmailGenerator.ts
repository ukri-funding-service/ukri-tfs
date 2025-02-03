import {
    baseEmailText,
    generateEmailH2Header,
    generateEmailHeader,
    generateEmailParagraph,
    generateTemplatedEmail,
} from '../components';
import { Email } from '../email';
import { ApplicationEmailData, EmailConfigType, EmailGenerator } from './data';

export class ResearchOrganisationSuccessfulApplicationEmailGenerator extends EmailGenerator<ApplicationEmailData> {
    private subject = 'Funding decision - UKRI';

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
    generateHtml(emailData: ApplicationEmailData): string {
        return generateTemplatedEmail(
            this.subject,
            `
            </br>
            ${generateEmailHeader(emailText.getResearchOrganisationSuccessfulHeading)}
            ${generateEmailParagraph(`Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},`)}

            ${generateEmailParagraph(emailText.getBodyParagraph1)}

            ${generateEmailParagraph(emailText.getIgnoreParagraph)}

            ${generateEmailH2Header('Application')}
            ${generateEmailParagraph(emailText.getApplicationParagraph(emailData.application))}            
            
            ${generateEmailH2Header('Opportunity')}
            ${generateEmailParagraph(emailText.getOpportunityParagraph(emailData.application))}

            ${generateEmailH2Header('What happens next')}
            ${generateEmailParagraph(emailText.getBodyParagraph2)}

            ${generateEmailParagraph(emailText.getBodyParagraph3)}

            ${generateEmailParagraph(emailText.signOff + ',', 'noMargin')}
            ${generateEmailParagraph(emailText.fundingService, 'noMargin')}
            ${generateEmailParagraph(emailText.email, 'noMargin')}
            ${generateEmailParagraph(emailText.telephone)}

            ${generateEmailParagraph(emailText.automatedMessage)}`,
        );
    }

    generateText(emailData: ApplicationEmailData): string {
        return `${emailText.getResearchOrganisationSuccessfulHeading}
        Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},

        ${emailText.getBodyParagraph1}
        
        ${emailText.getIgnoreParagraph}

        Application
        ${emailText.getApplicationParagraph(emailData.application)}            
        
        Opportunity
        ${emailText.getOpportunityParagraph(emailData.application)}

        What happens next
        
        ${emailText.getBodyParagraph2}

        ${emailText.getBodyParagraph3}

        ${emailText.signOff},
        ${emailText.fundingService}
        ${emailText.email}
        ${emailText.telephone}

        ${emailText.automatedMessage}`;
    }
}
const emailText = {
    ...baseEmailText,
    getBodyParagraph1:
        'We are pleased to inform you that an application for funding from your organisation has been successful.',
    getBodyParagraph2: 'We will create a grant agreement and send it to you.',
    getBodyParagraph3: 'You must agree to the grant agreement before we can issue funding.',
    getIgnoreParagraph: 'If you were not involved in submitting this application, you can ignore this email.',
    getResearchOrganisationSuccessfulHeading: 'An application for funding from your organisation has been successful',
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
