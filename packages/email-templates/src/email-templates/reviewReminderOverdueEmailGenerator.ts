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
    ReviewReminderOverdueEmailData,
    ReviewReminderOverdueEmailTemplateData,
} from './data';

export class ReviewReminderOverdueEmailGenerator extends PreviewableEmailGenerator<ReviewReminderOverdueEmailData> {
    private subject = 'UKRI Funding Service - reminder to review';

    private emailText = {
        ...baseEmailText,
        emailTitle: 'Your review is overdue',
    };

    generateEmail(
        toAddresses: string[],
        emailData: ReviewReminderOverdueEmailTemplateData,
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

    generateHtml = (emailData: ReviewReminderOverdueEmailTemplateData, previewMode = false): string => {
        const reviewDeadline = this.formatDate(new Date(emailData.reviewDeadline));
        const cleanData = htmlClean<ReviewReminderOverdueEmailTemplateData>(
            emailData,
            simpleRichTextEditorCleanOptions,
        );

        return this.emailShell(
            previewMode,
            `
            ${generateEmailHeader(this.emailText.emailTitle)}

            ${generateEmailParagraph(
                this.emailText.getDearLine(cleanData.recipient.firstName!, cleanData.recipient.lastName!),
            )}

            ${generateEmailParagraph(
                `Your review of ${cleanData.applicationName} is ${cleanData.daysOverdue} days overdue.`,
            )}

            ${generateEmailParagraph(`The review was due on ${reviewDeadline}.`)}
            ${generateEmailStrongHeader('Opportunity', 'noMargin')}
            ${generateEmailParagraph(`${cleanData.opportunityDisplayId}: ${cleanData.opportunityName}`)}
            ${generateEmailStrongHeader('Application', 'noMargin')}
            ${generateEmailParagraph(`${cleanData.applicationDisplayId}: ${cleanData.applicationName}`)}
            
            ${generateEmailParagraph(
                `You can still complete your review via <a href="${cleanData.reviewUrl}">The Funding Service</a>.`,
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

    generateText = (emailData: ReviewReminderOverdueEmailTemplateData): string => {
        const cleanData = htmlClean(emailData, defaultHtmlCleanOptionsWithInnerText);

        const reviewDeadline = this.formatDate(new Date(emailData.reviewDeadline));

        return `
            ${this.emailText.emailTitle}

            ${this.emailText.getDearLine(cleanData.recipient.firstName!, cleanData.recipient.lastName!)}

            
            ${`Your review of ${cleanData.applicationName} is ${cleanData.daysOverdue} days overdue.`}

            ${`The review was due on ${reviewDeadline}.`}
 
            Opportunity
            ${cleanData.opportunityDisplayId}: ${cleanData.opportunityName}
            Application
            ${cleanData.applicationDisplayId}: ${cleanData.applicationName}
            
            ${`You can still complete your review via ${cleanData.reviewUrl}.`}

            ${this.emailText.signOff}
    
            ${this.emailText.getCouncilList(['UKRI'])}
            ${this.emailText.email}
            ${this.emailText.telephone}
            
            ${this.emailText.automatedMessage}`;
    };

    generateEmailPreview(
        toAddresses: string[],
        emailData: ReviewReminderOverdueEmailTemplateData,
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
