import { createAccessTokenProvider } from '@ukri-tfs/auth';
import { TfsHttpClient } from '@ukri-tfs/http';
import { Logger } from '@ukri-tfs/logging';
import { Headers, Response } from 'node-fetch';
import { HttpError } from '../pageFunctions';
import {
    conflictException,
    forbiddenException,
    methodNotAllowedException,
    payloadTooLargeException,
    resourceNotFoundException,
    unauthorizedException,
    unsupportedMediaTypeException,
    upstreamServiceFailedException,
} from './exceptions';
import { DEPRECATED_BadRequestException } from './exceptions/badRequestException';
import { validationFailedException } from './exceptions/validationFailedException';

export const errorHandler = async (response: Response): Promise<never> => {
    switch (response.status) {
        case 400:
            throw DEPRECATED_BadRequestException(await response.json());
        case 401:
            throw unauthorizedException(`Invalid/unspecified authentication credentials for "${response.url}"`);
        case 403:
            throw forbiddenException(`User is not authorised`);
        case 404:
            throw resourceNotFoundException(`Resource ${response.url} not found`);
        case 405:
            throw methodNotAllowedException(await response.text());
        case 409:
            throw conflictException();
        case 413:
            throw payloadTooLargeException(response);
        case 415:
            throw unsupportedMediaTypeException(response);
        case 422:
            throw validationFailedException(await response.json());
        default:
            throw upstreamServiceFailedException(await response.text());
    }
};

export const httpErrorHandler = async (res: Response): Promise<never> => {
    throw new HttpError(
        res.status,
        `Accessing ${res.url} failed with code ${res.status} and content ${await res.text()}`,
    );
};

let httpClient: TfsHttpClient;

export const getHttpClient = (version: string, logger: Logger): TfsHttpClient => {
    if (!httpClient) {
        const accessTokenProvider =
            process.env.REQUIRE_ACCESS_TOKEN === 'true'
                ? createAccessTokenProvider(
                      logger,
                      process.env.CLIENT_CREDENTIALS_SCOPE,
                      process.env.CLIENT_CREDENTIALS_URL,
                      process.env.CLIENT_CREDENTIALS_ID,
                      process.env.CLIENT_CREDENTIALS_SECRET,
                  )
                : undefined;
        httpClient = new TfsHttpClient(accessTokenProvider, {
            maxRetries: 1,
            additionalHeaders: new Headers({ 'accept-version': version }),
        });
    }

    return httpClient;
};

export const getBasicAuthHttpClient = (username: string, password: string, version: string): TfsHttpClient => {
    return new TfsHttpClient(undefined, {
        maxRetries: 1,
        additionalHeaders: new Headers({
            'accept-version': version,
            Authorization: `Basic ${btoa(username + ':' + password)}`,
        }),
    });
};
