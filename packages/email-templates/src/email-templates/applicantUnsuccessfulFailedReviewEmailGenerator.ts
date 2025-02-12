import { Email } from '../email';
import {
    generateTemplatedEmail,
    generateEmailHeader,
    generateEmailParagraph,
    generateEmailH2Header,
    baseEmailText,
} from '../components';
import {
    EmailConfigType,
    EmailGenerator,
    ApplicationEmailData,
    ApplicationEmailDataWithReviewLinkAndApplicant,
    ApplicationEmailDataWithApplicant,
} from './data';

export class ApplicantUnsuccessfulFailedReviewEmailGenerator extends EmailGenerator<ApplicationEmailData> {
    private subject = 'UKRI Funding Service - Your application for funding was unsuccessful';

    private generateApplicantHtml(userType: 'ResearchOfficer' | 'Applicant', firstName?: string, lastName?: string) {
        if (userType === 'Applicant' || !firstName || !lastName) return '';

        const name = `${firstName} ${lastName}`;
        return `${generateEmailH2Header('Applicant')}
        ${generateEmailParagraph(name)}`;
    }

    private generateApplicantText(userType: 'ResearchOfficer' | 'Applicant', firstName?: string, lastName?: string) {
        if (userType === 'Applicant' || !firstName || !lastName) return [];

        return ['Applicant', `${firstName} ${lastName}`, ''];
    }

    generateHtml(emailData: ApplicationEmailDataWithReviewLinkAndApplicant): string {
        return generateTemplatedEmail(
            this.subject,
            `
            <br />
            ${generateEmailHeader(emailText.getUnsuccessfulDecisionHeading)}
            ${generateEmailParagraph(`Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},`)}

      ${generateEmailParagraph('Unfortunately your application will not progress further than expert review.')}

      ${generateEmailParagraph(
          `Your reviews are now available to read by signing in to The Funding Service at <a href=${emailData.reviewLink}>${emailData.reviewLink}</a>.`,
      )}
      
      ${generateEmailParagraph(
          'We look at all reviews and scores thoroughly during the application process. We will not be able to provide any further feedback on your application.',
      )}          

      ${this.generateApplicantHtml(
          emailData.userType,
          emailData.leadApplicant?.firstName,
          emailData.leadApplicant?.lastName,
      )}

      ${generateEmailH2Header('Application')}
      ${generateEmailParagraph(emailText.getApplicationParagraph(emailData.application))}            
      
      ${generateEmailH2Header('Opportunity')}
      ${generateEmailParagraph(emailText.getOpportunityParagraph(emailData.application))}

      ${generateEmailParagraph('Thank you for taking the time to submit an application for this Opportunity.')}
      ${generateEmailParagraph(
          'We would appreciate your feedback on your experience so we can improve the Funding Service. Please fill out <a href="https://forms.office.com/e/KhmVCx49cz">anonymous survey (link)</a>',
      )};
      
      ${generateEmailParagraph('Kind regards,', 'noMargin')}
            
      ${generateEmailParagraph('The UKRI Funding Service', 'noMargin')}
      ${generateEmailParagraph(emailText.email, 'noMargin')}
      ${generateEmailParagraph(emailText.telephone, 'noMargin')}
      </br>
      ${generateEmailParagraph(emailText.automatedMessage)}
      `,
        );
    }

    generateText(emailData: ApplicationEmailDataWithReviewLinkAndApplicant): string {
        return [
            emailText.getUnsuccessfulDecisionHeading,
            '',
            `Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},`,
            '',
            'Unfortunately your application will not progress further than expert review.',
            '',
            `Your reviews are now available to read by signing in to The Funding Service at ${emailData.reviewLink}.`,
            '',
            'We look at all reviews and scores thoroughly during the application process. We will not be able to provide any further feedback on your application.',
            '',
            ...this.generateApplicantText(
                emailData.userType,
                emailData.leadApplicant?.firstName,
                emailData.leadApplicant?.lastName,
            ),
            'Application',
            emailText.getApplicationParagraph(emailData.application),
            '',
            'Opportunity',
            emailText.getOpportunityParagraph(emailData.application),
            '',
            'Thank you for taking the time to submit an application for this Opportunity.',
            '',
            'We would appreciate your feedback on your experience so we can improve the Funding Service. Please fill out <a href="https://forms.office.com/e/KhmVCx49cz">anonymous survey (link)</a>',
            '',
            'Kind regards,',
            'The UKRI Funding Service',
            emailText.email,
            emailText.telephone,
            '',
            emailText.automatedMessage,
        ].join('\r');
    }

    generateEmail(
        toAddresses: string[],
        emailData: ApplicationEmailDataWithApplicant,
        { sourceEmail, sourceDisplayName, applicationManagerUrl }: EmailConfigType,
    ): Email {
        const reviewLink = `${applicationManagerUrl}/applications/${emailData.application.applicationRef}?tab=reviewsTab`;

        return {
            html: this.generateHtml({ ...emailData, reviewLink }),
            text: this.generateText({ ...emailData, reviewLink }),
            subject: this.subject,
            toAddresses: toAddresses,
            sourceEmail: sourceEmail,
            sourceDisplayName: sourceDisplayName,
        };
    }
}

const emailText = {
    ...baseEmailText,
    getUnsuccessfulDecisionHeading: 'Your application for funding was unsuccessful',
    getApplicationParagraph: ({
        applicationName,
        applicationRef,
    }: {
        applicationName: string;
        applicationRef: string;
    }) => `${applicationRef}: ${applicationName}`,
    getOpportunityParagraph: ({
        opportunityName,
        opportunityRef,
    }: {
        opportunityName: string;
        opportunityRef: string;
    }) => `${opportunityRef}: ${opportunityName}`,
};
