export const generateTemplatedEmail = (title: string, content: string): string => {
    return `
        <html>
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
                            <td width="75%">
                            ${content}
                            </td>
                            <td width="25%">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        </body>
        </html>
    `;
};

export const generateTemplatedEmailPreview = (content: string): string => {
    return `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="margin-bottom: 19px">
            <tr>
                ${content}
            </tr>
        </table>
    `;
};
