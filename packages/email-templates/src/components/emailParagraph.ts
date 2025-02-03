const styles = {
    default:
        'style="font-family: Helvetica, Arial, sans-serif; font-size: 19px; line-height: 1.315789474; margin: 0 0 30px 0;',
    leftMargin:
        'style="font-family: Helvetica, Arial, sans-serif; font-size: 19px; line-height: 1.315789474; margin: 0 0 30px 10px;',
    noMargin:
        'style="font-family: Helvetica, Arial, sans-serif; font-size: 19px; line-height: 1.315789474; margin: 0 0 0 0;',
    noMarginSmall:
        'style="font-family: Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.315789474; margin: 0 0 0 0;',
};

export type ParagraphType = 'default' | 'leftMargin' | 'noMargin' | 'noMarginSmall';

export const generateEmailParagraph = (
    text: string,
    type: ParagraphType = 'default',
    inline = false,
    tag = 'p',
): string => {
    return `<${tag} ${styles[type]}${inline ? ' display: inline-block;"' : '"'}>
    ${text}
</${tag}>`;
};
