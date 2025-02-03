import { DateTimeFormat, formatIsoDateTimeString } from '@ukri-tfs/time';
import {
    baseEmailText,
    generateEmailHeader,
    generateEmailParagraph,
    generateTemplatedEmail,
    generateEmailSignOffHtml,
    generateEmailSignOffText,
} from '../components';
import { Email } from '../email';
import { Award, EmailConfigType, EmailGenerator, FesAcceptedEmailData } from './data';

export class FesAcceptedEmailGenerator extends EmailGenerator<FesAcceptedEmailData> {
    private subject = 'UKRI Funding Service - Final expenditure statement accepted';

    private emailText = {
        ...baseEmailText,
        linkInstructionText: `You can view the expenditure statement at`,
        getHeaderText: (award: Award) => `Final expenditure statement for ${award.name} ${award.reference} accepted`,
        getExpenditureStatementText: (fesSubmittedDate: string, award: Award) => {
            const formattedDate = formatIsoDateTimeString(
                new Date(fesSubmittedDate).toISOString(),
                DateTimeFormat.DateWithMonthName,
            );

            return `The expenditure statement you submitted on ${formattedDate} for the award ${award.reference}:${award.name} has been accepted.`;
        },
    };

    generateEmail(
        toAddresses: string[],
        emailData: FesAcceptedEmailData,
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

    generateHtml(emailData: FesAcceptedEmailData): string {
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
            ${generateEmailParagraph(
                `${this.emailText.linkInstructionText} <a href="${emailData.fesUrl}">${emailData.fesUrl}</a>.`,
            )}
            ${generateEmailSignOffHtml({
                email: this.emailText.awardEmail,
                telephone: this.emailText.awardTelephone,
            })}`,
        );
    }

    generateText(emailData: FesAcceptedEmailData): string {
        return `
        ${this.emailText.getHeaderText(emailData.award)}

        ${this.emailText.getDearLine(emailData.recipient.firstName!, emailData.recipient.lastName!)}

        ${this.emailText.getExpenditureStatementText(emailData.fesSubmittedDate, emailData.award)}

        ${`${this.emailText.linkInstructionText} ${emailData.fesUrl}.`}
        ${generateEmailSignOffText({
            email: this.emailText.awardEmail,
            telephone: this.emailText.awardTelephone,
        })}`;
    }
}
