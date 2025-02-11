import {
    baseEmailText,
    generateEmailH2Header,
    generateEmailHeader,
    generateEmailParagraph,
    generateEmailSignOffHtml,
    generateEmailSignOffText,
    generateTemplatedEmail,
} from '../components';
import { Email } from '../email';
import { Award, EmailConfigType, EmailGenerator, FesIssuedEmailData } from './data';

export class FesIssuedEmailGenerator extends EmailGenerator<FesIssuedEmailData> {
    private subject = 'UKRI Funding Service - Final expenditure statement issued';

    private emailText = {
        ...baseEmailText,
        getDeadlineText: (deadlineDays?: number) =>
            `You have ${deadlineDays ?? '90'} days to complete the fES and return it to us.`,
        linkInstructionText: `You can complete and submit your fES at`,
        subHeadingText: `What happens next`,
        getHeaderText: (award: Award) => `Final expenditure statement for ${award.name} ${award.reference} issued`,
        getAwardText: (award: Award) =>
            `${award.name} ${award.reference} has been issued a final expenditure statement (fES) by UKRI.`,
    };

    generateEmail(
        toAddresses: string[],
        emailData: FesIssuedEmailData,
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

    generateHtml(emailData: FesIssuedEmailData): string {
        return generateTemplatedEmail(
            this.subject,
            `
            ${generateEmailHeader(this.emailText.getHeaderText(emailData.award))}
            ${generateEmailParagraph(
                this.emailText.getDearLine(emailData.recipient.firstName!, emailData.recipient.lastName!),
            )}
            ${generateEmailParagraph(this.emailText.getAwardText(emailData.award))}
            ${generateEmailParagraph(this.emailText.getDeadlineText(emailData.deadlineDays))}
            ${generateEmailH2Header(this.emailText.subHeadingText)}
            ${generateEmailParagraph(
                `${this.emailText.linkInstructionText} <a href="${emailData.fesUrl}">${emailData.fesUrl}</a>.`,
            )}
            ${generateEmailSignOffHtml({
                email: this.emailText.awardEmail,
                telephone: this.emailText.awardTelephone,
            })}`,
        );
    }

    generateText(emailData: FesIssuedEmailData): string {
        return `
        ${this.emailText.getHeaderText(emailData.award)}

        ${this.emailText.getDearLine(emailData.recipient.firstName!, emailData.recipient.lastName!)}

        ${this.emailText.getAwardText(emailData.award)}

        ${this.emailText.getDeadlineText(emailData.deadlineDays)}

        ${this.emailText.subHeadingText}

        ${`${this.emailText.linkInstructionText} ${emailData.fesUrl}.`}
        ${generateEmailSignOffText({
            email: this.emailText.awardEmail,
            telephone: this.emailText.awardTelephone,
        })}`;
    }
}
