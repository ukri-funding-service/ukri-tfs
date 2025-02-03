import { SecretProvider } from '@ukri-tfs/secrets';
import fetch, { RequestInit, RequestInfo, Response, HeadersInit } from 'node-fetch';

export interface CorrelationIds {
    root: string;
    current: string;
    parent?: string;
}

export interface BasicAuthFetchConfigBase {
    usernameARN: string;
    passwordARN: string;
}

export interface BasicAuthFetchConfig extends BasicAuthFetchConfigBase {
    correlationIds: CorrelationIds | undefined;
}

export type BasicAuthFetchHeaders = { [key: string]: string };

export type BasicAuthFetch = (
    url: string,
    opts: RequestInit,
    serviceVersion: string,
    headers?: BasicAuthFetchHeaders,
) => Promise<Response>;

export type FetchFunction = (url: RequestInfo, init?: RequestInit) => Promise<Response>;

export type RequestInitWithoutHeaders = Omit<RequestInit, 'headers'>;

export const generateBasicAuthFetch = async (
    config: BasicAuthFetchConfig,
    secretProvider: SecretProvider,
    fetchImpl: FetchFunction = fetch,
): Promise<BasicAuthFetch> => {
    const username = await secretProvider.getSecret(config.usernameARN);
    const password = await secretProvider.getSecret(config.passwordARN);

    const tfsHeaders: HeadersInit = {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
    };

    if (config.correlationIds !== undefined) {
        tfsHeaders['x-rootcorrelationid'] = config.correlationIds.root;
        tfsHeaders['x-correlationid'] = config.correlationIds.current;
    }

    const baseOpts: RequestInit = {
        headers: tfsHeaders,
    };

    return async (
        url: string,
        opts: RequestInitWithoutHeaders,
        serviceVersion: string,
        headers?: BasicAuthFetchHeaders,
    ) => {
        const currentHeaders = { ...baseOpts.headers, ...(headers ?? {}), 'accept-version': serviceVersion };
        const response = await fetchImpl(url, { ...baseOpts, ...opts, headers: currentHeaders });

        if (response.ok) {
            return response;
        }
        throw new Error(`Status: ${response.status}.  Body: ${await response.text()}`);
    };
};
