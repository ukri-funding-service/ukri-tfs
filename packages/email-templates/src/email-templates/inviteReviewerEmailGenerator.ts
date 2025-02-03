import {
    defaultHtmlCleanOptionsWithInnerText,
    htmlClean,
    simpleRichTextEditorCleanOptions,
} from '@ukri-tfs/html-utils';
import { DateTimeFormat, formatIsoDateTimeString } from '@ukri-tfs/time';
import {
    baseEmailText,
    generateEmailStrongHeader,
    generateEmailParagraph,
    generateEmailSignOffHtml,
    generateEmailSignOffText,
    generateTemplatedEmail,
    inviteReviewerEmailText,
} from '../components';
import { Email } from '../email';
import { Applicant, EmailConfigType, InviteReviewerEmailTemplateData, PreviewableEmailGenerator } from './data';

const subjectText = (emailData: InviteReviewerEmailTemplateData) => {
    return `UKRI Funding Service - invitation to review a funding application ${emailData.applicationDisplayId}: ${emailData.applicationName}`;
};

export class InviteReviewerEmailGenerator extends PreviewableEmailGenerator<InviteReviewerEmailTemplateData> {
    private emailText = {
        ...baseEmailText,
        ...inviteReviewerEmailText,
        subjectText,
    };

    generateEmail(
        toAddresses: string[],
        emailData: InviteReviewerEmailTemplateData,
        { sourceEmail, sourceDisplayName }: EmailConfigType,
    ): Email {
        return {
            html: this.generateHtml(emailData),
            text: this.generateText(emailData),
            subject: subjectText(emailData),
            toAddresses: toAddresses,
            sourceEmail: sourceEmail,
            sourceDisplayName: sourceDisplayName,
        };
    }

    formatDate = (date: Date): string => {
        return formatIsoDateTimeString(new Date(date).toISOString(), DateTimeFormat.DateWithMonthName);
    };

    generateTeamList = (applicants: Applicant[], withTags: boolean): string => {
        return applicants.reduce((text, teamMember) => {
            const organisationString = teamMember.organisation ?? 'No Organisation';
            return (
                text +
                (withTags
                    ? `<li>${teamMember.firstName} ${teamMember.lastName}, ${organisationString} - <strong>${teamMember.role}</strong></li>`
                    : `${teamMember.firstName} ${teamMember.lastName}, ${organisationString} - ${teamMember.role}`)
            );
        }, '');
    };

    generateHtml = (emailData: InviteReviewerEmailTemplateData): string => {
        const cleanData = htmlClean(emailData, simpleRichTextEditorCleanOptions);

        const teamList = this.generateTeamList(cleanData.applicants, true);

        const contents = `${generateEmailParagraph(
            this.emailText.getDearLine(cleanData.recipient.firstName!, cleanData.recipient.lastName!),
        )}
            ${generateEmailParagraph(`${this.emailText.opening}`)}

            ${generateEmailStrongHeader('Opportunity', 'noMargin')}
            ${generateEmailParagraph(`${cleanData.opportunityDisplayId}: ${cleanData.opportunityName}`)}

            ${generateEmailStrongHeader('Application', 'noMargin')}
            ${generateEmailParagraph(`${cleanData.applicationDisplayId}: ${cleanData.applicationName}`)}

            ${generateEmailStrongHeader('Application summary', 'noMargin')}
            ${generateEmailParagraph(cleanData.applicationSummary)}

            ${generateEmailStrongHeader(`Application team`, 'noMargin')}
            <ul class="govuk-list govuk-list--bullet">${teamList}</ul>

            ${generateEmailStrongHeader(`What happens next`)}

            ${generateEmailParagraph(this.emailText.whatHappensNext[0])}

            ${generateEmailParagraph(this.emailText.whatHappensNext[1])}

            ${generateEmailStrongHeader(`How long do I have to complete my review?`)}

            ${generateEmailParagraph(this.emailText.reviewDeadline[0])}

            ${generateEmailParagraph(this.emailText.reviewDeadline[1])}
            <ul class="govuk-list govuk-list--bullet">
                <li>AHRC: <a href="mailto:operations@ahrc.ukri.org">operations@ahrc.ukri.org</a></li>
                <li>BBSRC: <a href="mailto:peer.review@bbsrc.ukri.org">peer.review@bbsrc.ukri.org</a></li>
                <li>EPSRC: <a href="mailto:grants@epsrc.ukri.org">grants@epsrc.ukri.org</a></li>
                <li>ESRC: <a href="mailto:ESRCpeerreview@esrc.ukri.org">ESRCpeerreview@esrc.ukri.org</a></li>
                <li>MRC: <a href="mailto:peer.review@mrc.ukri.org">peer.review@mrc.ukri.org</a></li>
                <li>NERC: <a href="mailto:researchgrants@nerc.ukri.org">researchgrants@nerc.ukri.org</a></li>
                <li>STFC: <a href="mailto:grantspolicy@stfc.ukri.org">grantspolicy@stfc.ukri.org</a></li>
            </ul>

            ${generateEmailParagraph(this.emailText.notSureWhoToContactText)}

            ${generateEmailStrongHeader(`What is an expert reviewer?`)}

            ${generateEmailParagraph(this.emailText.whatIsExpertReviewer[0])}

            ${generateEmailParagraph(this.emailText.whatIsExpertReviewer[1])}

            ${generateEmailParagraph(this.emailText.whatIsExpertReviewer[2])}

            ${generateEmailParagraph(this.emailText.whatIsExpertReviewer[3])}

            ${generateEmailStrongHeader(`Let us know if you can review this application`)}

            ${generateEmailParagraph(
                `${this.emailText.letUsKnow[0]} <a href="${cleanData.urlLink}">${cleanData.urlLink}</a>`,
            )}

            ${generateEmailParagraph(this.emailText.letUsKnow[1])}

            ${generateEmailParagraph(this.emailText.letUsKnow[2])}

            ${generateEmailParagraph(this.emailText.letUsKnow[3])}

            ${generateEmailSignOffHtml()}`;

        return generateTemplatedEmail(
            this.emailText.subjectText(emailData),
            `
            ${contents}`,
        );
    };

