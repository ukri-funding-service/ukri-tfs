import { describe, expect, it } from '@jest/globals';

import {
    generateEmailH2Header,
    generateEmailHeader,
    generateEmailLinkButton,
    generateEmailParagraph,
    generateTemplatedEmail,
} from '.';

describe('Email components', () => {
    it('should generate a formatted email', async () => {
        const generatedEmail = generateTemplatedEmail(
            'Email title',
            `
        ${generateEmailHeader('Email header')}
        ${generateEmailH2Header('Email H2 header')}
        ${generateEmailParagraph('Email paragraph', 'noMarginSmall')}
        ${generateEmailLinkButton('www.example.com', 'Click me')}
        `,
        );

        const start = (title: string): string => `<html>
        <head>
            <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
            <meta content="utf-8" http-equiv="encoding">
            <meta name="format-detection" content="telephone=no">
            <title>${title}</title>
        </head>
        <body style="font-family: Helvetica, Arial, sans-serif;font-size: 16px;margin: 0;color:#0b0c0c">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td width="100%" height="53" bgcolor="#2E2D62">
                    <table width="580" cellpadding="0" cellspacing="0" border="0" align="center">
                        <tr>
                            <td width="70" bgcolor="#2E2D62" valign="middle"><a href="https://www.ukri.org" style="text-decoration: none;"><img src="https://ukri-tfs-prod-assets.s3.eu-west-2.amazonaws.com/UKRI_logo_verification_email.png" alt="" height="48" border="0" style="padding: 10px 20px 10px 0;"></a></td>
                            <td width="100%" bgcolor="#2E2D62" valign="middle" align="left"><span style="padding-left: 5px;"><a href="https://www.ukri.org/" style="font-family: Helvetica, Arial, sans-serif; font-size: 28px; line-height: 1.315789474; font-weight: 100; color: #efefef; text-decoration: none;">Funding Service</a></span></td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="margin-bottom: 19px">
            <tr>
                <td width="100%">
                    <table width="580" cellpadding="0" cellspacing="0" border="0" align="center">
                        <tr>
                            <td width="75%">`;
        const end = `</td>
                            <td width="25%">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        </body>
        </html>`;
        // Correct head/title etc
        expect(generatedEmail).toContain(start('Email title'));
        // Correct end table/body etc
        expect(generatedEmail).toContain(end);
        // Has the header
        expect(generatedEmail).toContain(
            `<h1 style="font-family: Helvetica, Arial, sans-serif; line-height: 1.315789474; font-weight: 700; margin: 19px 0 38px 0; color: #2E2D62; font-size: 36px;">\nEmail header\n</h1>`,
        );
        expect(generatedEmail).toContain(
            `<h2 style="font-family: Helvetica, Arial, sans-serif; line-height: 1.315789474; font-weight: 700; margin: 19px 0 38px 0; color: #2E2D62; font-size: 30px;">\nEmail H2 header\n</h2>`,
        );
        // Has the paragraph
        expect(generatedEmail).toContain(
            `<p style="font-family: Helvetica, Arial, sans-serif; font-size: 19px; line-height: 1.315789474; margin: 0 0 30px 0;">\n    \n        <a href="www.example.com" style="display:block;width:fit-content;padding:8px 12px 8px 12px;background-color:#00703c;border-bottom:2px solid #002d18;color:white;text-decoration:none;text-align: center"> \n        Click me\n        </a>\n</p>`,
        );
        // Has a link button
        expect(generatedEmail).toContain(
            `<p style="font-family: Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.315789474; margin: 0 0 0 0;">\n    Email paragraph\n</p>`,
        );
    });
});
