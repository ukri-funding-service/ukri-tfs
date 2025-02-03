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
import { Award, EmailConfigType, EmailGenerator, FesRejectedEmailData } from './data';

export class FesRejectedEmailGenerator extends EmailGenerator<FesRejectedEmailData> {
    private subject = 'UKRI Funding Service - Final expenditure statement rejected';

    private emailText = {
        ...baseEmailText,
        reissuedFesText: `We have sent you a new expenditure statement to complete.`,
        linkInstructionText: `You can view this expenditure statement at`,
        subHeadingText: `Reason for rejection`,
        getHeaderText: (award: Award) => `Final expenditure statement for ${award.name} ${award.reference} rejected`,
        getExpenditureStatementText: (fesSubmittedDate: string, award: Award) => {
            const formattedDate = formatIsoDateTimeString(
                new Date(fesSubmittedDate).toISOString(),
                DateTimeFormat.DateWithMonthName,
            );

            return `The expenditure statement you submitted on ${formattedDate} for the award ${award.reference}:${award.name} has been rejected.`;
        },
    };

    generateEmail(
        toAddresses: string[],
        emailData: FesRejectedEmailData,
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

    generateHtml(emailData: FesRejectedEmailData): string {
        return generateTemplatedEmail(
            this.subject,
            `
            ${generateEmailHeader(this.emailText.getHeaderText(emailData.award))}
            ${generateEmailParagraph(
                this.emailText.getDearLine(emailData.recipient.firstName!, emailData.recipient.lastName!),
            )}
            ${generateEmailParagraph(
                this.emailText.getExpenditureStatementText(emailData.fesSubmittedDate, emailData.award),
            )}
            ${generateEmailH2Header(this.emailText.subHeadingText)}
            ${generateEmailParagraph(emailData.fesRejectedComments, 'default', false, 'div')}
            ${generateEmailParagraph(
                `${this.emailText.reissuedFesText}<br/>${this.emailText.linkInstructionText} <a href="${emailData.fesUrl}">${emailData.fesUrl}</a>.`,
            )}
            ${generateEmailSignOffHtml({
                email: this.emailText.awardEmail,
                telephone: this.emailText.awardTelephone,
            })}`,
        );
    }

    generateText(emailData: FesRejectedEmailData): string {
        return `
        ${this.emailText.getHeaderText(emailData.award)}

        ${this.emailText.getDearLine(emailData.recipient.firstName!, emailData.recipient.lastName!)}

        ${this.emailText.getExpenditureStatementText(emailData.fesSubmittedDate, emailData.award)}

        ${this.emailText.subHeadingText}

        ${stripHtmlTags(emailData.fesRejectedComments)}

        ${this.emailText.reissuedFesText}
        ${`${this.emailText.linkInstructionText} ${emailData.fesUrl}.`}
        ${generateEmailSignOffText({
            email: this.emailText.awardEmail,
            telephone: this.emailText.awardTelephone,
        })}`;
    }
}
