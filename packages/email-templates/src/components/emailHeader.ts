const headerStyle =
    'font-family: Helvetica, Arial, sans-serif; line-height: 1.315789474; font-weight: 700; margin: 19px 0 38px 0; color: #2E2D62;';

export const generateEmailHeader = (text: string): string => `<h1 style="${headerStyle} font-size: 36px;">
${text}
</h1>`;

export const generateEmailH2Header = (text: string): string => `<h2 style="${headerStyle} font-size: 30px;">
${text}
</h2>`;

export const generateEmailH3Header = (text: string): string => `<h3 style="${headerStyle} font-size: 24px;">
${text}
</h3>`;

const strongHeaderStyles = {
    default:
        'style="font-family: Helvetica, Arial, sans-serif; font-size: 19px; line-height: 1.315789474; margin: 0 0 30px 0;"',
    noMargin:
        'style="font-family: Helvetica, Arial, sans-serif; font-size: 19px; line-height: 1.315789474; margin: 0 0 0 0;"',
};

type StrongHeaderType = 'default' | 'noMargin';

export const generateEmailStrongHeader = (text: string, type: StrongHeaderType = 'default'): string => {
    return `<strong> <p ${strongHeaderStyles[type]}>${text}</p> </strong>`;
};
