import { AccessTokenProvider } from '@ukri-tfs/auth';
import { Logger } from '@ukri-tfs/logging';
import { CorrelationIds } from '@ukri-tfs/tfs-request';
import FormData from 'form-data';
import * as httpStatusCodes from 'http-status-codes';
import fetch, { Headers, RequestInit, Response } from 'node-fetch';

export interface RequestOptions {
    additionalHeaders?: Headers;
    acceptHeader?: string;
    maxRetries?: number;
}

/**
 *  Class that provides a wrapper methods around fetch
 *  With request retry for 401 responses,
 *  and adding required auth headers to requests
 **/
export class TfsHttpClient {
    private fetchImpl: typeof fetch;
    private tokenProvider?: AccessTokenProvider;
    private requestOptions?: RequestOptions;
    private logger?: Logger;
    private maxTries: number;

    /**
     * Creates an instance of the HttpClient
     * @constructor
     * @param {AccessTokenProvider} tokenProvider - (Optional) If specified, use this to get token for use as Authorization header.
     * @param {RequestOptions} requestOptions - (Optional) options for each http request (maxRetries, accept header, and additional headers)
     * @param {Logger} logger - (Optional) the logger used to log requests
     * @param {typeof fetch} fetchImpl - (Optional) the fetch implementation that is wrapped, defaults to node-fetch
     */
    constructor(
        tokenProvider?: AccessTokenProvider,
        requestOptions?: RequestOptions,
        logger?: Logger,
        fetchImpl?: typeof fetch,
    ) {
        this.tokenProvider = tokenProvider;
        this.requestOptions = requestOptions;
        this.logger = logger;
        this.fetchImpl = fetchImpl || fetch;

        if (this.requestOptions && this.requestOptions.maxRetries && this.requestOptions.maxRetries > 0) {
            this.maxTries = this.requestOptions.maxRetries;
        } else {
            this.maxTries = 1;
        }
    }

    public async get(
        user: string,
        resource: string,
        correlationIds?: string | CorrelationIds, // TODO: migrate to using only type CorrelationIds
        additionalHeaders?: Headers,
    ): Promise<Response> {
        return this.request(user, 'GET', resource, correlationIds, undefined, additionalHeaders);
    }

    public async post(
        user: string,
        resource: string,
        data: string | FormData,
        correlationIds?: string | CorrelationIds, // TODO: migrate to using only type CorrelationIds
        additionalHeaders?: Headers,
    ): Promise<Response> {
        return this.request(user, 'POST', resource, correlationIds, data, additionalHeaders);
    }

    public async patch(
        user: string,
        resource: string,
        data: string | FormData,
        correlationIds?: string | CorrelationIds, // TODO: migrate to using only type CorrelationIds
        additionalHeaders?: Headers,
    ): Promise<Response> {
        return this.request(user, 'PATCH', resource, correlationIds, data, additionalHeaders);
    }

    public put(
        user: string,
        resource: string,
        data: string,
        correlationIds?: string | CorrelationIds, // TODO: migrate to using only type CorrelationIds
        additionalHeaders?: Headers,
    ): Promise<Response> {
        return this.request(user, 'PUT', resource, correlationIds, data, additionalHeaders);
    }

    public delete(
        user: string,
        resource: string,
        correlationIds?: string | CorrelationIds, // TODO: migrate to using only type CorrelationIds
        additionalHeaders?: Headers,
    ): Promise<Response> {
        return this.request(user, 'DELETE', resource, correlationIds, undefined, additionalHeaders);
    }

