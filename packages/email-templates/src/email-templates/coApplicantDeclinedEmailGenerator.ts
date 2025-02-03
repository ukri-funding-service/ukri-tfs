import { baseEmailText, generateEmailHeader, generateEmailParagraph, generateTemplatedEmail } from '../components';
import { Email } from '../email';
import { CoApplicantEmailData, EmailConfigType, EmailGenerator } from './data';

export class CoApplicantDeclinedEmailGenerator extends EmailGenerator<CoApplicantEmailData> {
    private subject = 'Funding decision - UKRI';

    generateEmail(
        toAddresses: string[],
        emailData: CoApplicantEmailData,
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
    generateHtml(emailData: CoApplicantEmailData): string {
        return generateTemplatedEmail(
            this.subject,
            `
            </br>
            ${generateEmailHeader(emailText.coApplicantDeclinedEmailHeading)}

            ${generateEmailParagraph(`Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},`)}


            ${generateEmailParagraph(emailText.generateApplicantDeclination(emailData.coApplicant))}

            ${generateEmailParagraph('<strong>Opportunity</strong>', 'noMargin')}
            ${generateEmailParagraph(emailData.application.opportunityName)}
            
            ${generateEmailParagraph('<strong>Application</strong>', 'noMargin')}
            ${generateEmailParagraph(emailData.application.applicationName)}

            ${generateEmailParagraph('<strong>Their role</strong>', 'noMargin')}
            ${generateEmailParagraph(`${emailData.coApplicant.role}`)}

            ${generateEmailParagraph(emailText.signOff + ',')}
            ${generateEmailParagraph(emailText.fundingService, 'noMargin')}
            ${generateEmailParagraph(emailText.email, 'noMargin')}
            ${generateEmailParagraph(emailText.telephone)}

            ${generateEmailParagraph(emailText.automatedMessage)}`,
        );
    }

    generateText(emailData: CoApplicantEmailData): string {
        return `${emailText.coApplicantDeclinedEmailHeading}

        Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},

        ${emailText.generateApplicantDeclination(emailData.coApplicant)}

        Opportunity
        ${emailData.application.opportunityName}
        
        Application
        ${emailData.application.applicationName}

        Their role
        ${emailData.coApplicant.role}

        ${emailText.signOff},
        ${emailText.fundingService}
        ${emailText.email}
        ${emailText.telephone}

        ${emailText.automatedMessage}`;
    }
}
const emailText = {
    ...baseEmailText,
    coApplicantDeclinedEmailHeading:
        'Someone has removed themselves from your application team for a UKRI funding Opportunity',
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
    generateApplicantDeclination: ({ firstName, lastName }: { firstName: string; lastName: string }) =>
        `${firstName} ${lastName} has removed themselves from your application team.`,
};
