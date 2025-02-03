import {
    generateEmailParagraph,
    generateEmailSignOffHtml,
    generateEmailSignOffText,
    generateTemplatedEmail,
    baseEmailText,
} from '../components';
import { Email } from '../email';
import {
    Applicant,
    Application,
    ApplicationAccessEmailData,
    EmailConfigType,
    EmailGenerator,
    Organisation,
} from './data';

export class ApplicationAccessEmailGenerator extends EmailGenerator<ApplicationAccessEmailData> {
    private subject = 'UKRI Funding Service - invite to access application';
    private emailText = {
        ...baseEmailText,
        signInText: (accessLink: string, hasHtml: boolean) =>
            `Sign in to your area of The UKRI Funding Service to ${
                hasHtml
                    ? `<a href="${accessLink}">access the application</a>`
                    : `access the application (${accessLink})`
            }. You'll need to create an account with the Funding Service, if you don't already have one.`,
        getApplicationAccessText: (application: Application, leadApplicant: Applicant, organisation: Organisation) =>
            `You've been given access to an application on the UKRI Funding Service: ${application.applicationName}. You've been given access by ${leadApplicant.firstName} ${leadApplicant.lastName} from ${organisation.name}.`,
    };
    generateEmail(
        toAddresses: string[],
        emailData: ApplicationAccessEmailData,
        { sourceEmail, sourceDisplayName, applicationManagerUrl }: EmailConfigType,
    ): Email {
        const accessLink = new URL(emailData.accessLink, applicationManagerUrl);

        return {
            html: this.generateHtml({ ...emailData, accessLink: accessLink.href }),
            text: this.generateText({ ...emailData, accessLink: accessLink.href }),
            subject: this.subject,
            toAddresses,
            sourceEmail: sourceEmail,
            sourceDisplayName: sourceDisplayName,
        };
    }

    generateHtml(emailData: ApplicationAccessEmailData): string {
        return generateTemplatedEmail(
            this.subject,
            `
            ${generateEmailParagraph(
                this.emailText.getDearLine(emailData.recipient.firstName!, emailData.recipient.lastName!),
            )}
            ${generateEmailParagraph(
                this.emailText.getApplicationAccessText(
                    emailData.application,
                    emailData.leadApplicant,
                    emailData.organisation,
                ),
            )}
            ${generateEmailParagraph(this.emailText.signInText(emailData.accessLink, true))}
            ${generateEmailSignOffHtml()}`,
        );
    }

    generateText(emailData: ApplicationAccessEmailData): string {
        return ` ${this.subject}

        ${this.emailText.getDearLine(emailData.recipient.firstName!, emailData.recipient.lastName!)}
        
        ${this.emailText.getApplicationAccessText(
            emailData.application,
            emailData.leadApplicant,
            emailData.organisation,
        )}
        
        ${this.emailText.signInText(emailData.accessLink, false)}

        ${generateEmailSignOffText()}
        `;
    }
}
