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

            ${generateEmailParagraph(emailText.getBodyParagraph4)}

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

        ${emailText.getBodyParagraph4}

        ${emailText.signOff},
        ${emailText.fundingService}
        ${emailText.email}
        ${emailText.telephone}

        ${emailText.automatedMessage}`;
    }
}
const emailText = {
    ...baseEmailText,
    getBodyParagraph1: 'We are pleased to inform you that your application for funding has been successful.',
    getBodyParagraph2: 'We will create a grant agreement and send it to your research organisation.',
    getBodyParagraph3: 'Your research organisation must agree to the grant agreement before we can issue funding.',
    getBodyParagraph4: `You don't need to do anything until your research organisation contacts you.`,
    getApplicationSuccessfulHeading: 'Your application for funding has been successful',
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
