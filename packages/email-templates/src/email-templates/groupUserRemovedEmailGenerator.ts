import {
    baseEmailText,
    generateEmailHeader,
    generateEmailParagraph,
    generateTemplatedEmail,
    generateEmailSignOffHtml,
    generateEmailSignOffText,
} from '../components';
import { Email } from '../email';
import { EmailConfigType, EmailGenerator, Group, GroupUserRemovedEmailData, Person } from './data';

export class GroupUserRemovedEmailGenerator extends EmailGenerator<GroupUserRemovedEmailData> {
    private emailText = {
        ...baseEmailText,
        notificationsParagraph: `This means you will no longer receive email notifications about any of the applications assigned to the group.`,
        getSubject: (group: Group) => {
            if (group.isDefault) {
                return `You're no longer receiving notifications about unassigned applications - UKRI Funding Service`;
            }

            return `You've been removed from the group '${group.name}' - UKRI Funding Service`;
        },
        getHeaderText: (group: Group) => {
            if (group.isDefault) {
                return `You're no longer receiving notifications about unassigned applications`;
            }

            return `You've been removed from the group '${group.name}'`;
        },
        getMainParagraphText: (researchOfficer: Person, group: Group) => {
            if (group.isDefault) {
                return `${researchOfficer.firstName} ${researchOfficer.lastName} has stopped you receiving emails about the progress of applications that are not assigned to a group.`;
            }

            return `${researchOfficer.firstName} ${researchOfficer.lastName} has removed you from the group '${group.name}'.`;
        },
    };

    generateEmail(
        toAddresses: string[],
        emailData: GroupUserRemovedEmailData,
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

    generateHtml(emailData: GroupUserRemovedEmailData): string {
        return generateTemplatedEmail(
            this.emailText.getSubject(emailData.group),
            `
            ${generateEmailHeader(this.emailText.getHeaderText(emailData.group))}
            ${generateEmailParagraph(this.emailText.getMainParagraphText(emailData.researchOfficer, emailData.group))}
            ${!emailData.group.isDefault ? generateEmailParagraph(this.emailText.notificationsParagraph) : ''}
            ${generateEmailParagraph(
                `You can still <a href="${emailData.externalFundingServiceSignInUrl}">track the progress of all your organisation's applications</a> by signing in to the Funding Service.`,
            )}
            ${generateEmailSignOffHtml()}`,
        );
    }

    generateText(emailData: GroupUserRemovedEmailData): string {
        return `
        ${this.emailText.getHeaderText(emailData.group)}

        ${this.emailText.getMainParagraphText(emailData.researchOfficer, emailData.group)}

        ${!emailData.group.isDefault ? this.emailText.notificationsParagraph : ''}

        You can still track the progress of all your organisation's applications by signing in to the Funding Service: ${
            emailData.externalFundingServiceSignInUrl
        }
        ${generateEmailSignOffText()}`;
    }
}
