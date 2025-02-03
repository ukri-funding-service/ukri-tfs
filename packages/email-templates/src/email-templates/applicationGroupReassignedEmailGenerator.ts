import {
    baseEmailText,
    generateEmailHeader,
    generateEmailParagraph,
    generateEmailSignOffHtml,
    generateEmailSignOffText,
    generateTemplatedEmail,
} from '../components';
import { Email } from '../email';
import {
    Application,
    ApplicationGroupReassignedEmailData,
    ApplicationGroupReassignedEmailDataWithApplicationLink,
    EmailConfigType,
    EmailGenerator,
    Group,
} from './data';
export class ApplicationGroupReassignedEmailGenerator extends EmailGenerator<ApplicationGroupReassignedEmailData> {
    private reassignmentText = 'Someone has reassigned an existing application to your group';

    private emailText = {
        ...baseEmailText,
        linkInstructionText: `Sign in to the Funding Service to view and edit the draft application at`,
        getOpportunityText: (application: Application) =>
            `${application.opportunityRef}: ${application.opportunityName}`,
        getApplicationText: (application: Application) =>
            `${application.applicationRef}: ${application.applicationName}`,
        getGroupParagraphText: (group: Group) => `Reassigned to: ${group.name}`,
    };
    generateEmail(
        toAddresses: string[],
        emailData: ApplicationGroupReassignedEmailData,
        { sourceEmail, sourceDisplayName, applicationManagerUrl }: EmailConfigType,
    ): Email {
        const applicationLink = `${applicationManagerUrl}/applications/${emailData.application.applicationRef}`;
        return {
            html: this.generateHtml({ ...emailData, applicationLink }),
            text: this.generateText({ ...emailData, applicationLink }),
            subject: this.reassignmentText,
            toAddresses,
            sourceEmail: sourceEmail,
            sourceDisplayName: sourceDisplayName,
        };
    }
    generateHtml(emailData: ApplicationGroupReassignedEmailDataWithApplicationLink): string {
        return generateTemplatedEmail(
            this.reassignmentText,
            `
            ${generateEmailHeader(this.reassignmentText)}

            ${generateEmailParagraph('<strong>Opportunity (call)</strong>', 'noMargin')}
            ${generateEmailParagraph(this.emailText.getOpportunityText(emailData.application))}

            ${generateEmailParagraph('<strong>Application</strong>', 'noMargin')}
            ${generateEmailParagraph(this.emailText.getApplicationText(emailData.application))}

            ${generateEmailParagraph('<strong>Group</strong>', 'noMargin')}
            ${generateEmailParagraph(this.emailText.getGroupParagraphText(emailData.group))}

            ${generateEmailParagraph(
                `Sign in to the Funding Service to <a href="${emailData.applicationLink}">view and edit the draft application</a>`,
            )}

            ${generateEmailSignOffHtml()}`,
        );
    }
    generateText(emailData: ApplicationGroupReassignedEmailDataWithApplicationLink): string {
        return `
        ${this.reassignmentText}

        Opportunity (call)
        ${this.emailText.getOpportunityText(emailData.application)}

        Application
        ${this.emailText.getApplicationText(emailData.application)}

        Group
        ${this.emailText.getGroupParagraphText(emailData.group)}

        ${`${this.emailText.linkInstructionText} ${emailData.applicationLink}.`}
        
        ${generateEmailSignOffText()}`;
    }
}
