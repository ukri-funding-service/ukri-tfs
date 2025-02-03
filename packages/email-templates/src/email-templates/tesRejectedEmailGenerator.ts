import { stripHtmlTags } from '@ukri-tfs/html-utils';
import { DateTimeFormat, formatIsoDateTimeString } from '@ukri-tfs/time';
import {
    baseEmailText,
    generateEmailHeader,
    generateEmailParagraph,
    generateTemplatedEmail,
    generateEmailSignOffHtml,
    generateEmailH2Header,
    generateEmailSignOffText,
} from '../components';
import { Email } from '../email';
import { Award, EmailConfigType, EmailGenerator, TesRejectedEmailData } from './data';

export class TesRejectedEmailGenerator extends EmailGenerator<TesRejectedEmailData> {
    private subject = 'UKRI Funding Service - Transfer expenditure statement rejected';

    private emailText = {
        ...baseEmailText,
        reissuedTesText: `We have sent you a new expenditure statement to complete.`,
        linkInstructionText: `You can view this expenditure statement at`,
        subHeadingText: `Reason for rejection`,
        getHeaderText: (award: Award) =>
            `Transfer expenditure statement for ${award.reference}: ${award.name} rejected`,
        getExpenditureStatementText: (tesSubmittedDate: string, award: Award) => {
            const formattedDate = formatIsoDateTimeString(
                new Date(tesSubmittedDate).toISOString(),
                DateTimeFormat.DateWithMonthName,
            );

            return `The expenditure statement you submitted on ${formattedDate} for the award ${award.reference}: ${award.name} has been rejected.`;
        },
    };

    generateEmail(
        toAddresses: string[],
        emailData: TesRejectedEmailData,
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

    generateHtml(emailData: TesRejectedEmailData): string {
        return generateTemplatedEmail(
            this.subject,
            `
            ${generateEmailHeader(this.emailText.getHeaderText(emailData.award))}
            ${generateEmailParagraph(
                this.emailText.getDearLine(emailData.recipient.firstName!, emailData.recipient.lastName!),
            )}
            ${generateEmailParagraph(
                this.emailText.getExpenditureStatementText(emailData.tesSubmittedDate, emailData.award),
            )}
            ${generateEmailH2Header(this.emailText.subHeadingText)}
            ${generateEmailParagraph(emailData.tesRejectedComments, 'default', false, 'div')}
            ${generateEmailParagraph(`${this.emailText.reissuedTesText}`)}
            ${generateEmailParagraph(
                `${this.emailText.linkInstructionText} <a href="${emailData.tesUrl}">${emailData.tesUrl}</a>.`,
            )}
            ${generateEmailSignOffHtml({
                email: this.emailText.awardEmail,
                telephone: this.emailText.awardTelephone,
            })}`,
        );
    }

    generateText(emailData: TesRejectedEmailData): string {
        return `
        ${this.emailText.getHeaderText(emailData.award)}

        ${this.emailText.getDearLine(emailData.recipient.firstName!, emailData.recipient.lastName!)}

        ${this.emailText.getExpenditureStatementText(emailData.tesSubmittedDate, emailData.award)}

        ${this.emailText.subHeadingText}

        ${stripHtmlTags(emailData.tesRejectedComments)}

        ${this.emailText.reissuedTesText}
        ${`${this.emailText.linkInstructionText} ${emailData.tesUrl}.`}
        ${generateEmailSignOffText({ email: this.emailText.awardEmail, telephone: this.emailText.awardTelephone })}`;
    }
}