    /**
     * Makes an http request.
     * Methods such as get, put and put call this.
     * When a request returns a 401 response, this method retries at least once and up to requestOptions.maxTries
     * Prefer get, put and post
     */
    public async request(
        user: string,
        method: string,
        requestUrl: string,
        correlationIds?: string | CorrelationIds, // TODO: migrate to using only type CorrelationIds
        body?: string | FormData,
        additionalHeaders?: Headers,
    ): Promise<Response> {
        const headers = this.mergeHeaders(additionalHeaders);

        if (user) {
            this.addUserIdHeader(headers, user);
        }

        if (correlationIds) {
            // Allow legacy usage of a single correlation id
            // TODO: remove string usage once all services have migrated to using CorrelationId objects
            if (typeof correlationIds === 'string') {
                this.addCorrelationId(headers, correlationIds);
            } else if (typeof correlationIds === 'object') {
                this.addCorrelationIds(headers, correlationIds);
            }
        }

        if (!this.tokenProvider) {
            // no retries if response status is 401 without token provider
            return this.requestRaw(method, requestUrl, body, headers);
        }

        let response: Response;

        for (let tryCount = 0; tryCount <= this.maxTries; tryCount++) {
            this.addAuthorizationHeader(headers, await this.tokenProvider.getCurrentAccessToken());

            response = await this.requestRaw(method, requestUrl, body, headers);

            if (response.status !== httpStatusCodes.UNAUTHORIZED) {
                break; // no need to retry if response has status other than UNAUTHORIZED, or we have exceeded retries
            }

            if (tryCount < this.maxTries) {
                // no need to refresh token on the last retry
                await this.tokenProvider.refreshAccessToken();
            }
        }

        return response!;
    }

    /**
     * Make a raw http request.
     * All other methods such as get, post, put and request ultimately call this.
     * Prefer get, put and post
     */
    public async requestRaw(
        method: string,
        requestUrl: string,
        body?: string | FormData,
        headers?: Headers,
    ): Promise<Response> {
        if (this.logger) {
            this.logger.debug(`HTTP REQUEST ${method} ${requestUrl}`, body, this.obfuscatedHeaders(headers));
        }
        let result;
        if (typeof body === 'string') {
            body = body as string;
            result = this.fetchImpl(requestUrl, {
                method,
                body,
                headers,
            });
        } else {
            const requestInit = { method, body, headers } as RequestInit;
            result = this.fetchImpl(requestUrl, requestInit);
        }
        return result;
    }

    private obfuscatedHeaders(headers?: Headers) {
        const obfuscated = new Headers(headers);

        const authorizationHeaderValue = obfuscated.get('Authorization');

        if (authorizationHeaderValue && authorizationHeaderValue.indexOf('Bearer') === 0) {
            obfuscated.set('Authorization', 'Bearer xxxx');
        }

        return obfuscated;
    }

    /**
     * @deprecated This method is deprecated. Use `addCorrelationIds` instead.
     * Add x-correlationid header
     */
    private addCorrelationId(headers: Headers, correlationId: string): void {
        headers.set('x-correlationid', correlationId);
    }

    /**
     * Add x-correlationid and x-rootcorrelationid to the header
     */
    private addCorrelationIds(headers: Headers, correlationIds: CorrelationIds): void {
        // root remains as root
        headers.set('x-rootcorrelationid', correlationIds.root);
        // current becomes the parent
        headers.set('x-correlationid', correlationIds.current);
    }

    /**
     * Add x-tfsuserid header
     */
    private addUserIdHeader(headers: Headers, user: string) {
        headers.set('x-tfsuserid', user);
    }

    /**
     * Add authorization header
     */
    private addAuthorizationHeader(headers: Headers, clientToken: string) {
        headers.set('Authorization', `Bearer ${clientToken}`);
    }

    private mergeHeaders(additionalHeaders?: Headers): Headers {
        const merged = new Headers();

        const addToMerged = (value: string, key: string) => merged.set(key, value);

        if (this.requestOptions) {
            if (this.requestOptions.additionalHeaders) {
                this.requestOptions.additionalHeaders.forEach(addToMerged);
            }

            if (this.requestOptions.acceptHeader) {
                merged.set('Accept', this.requestOptions.acceptHeader);
            }
        }

        additionalHeaders && additionalHeaders.forEach(addToMerged);

        if (!merged.get('Accept')) {
            merged.set('Accept', 'application/json');
        }

        if (!merged.get('Content-Type')) {
            merged.set('Content-Type', 'application/json; charset=utf-8');
        }

        return merged;
    }
}
