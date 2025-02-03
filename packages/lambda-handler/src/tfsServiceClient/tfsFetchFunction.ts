import { type Logger } from '@ukri-tfs/logging';
import type { RequestInit, Response } from 'node-fetch';
import fetch from 'node-fetch';
import { type CorrelationIds } from '../correlationIds/correlationIds';
import { type AgentProvider } from '../agent/agentProvider';
import { type AuthorizationProvider } from '../authorization/authorizationProvider';
import { StandardHeadersBuilder } from '.';

export type TfsFetchHeaders = { [key: string]: string };

export type TfsFetchFunction = (
    url: string,
    opts: RequestInit,
    serviceVersion: string,
    headers?: TfsFetchHeaders,
) => Promise<Response>;

export type RequestInitWithoutHeaders = Omit<RequestInit, 'headers'>;

export type FetchFunction = typeof fetch;

/**
 * Generates a fetch function with an Authorization header.
 * @param config
 * @param secretProvider
 * @param fetchImpl
 * @param acmPcaClient
 * @param tokenProvider
 * @returns
 */
export const generateAuthorizedTfsFetchFunction = async (
    fetchImpl: FetchFunction,
    agentProvider: AgentProvider,
    authorizationProvider: AuthorizationProvider,
    correlationIds: CorrelationIds,
    logger: Logger,
): Promise<TfsFetchFunction> => {
    let headerBuilder = new StandardHeadersBuilder(logger).withCorrelationIds(correlationIds);

    try {
        logger.debug(`Getting authorization from AuthorizationProvider`);
        const authorization = await authorizationProvider.getAuthorization();
        headerBuilder = headerBuilder.withAuthorization(authorization);
    } catch (error) {
        logger.error('Error getting authorization from AuthorizationProvider');
        throw error;
    }

    const headerData = headerBuilder.build();
    const agent = await agentProvider.getAgent();

    const baseOpts: RequestInit = {
        headers: headerData,
        agent: agent,
    };

    return async (
        url: string,
        opts: RequestInitWithoutHeaders,
        serviceVersion: string,
        headers?: TfsFetchHeaders,
    ): Promise<Response> => {
        const currentHeaders = { ...baseOpts.headers, ...(headers ?? {}), 'accept-version': serviceVersion };
        const response = await fetchImpl!(url, { ...baseOpts, ...opts, headers: currentHeaders });

        if (response.ok) {
            return response;
        }
        throw new Error(`Status: ${response.status}.  Body: ${await response.text()}`);
    };
};
