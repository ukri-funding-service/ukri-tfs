import { ServerResponse } from 'http';
export class RedirectError extends Error {
    public location: string;
    public preserveData: boolean;

    constructor(location: string, preserveData: boolean) {
        const message =
            'This error should be handled by the redirect middleware. If you are seeing this in logs then redirect has been implemented incorrectly';
        super(message);
        this.location = location;
        this.preserveData = preserveData;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * @deprecated This pattern is now deprecated. Use newRedirect instead.
 */
export function redirect(response: ServerResponse, location: string, preserveData = false): ServerResponse {
    const responseCode = preserveData ? 307 : 302;
    response.writeHead(responseCode, { Location: location });
    response.end();
    return response;
}

export function newRedirect(location: string, preserveData = false): never {
    throw new RedirectError(location, preserveData);
}
