import {
    baseEmailText,
    generateEmailHeader,
    generateEmailParagraph,
    generateTemplatedEmail,
    generateEmailSignOffHtml,
    generateEmailSignOffText,
} from '../components';
import { Email } from '../email';
import { Award, AwardClosedEmailData, EmailConfigType, EmailGenerator } from './data';

export class AwardClosedEmailGenerator extends EmailGenerator<AwardClosedEmailData> {
    private subject = 'UKRI Funding Service - Award closed';

    private emailText = {
        ...baseEmailText,
        getHeaderText: (award: Award) => `${award.name} ${award.reference} closed`,
        getAwardText: (award: Award) =>
            `Your Award ${award.reference}:${award.name} is now closed. Thank you for working with UKRI.`,
    };

    generateEmail(
        toAddresses: string[],
        emailData: AwardClosedEmailData,
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

    generateHtml(emailData: AwardClosedEmailData): string {
        return generateTemplatedEmail(
            this.subject,
            `
            ${generateEmailHeader(this.emailText.getHeaderText(emailData.award))}
            ${generateEmailParagraph(
                this.emailText.getDearLine(emailData.recipient.firstName!, emailData.recipient.lastName!),
            )}
            ${generateEmailParagraph(this.emailText.getAwardText(emailData.award))}
            ${generateEmailSignOffHtml({
                email: this.emailText.awardEmail,
                telephone: this.emailText.awardTelephone,
            })}`,
        );
    }

    generateText(emailData: AwardClosedEmailData): string {
        return `
        ${this.emailText.getHeaderText(emailData.award)}

        ${this.emailText.getDearLine(emailData.recipient.firstName!, emailData.recipient.lastName!)}

        ${this.emailText.getAwardText(emailData.award)}
        ${generateEmailSignOffText({
            email: this.emailText.awardEmail,
            telephone: this.emailText.awardTelephone,
        })}`;
    }
}
