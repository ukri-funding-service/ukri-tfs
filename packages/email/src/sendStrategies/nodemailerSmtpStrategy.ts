import { SendStrategy } from './sendStrategy';
import { Email } from '../email';
import { createTransport, Transporter, SentMessageInfo, SendMailOptions } from 'nodemailer';

export interface NodemailerSmtpOptions {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

type StrategySpecificMailOptions = SendMailOptions;
type StrategySpecificServerResponse = SentMessageInfo;

/**
 * Implementation of a send strategy using Nodemailer SMTP to be used within an Email Service
 * https://nodemailer.com/
 */
export class NodemailerSmtpSendStrategy
    implements SendStrategy<StrategySpecificMailOptions, StrategySpecificServerResponse>
{
    private transporter: Transporter;

    constructor(nodemailerOptions: NodemailerSmtpOptions) {
        this.transporter = createTransport(nodemailerOptions);
    }

    convertEmailToStrategySpecificEmail(email: Email): StrategySpecificMailOptions {
        // mandatory options
        const options = {
            from: `${email.sourceDisplayName} <${email.sourceEmail}>`,
            to: email.toAddresses.join(', '),
            subject: email.subject,
            text: email.text,
            html: email.html,
        } as StrategySpecificMailOptions;

        // optional
        if (email.ccAddresses) options.cc = email.ccAddresses.join(', ');
        if (email.bccAddresses) options.bcc = email.bccAddresses.join(', ');
        if (email.replyToAddresses) options.replyTo = email.replyToAddresses.join(', ');

        return options;
    }

    async send(email: StrategySpecificMailOptions): Promise<StrategySpecificServerResponse> {
        return this.transporter.sendMail(email);
    }
}
