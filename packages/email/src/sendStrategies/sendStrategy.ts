import { Email } from '../email';

/**
 * Generic Send Strategy that each send strategy must implement to be used in an Email Service.
 */
export interface SendStrategy<MailOptionType, ServerResponseType> {
    convertEmailToStrategySpecificEmail: (email: Email) => MailOptionType;
    send: (email: MailOptionType) => Promise<ServerResponseType>;
}
