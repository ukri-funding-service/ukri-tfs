import { Email } from '../email';
import {
    generateTemplatedEmail,
    generateEmailHeader,
    generateEmailParagraph,
    generateEmailH2Header,
    baseEmailText,
    generateEmailSignOffHtml,
    generateEmailSignOffText,
} from '../components';
import {
    Applicant,
    ApplicationEmailDataWithApplicant,
    ApplicantUnsuccessfulChecksEmailGeneratorData,
    ApplicationEmailData,
    EmailConfigType,
    EmailGenerator,
} from './data';

const emailText = {
    ...baseEmailText,

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

    getLeadApplicantParagraph: (leadApplicant?: Applicant) => `${leadApplicant?.firstName} ${leadApplicant?.lastName}`,

    getHeaderText: (emailData: ApplicantUnsuccessfulChecksEmailGeneratorData): string => {
        if (emailData.userType === 'Applicant') {
            return 'Your application for funding has not been successful';
        }

        return 'An application for funding from your organisation has not been successful';
    },

    getLinkHtml: (emailData: ApplicantUnsuccessfulChecksEmailGeneratorData): string => {
        if (emailData.userType === 'Applicant') {
            return generateEmailParagraph(
                `For more feedback, <a href=${emailData.applicationLink}>sign in to the Funding Service</a>`,
            );
        }

        return generateEmailParagraph(
            `For more information about why it was rejected <a href=${emailData.applicationLink}>sign in to the Funding Service</a>`,
        );
    },

    getLinkText: (emailData: ApplicantUnsuccessfulChecksEmailGeneratorData): string => {
        if (emailData.userType === 'Applicant') {
            return 'For more feedback, sign in to the Funding Service';
        }

        return 'For more information about why it was rejected sign in to the Funding Service';
    },
};

export class ApplicantUnsuccessfulChecksApplicationEmailGenerator extends EmailGenerator<ApplicationEmailData> {
    private subject = 'Your application has been unsuccessful - UKRI Funding Service';

    generateEmail(
        toAddresses: string[],
        emailData: ApplicationEmailDataWithApplicant,
        { sourceEmail, sourceDisplayName, applicationManagerUrl }: EmailConfigType,
    ): Email {
        const applicationLink = `${applicationManagerUrl}/applications/${emailData.application.applicationRef}`;
        return {
            html: this.generateHtml({ ...emailData, applicationLink }),
            text: this.generateText({ ...emailData, applicationLink }),
            subject: this.subject,
            toAddresses: toAddresses,
            sourceEmail: sourceEmail,
            sourceDisplayName: sourceDisplayName,
        };
    }

    generateHtml(emailData: ApplicantUnsuccessfulChecksEmailGeneratorData): string {
        return generateTemplatedEmail(
            this.subject,
            `

            ${generateEmailHeader(emailText.getHeaderText(emailData))}
            ${generateEmailParagraph(`Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},`)}

            ${generateEmailParagraph(
                'We regret to inform you that your application for funding will not be progressed to assessment. It did not pass our preliminary checks.',
            )}

            ${emailText.getLinkHtml(emailData)}

            ${generateEmailH2Header('Application')}
            ${generateEmailParagraph(emailText.getApplicationParagraph(emailData.application))}
            
            ${emailData.userType === 'ResearchOfficer' ? generateEmailH2Header('Lead applicant') : ''}
            ${
                emailData.userType === 'ResearchOfficer'
                    ? generateEmailParagraph(emailText.getLeadApplicantParagraph(emailData.leadApplicant))
                    : ''
            }
            
            ${generateEmailH2Header('Opportunity')}
            ${generateEmailParagraph(emailText.getOpportunityParagraph(emailData.application))}

            ${generateEmailParagraph('Thank you for taking the time to submit an application for this Opportunity.')}
            ${generateEmailParagraph(
                `We would appreciate your feedback on your experience so we can improve the Funding Service. Please fill out <a href="https://forms.office.com/e/KhmVCx49cz">anonymous survey (link)</a>`,
            )}
            ${generateEmailSignOffHtml()}`,
        );
    }
    generateText(emailData: ApplicantUnsuccessfulChecksEmailGeneratorData): string {
        return `${emailText.getHeaderText(emailData)}

        Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},

        We regret to inform you that your application for funding will not be progressed to assessment. It did not pass our preliminary checks.

        ${emailText.getLinkText(emailData)}
        
        Application
        ${emailText.getApplicationParagraph(emailData.application)}
        
        ${emailData.userType === 'ResearchOfficer' ? 'Lead applicant' : ''}
        ${emailData.userType === 'ResearchOfficer' ? emailText.getLeadApplicantParagraph(emailData.leadApplicant) : ''}
        
        Opportunity
        ${emailText.getOpportunityParagraph(emailData.application)}

        Thank you for taking the time to submit an application for this Opportunity.

        We would appreciate your feedback on your experience so we can improve the Funding Service. Please fill out anonymous survey (https://forms.office.com/e/KhmVCx49cz)

        ${generateEmailSignOffText()}`;
    }
}
