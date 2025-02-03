import { baseEmailText, generateEmailHeader, generateEmailParagraph, generateTemplatedEmail } from '../components';
import { Email } from '../email';
import { EmailConfigType, EmailGenerator, InviteChampionEmailData } from './data';

export class InviteChampionEmailGenerator extends EmailGenerator<InviteChampionEmailData> {
    private emailText = {
        ...baseEmailText,
    };

    generateHtml(emailData: InviteChampionEmailData): string {
        {
            return generateTemplatedEmail(
                'Your UKRI Funding Service Account',
                `
                ${generateEmailHeader(`View all ${emailData.organisationName}'s UKRI Funding Service activity`)}
                ${this.emailText.getDearLine(emailData.recipient.firstName!, emailData.recipient.lastName!)}
                ${generateEmailParagraph(
                    `<b>Administrator status has been applied to your UKRI Funding Services account.</b>`,
                )}
                ${generateEmailParagraph(
                    `If you are a new user, you’ll need to create a password before signing in for the first time.`,
                )}

                <p style="font-family: Helvetica, Arial, sans-serif; font-size: 19px; line-height: 1.315789474; margin: 0 0 30px 0;"><a id="continue-button" href="${
                    emailData.inviteLink
                }" style="display:block;width:140px;padding:7px 10px 8px 10px;background-color:#00703c;border-bottom:2px solid #002d18;color:white;text-decoration:none;text-align: center">Continue</a></p>

                ${generateEmailParagraph(
                    `If the button does not work, use the link below or copy and paste it into your browser’s address bar.`,
                )}

                ${generateEmailParagraph(`<a href="${emailData.inviteLink}">${emailData.inviteLink}</a>`)}

                ${generateEmailParagraph(`Name or organisation details incorrect?`, 'noMargin')}

                ${generateEmailParagraph(`You can either email us: support@funding-service.ukri.org`, 'noMargin')}

                ${generateEmailParagraph(`Or call the UKRI Funding Service Helpline: +44 (0)1793 547 490`, 'noMargin')}

                ${generateEmailParagraph(`<hr>`)}`,
            );
        }
    }

    generateEmail(
        toAddresses: string[],
        emailData: InviteChampionEmailData,
        { sourceEmail, sourceDisplayName }: EmailConfigType,
    ): Email {
        return {
            html: this.generateHtml(emailData),
            text: this.generateText(emailData),
            subject: 'Your UKRI Funding Service Account',
            toAddresses,
            sourceEmail: sourceEmail,
            sourceDisplayName: sourceDisplayName,
        };
    }
    generateText(emailData: InviteChampionEmailData): string {
        return `Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},

        Administrator status has been applied to your UKRI Funding Services account.

        If you are a new user, you’ll need to create a password before signing in for the first time.

        Copy and paste the link below into your browser’s address bar.
        
        ${emailData.inviteLink}

        Name or organisation details incorrect? 
        You can either email us: support@funding-service.ukri.org
        Or call the UKRI Funding Service Helpline: +44 (0)1793 547 490`;
    }

    generateEmailPreview(
        toAddresses: string[],
        emailData: InviteChampionEmailData,
        { sourceEmail, sourceDisplayName }: EmailConfigType,
    ): Email {
        return {
            html: this.generateHtml(emailData),
            text: this.generateText(emailData),
            subject: 'Your UKRI Funding Service Account',
            toAddresses: toAddresses,
            sourceEmail: sourceEmail,
            sourceDisplayName: sourceDisplayName,
        };
    }
}
