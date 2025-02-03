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
    Applicant,
    Application,
    ApplicationGroupAssignedEmailData,
    ApplicationGroupAssignedEmailDataWithApplicationLink,
    EmailConfigType,
    EmailGenerator,
    Group,
} from './data';
export class ApplicationGroupAssignedEmailGenerator extends EmailGenerator<ApplicationGroupAssignedEmailData> {
    private assignmentText = 'Someone has assigned a new application to your group';

    private emailText = {
        ...baseEmailText,
        linkInstructionText: `Sign in to the Funding Service to view and edit the draft application at`,
        getOpportunityText: (application: Application) =>
            `${application.opportunityRef}: ${application.opportunityName}`,
        getApplicationText: (application: Application) =>
            `${application.applicationRef}: ${application.applicationName}`,
        getApplicantText: (applicant: Applicant) => `${applicant.firstName} ${applicant.lastName}`,
        getGroupParagraphText: (group: Group) => `Assigned to: ${group.name}`,
    };
    generateEmail(
        toAddresses: string[],
        emailData: ApplicationGroupAssignedEmailData,
        { sourceEmail, sourceDisplayName, applicationManagerUrl }: EmailConfigType,
    ): Email {
        const applicationLink = `${applicationManagerUrl}/applications/${emailData.application.applicationRef}`;
        return {
            html: this.generateHtml({ ...emailData, applicationLink }),
            text: this.generateText({ ...emailData, applicationLink }),
            subject: this.assignmentText,
            toAddresses,
            sourceEmail: sourceEmail,
            sourceDisplayName: sourceDisplayName,
        };
    }
    generateHtml(emailData: ApplicationGroupAssignedEmailDataWithApplicationLink): string {
        return generateTemplatedEmail(
            this.assignmentText,
            `
            ${generateEmailHeader(this.assignmentText)}

            ${generateEmailParagraph('<strong>Opportunity (call)</strong>', 'noMargin')}
            ${generateEmailParagraph(this.emailText.getOpportunityText(emailData.application))}
            
            ${generateEmailParagraph('<strong>Applicant</strong>', 'noMargin')}
            ${generateEmailParagraph(this.emailText.getApplicantText(emailData.applicant))}

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
    generateText(emailData: ApplicationGroupAssignedEmailDataWithApplicationLink): string {
        return `
        ${this.assignmentText}

        Opportunity (call)
        ${this.emailText.getOpportunityText(emailData.application)}

        Applicant
        ${this.emailText.getApplicantText(emailData.applicant)}

        Application
        ${this.emailText.getApplicationText(emailData.application)}

        Group
        ${this.emailText.getGroupParagraphText(emailData.group)}

        ${`${this.emailText.linkInstructionText} ${emailData.applicationLink}.`}

        ${generateEmailSignOffText()}`;
    }
}
