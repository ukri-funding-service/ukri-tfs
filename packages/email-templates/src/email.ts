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
