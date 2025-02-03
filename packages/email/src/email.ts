/**
 * Generic Email type that can be used with any type of send strategy.
 */
export interface Email {
    // from
    sourceEmail: string;
    sourceDisplayName: string;

    // to
    toAddresses: string[];
    ccAddresses?: string[];
    bccAddresses?: string[];

    // content
    subject: string;
    html: string;
    text: string;

    // reply
    replyToAddresses?: string[];
}
