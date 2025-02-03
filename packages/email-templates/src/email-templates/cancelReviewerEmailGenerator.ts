import {
    defaultHtmlCleanOptionsWithInnerText,
    htmlClean,
    simpleRichTextEditorCleanOptions,
} from '@ukri-tfs/html-utils';
import {
    baseEmailText,
    generateEmailParagraph,
    generateTemplatedEmail,
    generateTemplatedEmailPreview,
} from '../components';
import { Email } from '../email';
import { CancelReviewerEmailData, EmailConfigType, PreviewableEmailGenerator } from './data';

export class CancelReviewerEmailGenerator extends PreviewableEmailGenerator<CancelReviewerEmailData> {
    private subject = 'UKRI Funding Service - review invitation cancelled';

    private emailText = {
        ...baseEmailText,
        opening: `We've cancelled your invitation to review`,
        reason: 'This could be for several reasons. For example, the deadline has passed.',
        action: `You do not need to do anything. We'll contact you if there are applications we'd like you to review in the future.`,
    };

    generateEmail(toAddresses: string[], emailData: CancelReviewerEmailData, emailConfig: EmailConfigType): Email {
        return {
            html: this.generateHtml(emailData),
            text: this.generateText(emailData),
            subject: this.subject,
            toAddresses: toAddresses,
            sourceEmail: emailConfig.sourceEmail,
            sourceDisplayName: emailConfig.sourceDisplayName,
        };
    }

    getSignOffHtml = (): string => {
        return `
            ${generateEmailParagraph('From', 'noMargin')}
            ${generateEmailParagraph(this.emailText.fundingService, 'noMargin')}
            ${generateEmailParagraph(this.emailText.email, 'noMargin')}
            ${generateEmailParagraph(this.emailText.telephone)}
    
            ${generateEmailParagraph(this.emailText.automatedMessage, 'noMargin')}
        `;
    };

    generateHtml = (emailData: CancelReviewerEmailData, previewMode = false): string => {
        const cleanData = htmlClean(emailData, simpleRichTextEditorCleanOptions);

        return this.emailShell(
            previewMode,
            `
            ${generateEmailParagraph(this.emailText.getDearLine(cleanData.firstName, cleanData.lastName))}
            ${generateEmailParagraph(`${this.emailText.opening} ${cleanData.applicationName}.`)}
            ${generateEmailParagraph(this.emailText.reason)}
            ${generateEmailParagraph(this.emailText.action)}
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
            'UKRI Funding Service - review invitation cancelled',
            `
            ${contents}
            ${signOff}
            `,
        );
    };

    generateText = (emailData: CancelReviewerEmailData): string => {
        const cleanData = htmlClean(emailData, defaultHtmlCleanOptionsWithInnerText);

        return `${this.emailText.getDearLine(cleanData.firstName, cleanData.lastName)}
            
            ${this.emailText.opening} ${cleanData.applicationName}.
    
            ${this.emailText.action}
    
            ${this.emailText.reason}
            
            From
            ${this.emailText.fundingService}
            ${this.emailText.telephone}
            ${this.emailText.email}`;
    };

    generateEmailPreview(
        toAddresses: string[],
        emailData: CancelReviewerEmailData,
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
