import {
    baseEmailText,
    generateEmailHeader,
    generateEmailParagraph,
    generateTemplatedEmail,
    generateEmailSignOffHtml,
    generateEmailSignOffText,
} from '../components';
import { Email } from '../email';
import { EmailConfigType, EmailGenerator, Group, GroupDeletedEmailData, Person } from './data';

export class GroupDeletedEmailGenerator extends EmailGenerator<GroupDeletedEmailData> {
    private emailText = {
        ...baseEmailText,
        ungroupedApplicationsParagraph: `All the applications that were assigned to this group are now ungrouped.`,
        notificationsParagraph: `This means that all notifications about them will go to everyone in your research office.`,
        getSubject: (group: Group) => `The group '${group.name}' has been deleted - UKRI Funding Service`,
        getHeaderText: (group: Group) => `The group '${group.name}' has been deleted`,
        getMainParagraphText: (researchOfficer: Person, group: Group) =>
            `${researchOfficer.firstName} ${researchOfficer.lastName} has deleted the group '${group.name}'.`,
    };

    generateEmail(
        toAddresses: string[],
        emailData: GroupDeletedEmailData,
        { sourceEmail, sourceDisplayName }: EmailConfigType,
    ): Email {
        return {
            html: this.generateHtml(emailData),
            text: this.generateText(emailData),
            subject: this.emailText.getSubject(emailData.group),
            toAddresses,
            sourceEmail: sourceEmail,
            sourceDisplayName: sourceDisplayName,
        };
    }

    generateHtml(emailData: GroupDeletedEmailData): string {
        return generateTemplatedEmail(
            this.emailText.getSubject(emailData.group),
            `
            ${generateEmailHeader(this.emailText.getHeaderText(emailData.group))}
            ${generateEmailParagraph(this.emailText.getMainParagraphText(emailData.researchOfficer, emailData.group))}
            ${generateEmailParagraph(this.emailText.ungroupedApplicationsParagraph)}
            ${generateEmailParagraph(this.emailText.notificationsParagraph)}
            ${generateEmailSignOffHtml()}`,
        );
    }

    generateText(emailData: GroupDeletedEmailData): string {
        return `
        ${this.emailText.getHeaderText(emailData.group)}

        ${this.emailText.getMainParagraphText(emailData.researchOfficer, emailData.group)}

        ${this.emailText.ungroupedApplicationsParagraph}

        ${this.emailText.notificationsParagraph}
        ${generateEmailSignOffText()}`;
    }
}
