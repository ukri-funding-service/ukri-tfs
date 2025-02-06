import { generateEmailParagraph, generateTemplatedEmail } from '../components';
import { EmailConfigType, EmailGenerator, MFASetupCompleteEmailData } from './data';
import { Email } from '../email';

export class MFASetupCompleteEmailGenerator extends EmailGenerator<MFASetupCompleteEmailData> {
    generateHtml(emailData: MFASetupCompleteEmailData): string {
        return generateTemplatedEmail(
            `UKRI Funding Service - 2FA set up complete`,
            `
            ${generateEmailParagraph(`Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},`)}
            ${generateEmailParagraph(
                `Two factor authentication has been set up on your account for the Funding Service (TFS).`,
            )}
            ${generateEmailParagraph(
                `You can manage your 2FA preferences in <a href="${emailData.accountSettingsLink}">account settings</a>`,
            )}
            ${generateEmailParagraph(`Kind regards,`)}

            ${generateEmailParagraph(`The UKRI Funding Service`, 'noMargin')}
            ${generateEmailParagraph(`Email: support@funding-service.ukri.org`, 'noMargin')}
            ${generateEmailParagraph(`Telephone: 01793 547490`, 'noMargin')}
            ${generateEmailParagraph(`This is an automated message – do not reply.`, 'noMargin')}`,
        );
    }

    generateText(emailData: MFASetupCompleteEmailData): string {
        return `UKRI Funding Service - 2FA set up complete

        Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},

        Two factor authentication has been set up on your account for the Funding Service (TFS).

        You can manage your 2FA preferences in ${emailData.accountSettingsLink}

        Kind regards,

        The UKRI Funding Service
        Email: support@funding-service.ukri.org
        Telephone: 01793 547490
        This is an automated message – do not reply.`;
    }

    generateEmail(
        toAddresses: string[],
        emailData: MFASetupCompleteEmailData,
        { sourceEmail, sourceDisplayName, applicationManagerUrl }: EmailConfigType,
    ): Email {
        const accountSettingsLink = `${applicationManagerUrl}/${emailData.accountSettingsLink}`;
        return {
            html: this.generateHtml({ ...emailData, accountSettingsLink }),
            text: this.generateText({ ...emailData, accountSettingsLink }),
            subject: `UKRI Funding Service - 2FA set up complete`,
            toAddresses,
            sourceEmail: sourceEmail,
            sourceDisplayName: sourceDisplayName,
        };
    }
}
