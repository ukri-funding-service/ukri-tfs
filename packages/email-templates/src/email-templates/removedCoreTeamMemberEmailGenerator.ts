import {
    defaultHtmlCleanOptionsWithInnerText,
    htmlClean,
    simpleRichTextEditorCleanOptions,
} from '@ukri-tfs/html-utils';
import {
    generateEmailHeader,
    generateEmailParagraph,
    generateTemplatedEmail,
    generateEmailSignOffHtml,
    generateEmailSignOffText,
} from '../components';
import { Email } from '../email';
import { RemovedCoreTeamMemberEmailData, EmailConfigType, EmailGenerator } from './data';

export class RemovedCoreTeamMemberEmailGenerator extends EmailGenerator<RemovedCoreTeamMemberEmailData> {
    private subject = `UKRI Funding Service - You've been removed from the team that's applying for a UKRI funding Opportunity`;

    generateEmail(
        toAddresses: string[],
        emailData: RemovedCoreTeamMemberEmailData,
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

    generateHtml = (emailData: RemovedCoreTeamMemberEmailData): string => {
        const cleanEmailData = htmlClean(emailData, simpleRichTextEditorCleanOptions);

        return generateTemplatedEmail(
            this.subject,
            `
                                    ${generateEmailHeader(
                                        `You've been removed from the team that's applying for a UKRI funding Opportunity`,
                                    )}
                                    ${generateEmailParagraph(
                                        `Dear ${cleanEmailData.coreTeamMember.firstName} ${cleanEmailData.coreTeamMember.lastName},`,
                                    )}
                                    ${generateEmailParagraph(
                                        `You've been removed as the ${cleanEmailData.coreTeamMember.role} by ${cleanEmailData.applicationOwner.firstName} ${cleanEmailData.applicationOwner.lastName} who is the ${cleanEmailData.applicationOwner.role} on the application team.`,
                                    )}
                                    ${generateEmailParagraph(
                                        `<strong>Opportunity you've been removed from</strong><br>${cleanEmailData.application.opportunityRef}: ${cleanEmailData.application.opportunityName}`,
                                    )}
                                    ${generateEmailParagraph(
                                        `<strong>Application you've been removed from</strong><br>${cleanEmailData.application.applicationRef}: ${cleanEmailData.application.applicationName}`,
                                    )}
                                    ${generateEmailParagraph(
                                        `If you have any questions, email ${cleanEmailData.applicationOwner.firstName} ${cleanEmailData.applicationOwner.lastName} at ${cleanEmailData.applicationOwner.email}`,
                                    )}
            ${generateEmailSignOffHtml()}
        `,
        );
    };

    generateText = (emailData: RemovedCoreTeamMemberEmailData): string => {
        const cleanEmailData = htmlClean(emailData, defaultHtmlCleanOptionsWithInnerText);
        return `You've been removed from the team that's applying for a UKRI funding Opportunity
    
            Dear ${cleanEmailData.coreTeamMember.firstName} ${cleanEmailData.coreTeamMember.lastName},
    
            You've been removed as the ${cleanEmailData.coreTeamMember.role} by ${
            cleanEmailData.applicationOwner.firstName
        } ${cleanEmailData.applicationOwner.lastName} who is the ${
            cleanEmailData.applicationOwner.role
        } on the application team.
    
    
            Opportunity you've been removed from
            ${cleanEmailData.application.opportunityRef}: ${cleanEmailData.application.opportunityName}
    
            Application you've been removed from
            ${cleanEmailData.application.applicationRef}: ${cleanEmailData.application.applicationName}
    
            If you have any questions, email ${cleanEmailData.applicationOwner.firstName} ${
            cleanEmailData.applicationOwner.lastName
        } at ${cleanEmailData.applicationOwner.email}
    
            ${generateEmailSignOffText()}`;
    };
}
