import {
    generateEmailHeader,
    generateEmailParagraph,
    generateTemplatedEmail,
    generateRoleSpecificHtml,
    generateRoleSpecificText,
} from '../components';
import { EmailConfigType, EmailGenerator, InvitePanelMemberEmailData } from './data';
import { DateTimeFormat, formatIsoDateTimeString } from '@ukri-tfs/time';
import { Email } from '../email';

const generateHtmlSpacing = (count: number): string => {
    return `<br />`.repeat(count);
};

type FormattedMeetingTimes = {
    startTime: string;
    endTime: string;
    meetingDate: string;
};

const formatMeetingTimes = (emailData: InvitePanelMemberEmailData): FormattedMeetingTimes => {
    const meetingStartTime = new Date(emailData.meetingStartTime);
    return {
        startTime: formatIsoDateTimeString(meetingStartTime.toISOString(), DateTimeFormat.TimeWithAmPm),
        endTime: formatIsoDateTimeString(new Date(emailData.meetingEndTime).toISOString(), DateTimeFormat.TimeWithAmPm),
        meetingDate: formatIsoDateTimeString(meetingStartTime.toISOString(), DateTimeFormat.DateWithMonthName),
    };
};
export class InvitePanelMemberEmailGenerator extends EmailGenerator<InvitePanelMemberEmailData> {
    generateHtml(emailData: InvitePanelMemberEmailData): string {
        const formattedMeetingTimes = formatMeetingTimes(emailData);
        return generateTemplatedEmail(
            `Invitation to panel: ${emailData.panelDisplayId}: ${emailData.panelName}`,
            `
                                ${generateHtmlSpacing(4)}
                                ${generateEmailParagraph(
                                    `Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},`,
                                )}
                                ${generateEmailParagraph(
                                    `You've been invited to take part in an upcoming panel meeting.`,
                                )}
                                ${generateEmailHeader(`Panel name`)}
                                ${generateEmailParagraph(`${emailData.panelDisplayId}: ${emailData.panelName}`)}
                                ${generateEmailHeader(`Panel date and time`)}
                                ${generateEmailParagraph(formattedMeetingTimes.meetingDate, 'noMargin')}
                                ${generateEmailParagraph(
                                    `${formattedMeetingTimes.startTime} to ${formattedMeetingTimes.endTime}`,
                                )}
                                ${generateEmailHeader(`What you need to do now`)}

                                ${generateRoleSpecificHtml(
                                    emailData.memberRole,
                                    {
                                        inviteLink: emailData.inviteLink,
                                        invitee: {
                                            firstName: emailData.recipient.firstName!,
                                            lastName: emailData.recipient.lastName!,
                                        },
                                    },
                                    emailData.prescoreCommentsRequired,
                                )}

                                ${generateEmailParagraph(`Thank you.`)}

                                ${generateEmailParagraph(`The UKRI Funding Service`, 'noMargin')}
                                ${generateEmailParagraph(`Telephone: 01793 547490`, 'noMargin')}
                                ${generateEmailParagraph(`Email: support@funding-service.ukri.org`, 'noMargin')}`,
        );
    }

    generateEmail(
        toAddresses: string[],
        emailData: InvitePanelMemberEmailData,
        { sourceEmail, sourceDisplayName }: EmailConfigType,
    ): Email {
        return {
            html: this.generateHtml(emailData),
            text: this.generateText(emailData),
            subject: `Invitation to panel: ${emailData.panelDisplayId}: ${emailData.panelName}`,
            toAddresses,
            sourceEmail: sourceEmail,
            sourceDisplayName: sourceDisplayName,
        };
    }

    generateText(emailData: InvitePanelMemberEmailData): string {
        const formattedMeetingTimes = formatMeetingTimes(emailData);
        return `Dear ${emailData.recipient.firstName} ${emailData.recipient.lastName},
        You've been invited to take part in an upcoming panel meeting.

        Panel name
        ${emailData.panelDisplayId}: ${emailData.panelName}

        Panel date and time
        ${formattedMeetingTimes.meetingDate}
        ${formattedMeetingTimes.startTime} to ${formattedMeetingTimes.endTime}

        What you need to do now

        ${generateRoleSpecificText(
            emailData.memberRole,
            {
                inviteLink: emailData.inviteLink,
                invitee: { firstName: emailData.recipient.firstName!, lastName: emailData.recipient.lastName! },
            },
            emailData.prescoreCommentsRequired,
        )}

        Thank you.

        The UKRI Funding Service
        Telephone: 01793 547490
        Email: support@funding-service.ukri.org`;
    }
}
