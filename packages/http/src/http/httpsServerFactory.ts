import https from 'https';
import { RequestListener } from 'http';

interface Process extends NodeJS.Process {
    browser: boolean;
}

declare const process: Process;

/**
 * Returns the default options for configuring an HTTPS server.
 * Requires environment variables 'SSL_KEY_PATH' and 'SSL_CERTIFICATE_PATH'
 * to be set.
 */
const defaultHttpsServerOptions = (): https.ServerOptions => {
    if (process.browser) {
        throw new Error('The fs module is not usable on the browser.');
    } else {
        const fs = require('fs');

        const keyPath = process.env.SSL_KEY_PATH;
        if (!keyPath) {
            throw new Error(`SSL_KEY_PATH not specified in environment variables`);
        }

        const certficatePath = process.env.SSL_CERTIFICATE_PATH;
        if (!certficatePath) {
            throw new Error(`SSL_CERTIFICATE_PATH not specified in environent variables`);
        }

        const key = fs.readFileSync(keyPath, 'utf8');
        const cert = fs.readFileSync(certficatePath, 'utf8');
        return {
            key,
            cert,
        };
    }
};

export const httpsServerFactory = (
    handler: RequestListener,
    serverOptions: https.ServerOptions = defaultHttpsServerOptions(),
): https.Server => {
    return https.createServer(serverOptions, handler);
};
