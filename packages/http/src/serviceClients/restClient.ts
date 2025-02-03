import { CorrelationIds } from '@ukri-tfs/tfs-request';
import FormData from 'form-data';
import { Headers, Response } from 'node-fetch';
import { TfsHttpClient } from './httpClient';

/**
 * creates a url from a request url and optional base url
 * @param {string} resource - a fully qualified url or relative path
 * @param {string} baseUrl - an optional baseUrl
 * @return {string} - resultant url
 **/
export function getResourceUrl(resource: string, baseUrl?: string): string {
    if (!baseUrl) {
        return resource;
    } else if (!resource) {
        return baseUrl;
    } else {
        return `${baseUrl.replace(/\/$/, '')}/${resource.replace(/^\//, '')}`;
    }
}

export type TfsClientErrorHandler = (res: Response) => Promise<never>;

interface RestHeadersOptions {
    /**
     * @deprecated correlationId has been deprecated. Use correlationIds instead.
     */
    correlationId?: string;
    correlationIds?: CorrelationIds;
    headers?: Headers;
}

export interface RestClient {
    get(user: string, resource: string, options?: RestHeadersOptions, getRaw?: boolean): Promise<unknown>;
    put<T>(user: string, resource: string, body: T, options?: RestHeadersOptions): Promise<unknown>;
    post<T>(user: string, resource: string, body: T, options?: RestHeadersOptions): Promise<unknown>;
    patch<T>(user: string, resource: string, body: T, options?: RestHeadersOptions): Promise<unknown>;
    delete(user: string, resource: string, options?: RestHeadersOptions): Promise<unknown>;
}

/**
 * Class that provides get/put/post/patch/delete methods which return the JS object from JSON response or throws the relevant errors for error status codes.
 * This is higher-level than the tfshttpclient and converts the body into a typed resource object. Generally this should be preferred over calling TfsHttpClient get/put/post/delete
 * methods but there may be cases where you do not want the overhead of TfsRestClient
 **/
export class TfsRestClient implements RestClient {
    private name: string; // client name
    private baseUrl: string;
    private client: TfsHttpClient;
    private errorHandler: TfsClientErrorHandler;

    constructor(name: string, httpClient: TfsHttpClient, baseUrl: string, errorHandler: TfsClientErrorHandler) {
        this.name = name;
        this.baseUrl = baseUrl;
        this.client = httpClient;
        this.errorHandler = errorHandler;
    }

    public getClientName(): string {
        return this.name;
    }

    public mapToURLParams<T>(params: T): string {
        const urlParams = new URLSearchParams();
        for (const key in params) {
            const currentParam = params[key] as { toString: () => string };
            if (currentParam.toString === undefined) {
                throw new Error('All parameters must implement toString');
            }
            if (currentParam instanceof Array) {
                // We could recurse here but doesn't make sense to have
                //   2d arrays in url parameters
                for (const item in currentParam) {
                    const currentItem = currentParam[item] as { toString: () => string };
                    if (currentItem.toString === undefined) {
                        throw new Error('All parameters must implement toString');
                    }
                    urlParams.append(key, currentItem.toString());
                }
            } else {
                urlParams.append(key, currentParam.toString());
            }
        }
        return '?' + urlParams.toString();
    }

    public async get<T>(user: string, resource: string, options?: RestHeadersOptions, getRaw?: boolean): Promise<T> {
        const resourceUrl = getResourceUrl(resource, this.baseUrl);
        const correlationIds: undefined | string | CorrelationIds = options?.correlationIds || options?.correlationId;
        const response = await this.client.get(user, resourceUrl, correlationIds);

        switch (response?.status) {
            case 200:
            case 201:
                return getRaw ? response : response.json();
            case 204:
                return {} as T; // changing the return signature to 'T|void' would affect all users
            default:
                return this.handleErrorResponse(response);
        }
    }

    async put<T, U>(user: string, resource: string, body: U, options?: RestHeadersOptions): Promise<T> {
        const resourceUrl = getResourceUrl(resource, this.baseUrl);
        const data = JSON.stringify(body);
        const correlationIds: undefined | string | CorrelationIds = options?.correlationIds || options?.correlationId;
        const response = await this.client.put(user, resourceUrl, data, correlationIds, options?.headers);

        switch (response?.status) {
            case 200:
                return response.json();
            case 204:
                return {} as T; // changing the return signature to 'T|void' would affect all users
            case 400:
                throw await response.json();
            default:
                return this.handleErrorResponse(response);
        }
    }

    async post<T, U>(user: string, resource: string, body: U, options?: RestHeadersOptions): Promise<T> {
        const resourceUrl = getResourceUrl(resource, this.baseUrl);
        const data = JSON.stringify(body);
        const correlationIds: undefined | string | CorrelationIds = options?.correlationIds || options?.correlationId;
        const additionalHeaders = options?.headers;
        const response = await this.client.post(user, resourceUrl, data, correlationIds, additionalHeaders);

        switch (response?.status) {
            case 200:
            case 201:
                return response.json();
            case 204:
                return {} as T; // changing the return signature to 'T|void' would affect all users
            case 409:
                throw await response.json();
            default:
                return this.handleErrorResponse(response);
        }
    }

    async patch<T, U>(user: string, resource: string, body: U, options?: RestHeadersOptions): Promise<T> {
        const resourceUrl = getResourceUrl(resource, this.baseUrl);
        const data = JSON.stringify(body);
        const correlationIds: undefined | string | CorrelationIds = options?.correlationIds || options?.correlationId;
        const additionalHeaders = options?.headers;
        const response = await this.client.patch(user, resourceUrl, data, correlationIds, additionalHeaders);

        switch (response?.status) {
            case 200:
            case 201:
                return response.json();
            case 204:
                return {} as T; // changing the return signature to 'T|void' would affect all users
            case 409:
                throw await response.json();
            default:
                return this.handleErrorResponse(response);
        }
    }

    async postFormData<T>(user: string, resource: string, body: FormData, options?: RestHeadersOptions): Promise<T> {
        const resourceUrl = getResourceUrl(resource, this.baseUrl);
        const correlationIds: undefined | string | CorrelationIds = options?.correlationIds || options?.correlationId;
        const additionalHeaders = options?.headers;
        const response = await this.client.post(user, resourceUrl, body, correlationIds, additionalHeaders);

        switch (response?.status) {
            case 200:
            case 201:
                return response.json();
            default:
                return this.handleErrorResponse(response);
        }
    }

    async delete<T>(user: string, resource: string, options?: RestHeadersOptions): Promise<T> {
        const resourceUrl = getResourceUrl(resource, this.baseUrl);
        const correlationIds: undefined | string | CorrelationIds = options?.correlationIds || options?.correlationId;
        const response = await this.client.delete(user, resourceUrl, correlationIds, options?.headers);

        switch (response?.status) {
            case 200:
            case 202:
                return response.json();
            case 204:
                return {} as T; // changing the return signature to 'T|void' would affect all users
            default:
                return this.handleErrorResponse(response);
        }
    }

    private async handleErrorResponse<T>(response: Response): Promise<T> {
        return this.errorHandler(response);
    }
}
