import {
    defaultHtmlCleanOptionsWithInnerText,
    htmlClean,
    simpleRichTextEditorCleanOptions,
} from '@ukri-tfs/html-utils';
import { DateTimeFormat, formatIsoDateTimeString } from '@ukri-tfs/time';
import {
    baseEmailText,
    generateEmailHeader,
    generateEmailParagraph,
    generateEmailStrongHeader,
    generateTemplatedEmail,
    generateTemplatedEmailPreview,
} from '../components';
import { Email } from '../email';
import {
    EmailConfigType,
    PreviewableEmailGenerator,
    ReviewReminderEmailData,
    ReviewReminderEmailTemplateData,
} from './data';

export class ReviewReminderEmailGenerator extends PreviewableEmailGenerator<ReviewReminderEmailData> {
    private subject = 'UKRI Funding Service - reminder to review';

    private emailText = {
        ...baseEmailText,
        emailTitle: 'Your review is due soon',
    };

    generateEmail(
        toAddresses: string[],
        emailData: ReviewReminderEmailTemplateData,
        { sourceEmail, sourceDisplayName }: EmailConfigType,
    ): Email {
        return {
            html: this.generateHtml(emailData),
            text: this.generateText(emailData),
            subject: this.subject,
            toAddresses: toAddresses,
            sourceEmail: sourceEmail,
            sourceDisplayName: sourceDisplayName,
        };
    }

    formatDate = (date: Date): string => {
        return formatIsoDateTimeString(new Date(date).toISOString(), DateTimeFormat.DateWithMonthName);
    };

    getSignOffHtml = (): string => `
            ${generateEmailParagraph(this.emailText.signOff)}
            
            ${generateEmailParagraph(this.emailText.getCouncilList(['UKRI']), 'noMargin')}
            ${generateEmailParagraph(this.emailText.email, 'noMargin')}
            ${generateEmailParagraph(this.emailText.telephone, 'noMargin')}
            <br />
            ${generateEmailParagraph(this.emailText.automatedMessage)}
        `;

    generateHtml = (emailData: ReviewReminderEmailTemplateData, previewMode = false): string => {
        const reviewDeadline = this.formatDate(new Date(emailData.reviewDeadline));
        const cleanData = htmlClean<ReviewReminderEmailTemplateData>(emailData, simpleRichTextEditorCleanOptions);

        return this.emailShell(
            previewMode,
            `
            ${generateEmailHeader(this.emailText.emailTitle)}

            ${generateEmailParagraph(
                this.emailText.getDearLine(cleanData.recipient.firstName!, cleanData.recipient.lastName!),
            )}

            ${generateEmailParagraph(`Your review of the below application is due on ${reviewDeadline}.`)}
            ${generateEmailStrongHeader('Opportunity', 'noMargin')}
            ${generateEmailParagraph(`${cleanData.opportunityDisplayId}: ${cleanData.opportunityName}`)}
            ${generateEmailStrongHeader('Application', 'noMargin')}
            ${generateEmailParagraph(`${cleanData.applicationDisplayId}: ${cleanData.applicationName}`)}
            ${generateEmailParagraph(
                `You can complete your review via <a href="${cleanData.reviewUrl}">The Funding Service</a>.`,
            )}
            `,
            this.getSignOffHtml(),
        );
    };

    emailShell = (previewMode: boolean, contents: string, signOff: string): string => {
        if (previewMode) {
            return generateTemplatedEmailPreview(`
            ${contents}
            ${signOff}
            `);
        }
        return generateTemplatedEmail(
            'Reminder to review', //should be subject line instead
            `
            ${contents}
            ${signOff}
            `,
        );
    };

    generateText = (emailData: ReviewReminderEmailTemplateData): string => {
        const cleanData = htmlClean(emailData, defaultHtmlCleanOptionsWithInnerText);

        const reviewDeadline = this.formatDate(new Date(emailData.reviewDeadline));

        return `
            ${this.emailText.emailTitle}
            
            ${this.emailText.getDearLine(cleanData.recipient.firstName!, cleanData.recipient.lastName!)}
            
            Your review of the below application is due on ${reviewDeadline}.
            
            Opportunity
            ${cleanData.opportunityDisplayId}: ${cleanData.opportunityName}
            Application
            ${cleanData.applicationDisplayId}: ${cleanData.applicationName}

            You can complete your review via ${cleanData.reviewUrl}.

            ${this.emailText.signOff}
    
            ${this.emailText.getCouncilList(['UKRI'])}
            ${this.emailText.email}
            ${this.emailText.telephone}
            
            ${this.emailText.automatedMessage}`;
    };

    generateEmailPreview(
        toAddresses: string[],
        emailData: ReviewReminderEmailTemplateData,
        { sourceEmail, sourceDisplayName }: EmailConfigType,
    ): Email {
        return {
            html: this.generateHtml(emailData, true),
            text: this.generateText(emailData),
            subject: this.subject,
            toAddresses: toAddresses,
            sourceEmail: sourceEmail,
            sourceDisplayName: sourceDisplayName,
        };
    }
}
