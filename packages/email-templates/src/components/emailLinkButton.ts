import { generateEmailParagraph, ParagraphType } from '.';

const linkButtonLinkStyle =
    'display:block;width:fit-content;padding:8px 12px 8px 12px;background-color:#00703c;border-bottom:2px solid #002d18;color:white;text-decoration:none;text-align: center';

export const generateEmailLinkButton = (
    url: string,
    text: string,
    inline = false,
    type: ParagraphType = 'default',
): string => {
    return generateEmailParagraph(
        `
        <a href="${url}" style="${linkButtonLinkStyle}"> 
        ${text}
        </a>`,
        type,
        inline,
    );
};
