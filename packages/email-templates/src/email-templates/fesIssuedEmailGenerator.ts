import { DateTimeFormat, formatIsoDateTimeString } from '@ukri-tfs/time';
import {
    baseEmailText,
    generateEmailH2Header,
    generateEmailHeader,
    generateEmailParagraph,
    generateEmailSignOffHtml,
    generateEmailSignOffText,
    generateHtmlListItem,
    generateTemplatedEmail,
} from '../components';
import { generateHtmlUnorderedList } from '../components/emailUnorderedList';
import { Email } from '../email';
import { Award, EmailConfigType, EmailGenerator, FesIssuedEmailData } from './data';

export class FesIssuedEmailGenerator extends EmailGenerator<FesIssuedEmailData> {
    private subject = 'UKRI Funding Service - Final expenditure statement issued';

    private emailText = {
        ...baseEmailText,
        getDeadlineText: (deadlineDate: Date, deadlineDays?: number) =>
            `You have ${
                deadlineDays ?? '90'
            } days to complete the FES and return it to us. This means you must submit your FES by ${this.formatDate(
                deadlineDate,
            )}.`,
        instructionText1: `If you do not, you may be sanctioned as outlined in your award T&Cs.`,
        linkInstructionHtml1: (fesUrl: string) =>
            `You can <a href="${fesUrl}">complete and submit your FES in the Funding Service (TFS)</a>.`,
        linkInstructionText1: (fesUrl: string) =>
            `You can complete and submit your FES in the Funding Service at ${fesUrl}.`,
        linkInstructionText2: `You may need to upload supporting documents as part of your FES. For more information about what supporting documents you may need to provide:`,
        linkInstructionBullet1Text: `review the T&Cs of your award`,
        linkInstructionBullet2Text: (fesUrl: string) =>
            `read our guidance on supporting files for final expenditure statements (FES) at ${fesUrl}/supporting-files-guidance`,
        linkInstructionsBullet2Html: (fesUrl: string) =>
            `read our <a href="${fesUrl}/supporting-files-guidance">guidance on supporting files for final expenditure statements (FES)</a>`,
        subHeadingText: `How to complete your FES`,
        getHeaderText: (award: Award) => `Final expenditure statement for ${award.name} ${award.reference} issued`,
        getAwardText: (award: Award) =>
            `${award.name} ${award.reference} has been issued a final expenditure statement (FES) by UKRI.`,
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
            ${generateEmailParagraph(this.emailText.getDeadlineText(emailData.deadlineDate, emailData.deadlineDays))}
            ${generateEmailParagraph(this.emailText.instructionText1)}
            ${generateEmailH2Header(this.emailText.subHeadingText)}
            ${generateEmailParagraph(this.emailText.linkInstructionHtml1(emailData.fesUrl))}
            ${generateEmailParagraph(this.emailText.linkInstructionText2)}
            ${generateHtmlUnorderedList(
                `${generateHtmlListItem(this.emailText.linkInstructionBullet1Text)}${generateHtmlListItem(
                    this.emailText.linkInstructionsBullet2Html(emailData.fesUrl),
                )}`,
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

        ${this.emailText.getDeadlineText(emailData.deadlineDate, emailData.deadlineDays)}

        ${this.emailText.instructionText1}
        
        ${this.emailText.subHeadingText}

        ${this.emailText.linkInstructionText1(emailData.fesUrl)}

        ${this.emailText.linkInstructionText2}
        * ${this.emailText.linkInstructionBullet1Text}
        * ${this.emailText.linkInstructionBullet2Text(emailData.fesUrl)}

        ${generateEmailSignOffText({
            email: this.emailText.awardEmail,
            telephone: this.emailText.awardTelephone,
        })}`;
    }

    formatDate = (date: Date): string => {
        return formatIsoDateTimeString(new Date(date).toISOString(), DateTimeFormat.DateWithMonthName);
    };
}