    generateText = (emailData: InviteReviewerEmailTemplateData): string => {
        const cleanData = htmlClean(emailData, defaultHtmlCleanOptionsWithInnerText);

        const teamList = this.generateTeamList(cleanData.applicants, false);

        return `${this.emailText.getDearLine(cleanData.recipient.firstName!, cleanData.recipient.lastName!)}

            ${this.emailText.opening}

            Opportunity
            ${cleanData.opportunityDisplayId}: ${cleanData.opportunityName}

            Application
            ${cleanData.applicationDisplayId}: ${cleanData.applicationName}

            Application summary
            ${cleanData.applicationSummary}

            Application team
            ${teamList}

            What happens next

            ${this.emailText.whatHappensNext[0]}

            ${this.emailText.whatHappensNext[1]}

            How long do I have to complete my review?

            ${this.emailText.reviewDeadline[0]}

            ${this.emailText.reviewDeadline[1]}
            
            AHRC: operations@ahrc.ukri.org

            BBSRC: peer.review@bbsrc.ukri.org

            EPSRC: grants@epsrc.ukri.org

            ESRC: ESRCpeerreview@esrc.ukri.org

            MRC: peer.review@mrc.ukri.org

            NERC: researchgrants@nerc.ukri.org

            STFC: grantspolicy@stfc.ukri.org

            ${this.emailText.notSureWhoToContactText}

            What is an expert reviewer?

            ${this.emailText.whatIsExpertReviewer[0]}

            ${this.emailText.whatIsExpertReviewer[1]}

            ${this.emailText.whatIsExpertReviewer[2]}

            ${this.emailText.whatIsExpertReviewer[3]}

            Let us know if you can review this application

            ${`${this.emailText.letUsKnow[0]} ${cleanData.urlLink}`}

            ${this.emailText.letUsKnow[1]}

            ${this.emailText.letUsKnow[2]}

            ${this.emailText.letUsKnow[3]}

            ${generateEmailSignOffText()}`;
    };

    generateEmailPreview(
        toAddresses: string[],
        emailData: InviteReviewerEmailTemplateData,
        { sourceEmail, sourceDisplayName }: EmailConfigType,
    ): Email {
        return {
            html: this.generateHtml(emailData),
            text: this.generateText(emailData),
            subject: subjectText(emailData),
            toAddresses: toAddresses,
            sourceEmail: sourceEmail,
            sourceDisplayName: sourceDisplayName,
        };
    }
}
