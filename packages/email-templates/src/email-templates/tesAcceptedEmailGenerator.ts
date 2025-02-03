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
import { Award, EmailConfigType, EmailGenerator, TesAcceptedEmailData } from './data';
export class TesAcceptedEmailGenerator extends EmailGenerator<TesAcceptedEmailData> {
    private subject = 'UKRI Funding Service - Transfer expenditure statement accepted';

    private emailText = {
        ...baseEmailText,
        linkInstructionText: `You can view the expenditure statement at`,
        getHeaderText: (award: Award) =>
            `Transfer expenditure statement for ${award.reference}: ${award.name} accepted`,
        getExpenditureStatementText: (tesSubmittedDate: string, award: Award) => {
            const formattedDate = formatIsoDateTimeString(
                new Date(tesSubmittedDate).toISOString(),
                DateTimeFormat.DateWithMonthName,
            );

            return `The expenditure statement you submitted on ${formattedDate} for the award ${award.reference}: ${award.name} has been accepted.`;
        },
    };

    generateEmail(
        toAddresses: string[],
        emailData: TesAcceptedEmailData,
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

    generateHtml(emailData: TesAcceptedEmailData): string {
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
            ${generateEmailParagraph(
                `${this.emailText.linkInstructionText} <a href="${emailData.tesUrl}">${emailData.tesUrl}</a>.`,
            )}
            ${generateEmailSignOffHtml({
                email: this.emailText.awardEmail,
                telephone: this.emailText.awardTelephone,
            })}`,
        );
    }

    generateText(emailData: TesAcceptedEmailData): string {
        return `
        ${this.emailText.getHeaderText(emailData.award)}

        ${this.emailText.getDearLine(emailData.recipient.firstName!, emailData.recipient.lastName!)}

        ${this.emailText.getExpenditureStatementText(emailData.tesSubmittedDate, emailData.award)}

        ${`${this.emailText.linkInstructionText} ${emailData.tesUrl}.`}
        ${generateEmailSignOffText({
            email: this.emailText.awardEmail,
            telephone: this.emailText.awardTelephone,
        })}`;
    }
}
