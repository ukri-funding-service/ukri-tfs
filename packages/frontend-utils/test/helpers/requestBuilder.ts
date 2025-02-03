/* eslint @typescript-eslint/no-explicit-any: 0 */
/* disabled to allow switching eslint warnings to errors */
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import { AppRequest } from '../../src/pageFunctions';

const urlEncodedFormMimeType = 'application/x-www-form-urlencoded';

export class RequestBuilder {
    private request: AppRequest;

    public constructor() {
        this.request = new IncomingMessage(new Socket()) as AppRequest;
        this.request.method = 'get';
        this.request.context = {
            logger: {} as any,
            service: 'frontend',
            userData: {
                user: Promise.resolve(undefined),
                userId: '1234-1234-1234-1234',
            },
            correlationIds: {
                root: '1234-1234-1234-1234',
                parent: '1234-1234-1234-1234',
                current: '1234-1234-1234-1234',
            },
        };
        this.request.session = { props: { csrf: { csrfToken: 'fake' } } };
    }

    public withBody(postData: { key: string; value: string }[], contentType?: string): RequestBuilder {
        postData.unshift({ key: 'csrfToken', value: 'fake' });
        const queryParams: string[] = postData.map(
            field => `${encodeURIComponent(field.key)}=${encodeURIComponent(field.value)}`,
        );

        if (this.request && this.request.headers && this.request.push) {
            this.request.method = 'post';
            this.request.headers['content-type'] = contentType || urlEncodedFormMimeType;
            this.request.push(queryParams.join('&'));
            this.request.push(null);
        }

        return this;
    }

    public build(): IncomingMessage {
        return this.request as IncomingMessage;
    }
}
