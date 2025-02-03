import { IncomingMessage } from 'http';
import { parse } from 'querystring';
import { isCsrfSafe } from './csrf';
import { HttpError } from './httpError';
import { isPostMethod } from './isPostMethod';
import { FormidableParsedData, parseMultipartFormData } from './multipartFormData';

const FORM_URLENCODED = 'application/x-www-form-urlencoded';
const MULTIPART_FORM_DATA = 'multipart/form-data';

async function collectPostData<T>(
    request: IncomingMessage,
    resolve: (value?: T | PromiseLike<T> | FormidableParsedData | undefined) => void,
    reject: (reason?: unknown) => void,
) {
    function ensureRequestValidity(requestToCheck: IncomingMessage, postData: any) {
        if (isCsrfSafe(requestToCheck, postData)) {
            resolve(postData);
        } else {
            reject(new HttpError(403, 'Forbidden invalid request'));
        }
    }

    const parsed = request as any;

    if (request.headers['content-type'] && request.headers['content-type'].includes(MULTIPART_FORM_DATA)) {
        let data: FormidableParsedData | undefined;
        try {
            data = await parseMultipartFormData(request);
        } catch (err) {
            reject(err);
            return;
        }

        if (isCsrfSafe(request, { csrfToken: `${data!.fields['csrfToken']}` })) {
            resolve(data);
        } else {
            reject(new HttpError(403, 'Forbidden incorrect headers'));
        }
    }

    if (!!parsed.body) {
        ensureRequestValidity(request, parsed.body);
    }

    if (request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', (chunk: any) => {
            body += chunk.toString();
        });
        request.on('end', () => {
            const postData = parse(body) as any;
            ensureRequestValidity(request, postData);
        });
    } else {
        reject(new HttpError(415, 'Unsupported Media Type'));
    }
}

export async function collectRequestData<T>(request?: IncomingMessage): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        if (request) {
            // The casting as any allows this code to compile with TypeScript 4
            if (isPostMethod(request)) {
                collectPostData<T>(request, resolve as any, reject);
            } else {
                resolve(undefined as any);
            }
        } else {
            reject(new HttpError(400, 'Bad Request'));
        }
    });
}
