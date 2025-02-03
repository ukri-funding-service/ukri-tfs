import {
    generateEmailHeader,
    generateEmailParagraph,
    generateEmailSignOffHtml,
    generateEmailSignOffText,
    generateTemplatedEmail,
} from '../components';
import { Email } from '../email';
import {
    Applicant,
    Application,
    ApplicationSentToResearchOfficeEmailData as ApplicationSentToResearchOfficeEmailData,
    ApplicationSentToResearchOfficeEmailGeneratorData,
    EmailConfigType,
    EmailGenerator,
} from './data';
export class ApplicationSentToResearchOfficeEmailGenerator extends EmailGenerator<ApplicationSentToResearchOfficeEmailData> {
    private subjectText = `You've received an application for submission to UKRI - UKRI Funding Service`;
    private headerText = `Your research office has received an application for submission to UKRI`;
    private emailText = {
        getOpportunityText: (application: Application) =>
            `${application.opportunityRef}: ${application.opportunityName}`,
        getApplicationText: (application: Application) =>
            `${application.applicationRef}: ${application.applicationName}`,
        getSubmissionDeadlineText: (closingTime: string) => `${closingTime}`,
        getOpeningText: (applicant: Applicant) =>
            `${applicant.firstName} ${applicant.lastName} has sent an application for you to submit to UKRI.`,
    };

    generateEmail(
        toAddresses: string[],
        emailData: ApplicationSentToResearchOfficeEmailData,
        { sourceEmail, sourceDisplayName, applicationManagerUrl }: EmailConfigType,
    ): Email {
        const applicationLink = `${applicationManagerUrl}/applications/${emailData.application.applicationRef}`;
        return {
            html: this.generateHtml({ ...emailData, applicationLink }),
            text: this.generateText({ ...emailData, applicationLink }),
            subject: this.subjectText,
            toAddresses,
            sourceEmail: sourceEmail,
            sourceDisplayName: sourceDisplayName,
        };
    }

    generateHtml(emailData: ApplicationSentToResearchOfficeEmailGeneratorData): string {
        return generateTemplatedEmail(
            this.subjectText,
            `
            ${generateEmailHeader(this.headerText)}
            ${generateEmailParagraph(this.emailText.getOpeningText(emailData.applicant))}

            ${generateEmailParagraph('<strong>Application</strong>', 'noMargin')}
            ${generateEmailParagraph(
                `<a href=${emailData.applicationLink}>${this.emailText.getApplicationText(emailData.application)}</a>`,
            )}

            ${generateEmailParagraph('<strong>Opportunity</strong>', 'noMargin')}
            ${generateEmailParagraph(this.emailText.getOpportunityText(emailData.application))}

            ${generateEmailParagraph('<strong>Submission deadline</strong>', 'noMargin')}
            ${generateEmailParagraph(this.emailText.getSubmissionDeadlineText(emailData.opportunityCloseTime))}

            ${generateEmailParagraph(
                `If the application requires further editing, you can either make the changes yourself or return it to draft so that the applicant can work on it.`,
            )}

            ${generateEmailSignOffHtml()}`,
        );
    }

    generateText(emailData: ApplicationSentToResearchOfficeEmailGeneratorData): string {
        return `
${this.headerText}

${this.emailText.getOpeningText(emailData.applicant)}

Application
${this.emailText.getApplicationText(emailData.application)}

Opportunity
${this.emailText.getOpportunityText(emailData.application)}

Submission deadline
${this.emailText.getSubmissionDeadlineText(emailData.opportunityCloseTime)}

If the application requires further editing, you can either make the changes yourself or return it to draft so that the applicant can work on it.

${generateEmailSignOffText()}`;
    }
}
