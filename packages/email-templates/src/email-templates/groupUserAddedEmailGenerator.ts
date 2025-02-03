import {
    baseEmailText,
    generateEmailHeader,
    generateEmailParagraph,
    generateTemplatedEmail,
    generateEmailSignOffHtml,
    generateEmailSignOffText,
} from '../components';
import { Email } from '../email';
import { EmailConfigType, EmailGenerator, Group, GroupUserAddedEmailData, Person } from './data';

export class GroupUserAddedEmailGenerator extends EmailGenerator<GroupUserAddedEmailData> {
    private emailText = {
        ...baseEmailText,
        notificationsParagraph: `This means you will receive email notifications about the progress of all applications assigned to the group.`,
        getSubject: (group: Group) => {
            if (group.isDefault) {
                return `You're now receiving notifications about all unassigned applications - UKRI Funding Service`;
            }

            return `You have been added to the group '${group.name}' - UKRI Funding Service`;
        },
        getHeaderText: (group: Group) => {
            if (group.isDefault) {
                return `You're now receiving notifications about all unassigned applications`;
            }

            return `You have been added to the group '${group.name}'`;
        },
        getMainParagraphText: (researchOfficer: Person, group: Group) => {
            if (group.isDefault) {
                return `${researchOfficer.firstName} ${researchOfficer.lastName} has set you up to receive emails about the progress of all applications that are not assigned to a group.`;
            }

            return `${researchOfficer.firstName} ${researchOfficer.lastName} has added you to the group '${group.name}'.`;
        },
    };

    generateEmail(
        toAddresses: string[],
        emailData: GroupUserAddedEmailData,
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

    generateHtml(emailData: GroupUserAddedEmailData): string {
        return generateTemplatedEmail(
            this.emailText.getSubject(emailData.group),
            `
            ${generateEmailHeader(this.emailText.getHeaderText(emailData.group))}
            ${generateEmailParagraph(this.emailText.getMainParagraphText(emailData.researchOfficer, emailData.group))}
            ${!emailData.group.isDefault ? generateEmailParagraph(this.emailText.notificationsParagraph) : ''}
            ${generateEmailSignOffHtml()}`,
        );
    }

    generateText(emailData: GroupUserAddedEmailData): string {
        return `
        ${this.emailText.getHeaderText(emailData.group)}

        ${this.emailText.getMainParagraphText(emailData.researchOfficer, emailData.group)}

        ${!emailData.group.isDefault ? this.emailText.notificationsParagraph : ''}
        ${generateEmailSignOffText()}`;
    }
}
