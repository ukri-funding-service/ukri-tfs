import {
    baseEmailText,
    generateEmailH2Header,
    generateEmailParagraph,
    generateEmailSignOffHtml,
    generateEmailSignOffText,
    generateTemplatedEmail,
} from '../components';
import { Email } from '../email';
import { Award, EmailConfigType, EmailGenerator, TesIssuedEmailData } from './data';

export class TesIssuedEmailGenerator extends EmailGenerator<TesIssuedEmailData> {
    private subject = 'UKRI Funding Service - Complete your transfer expenditure statement';
    private emailText = {
        ...baseEmailText,
        subHeadingText: 'What to do next',
        getDeadlineText: (deadlineDays?: number) =>
            `You have ${deadlineDays ?? '90'} days to complete the tES and return it to us.`,
        linkInstructionText: `You can view and complete your tES at`,
        getAwardText: (award: Award) =>
            `${award.reference}: ${award.name} has been issued a transfer expenditure statement (tES).`,
    };

    generateEmail(
        toAddresses: string[],
        emailData: TesIssuedEmailData,
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

    generateHtml(emailData: TesIssuedEmailData): string {
        return generateTemplatedEmail(
            this.subject,
            `
            ${generateEmailParagraph(
                this.emailText.getDearLine(emailData.recipient.firstName!, emailData.recipient.lastName!),
            )}
            ${generateEmailParagraph(this.emailText.getAwardText(emailData.award))}
            ${generateEmailParagraph(this.emailText.getDeadlineText(emailData.deadlineDays))}
            ${generateEmailH2Header(this.emailText.subHeadingText)}
            ${generateEmailParagraph(
                `${this.emailText.linkInstructionText}: <a href="${emailData.tesUrl}">${emailData.tesUrl}</a>.`,
            )}
            ${generateEmailSignOffHtml({
                signOffText: 'Thank you',
                email: this.emailText.awardEmail,
                telephone: this.emailText.awardTelephone,
            })}
            `,
        );
    }

    generateText(emailData: TesIssuedEmailData): string {
        return `${this.emailText.getDearLine(emailData.recipient.firstName!, emailData.recipient.lastName!)}

        ${this.emailText.getAwardText(emailData.award)}

        ${this.emailText.getDeadlineText(emailData.deadlineDays)}

        ${this.emailText.subHeadingText}

        ${`${this.emailText.linkInstructionText}: ${emailData.tesUrl}.`}
        ${generateEmailSignOffText({
            signOffText: 'Thank you',
            email: this.emailText.awardEmail,
            telephone: this.emailText.awardTelephone,
        })}`;
    }
}
