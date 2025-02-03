import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { FetchFunction } from '../tfsServiceClient/tfsFetchFunction';
import { BasicAuthFetchConfig, generateBasicAuthFetch } from './basicAuthFetch';
import { SecretProvider } from '@ukri-tfs/secrets';

type FetchResponseType = Awaited<ReturnType<FetchFunction>>;

describe('packages/lambda-handler - basicAuthClient/basicAuthFetch', () => {
    let config: BasicAuthFetchConfig;
    let callsToStubSecretProvider: string[] = [];

    const stubSecretProvider: SecretProvider = {
        getSecret: (id: string): Promise<string> => {
            callsToStubSecretProvider.push(id); // Record the ids passed in for validation
            return Promise.resolve(`stub-secret-value-for-${id}`);
        },
    };

    beforeEach(() => {
        config = {
            usernameARN: 'username_ARN',
            passwordARN: 'password_ARN',
            correlationIds: {
                root: 'root',
                current: 'current',
                parent: 'parent',
            },
        };

        callsToStubSecretProvider = [];
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should use default fetch if none is injected', async () => {
        expect(await generateBasicAuthFetch(config, stubSecretProvider)).toBeDefined();
    });

    it('should generate a fetch function when an injected implementation is provided', async () => {
        const stubResponse: FetchResponseType = { ok: true } as FetchResponseType;
        const localFetchMock: FetchFunction = jest
            .fn<FetchFunction>()
            .mockResolvedValue(stubResponse) as unknown as FetchFunction;

        expect(await generateBasicAuthFetch(config, stubSecretProvider, localFetchMock)).toBeDefined();
    });

    it('generated basic auth fetch function should provide expected parameters', async () => {
        const url = 'aws-opensearch-service';
        const opts = { method: 'POST', body: JSON.stringify({}) };

        const stubResponse: FetchResponseType = { ok: true } as FetchResponseType;
        const localFetchMock: FetchFunction = jest
            .fn<FetchFunction>()
            .mockResolvedValue(stubResponse) as unknown as FetchFunction;
        const fetchFunction = await generateBasicAuthFetch(config, stubSecretProvider, localFetchMock);

        await fetchFunction(url, opts, '1.X');

        expect(callsToStubSecretProvider).toHaveLength(2);
        expect(callsToStubSecretProvider).toContain('username_ARN');
        expect(callsToStubSecretProvider).toContain('password_ARN');

        expect(localFetchMock).toHaveBeenCalledWith(
            url,
            expect.objectContaining({
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        'stub-secret-value-for-username_ARN:stub-secret-value-for-password_ARN',
                    ).toString('base64')}`,
                    'accept-version': '1.X',
                    'x-correlationid': 'current',
                    'x-rootcorrelationid': 'root',
                },
                method: 'POST',
                body: JSON.stringify({}),
            }),
        );
    });

    it('should generate a basic auth fetch function without correlation Ids', async () => {
        const url = 'aws-opensearch-service';
        const opts = { method: 'POST', body: JSON.stringify({}) };
        const basicAuthConfig: BasicAuthFetchConfig = {
            usernameARN: 'username_ARN',
            passwordARN: 'password_ARN',
            correlationIds: {
                root: 'root-coorelation-id',
                current: 'current-correlationid',
            },
        };

        const stubResponse: FetchResponseType = { ok: true } as FetchResponseType;
        const localFetchMock: FetchFunction = jest
            .fn<FetchFunction>()
            .mockResolvedValue(stubResponse) as unknown as FetchFunction;
        const fetchFunction = await generateBasicAuthFetch(basicAuthConfig, stubSecretProvider, localFetchMock);
        await fetchFunction(url, opts, '1.X');

        expect(callsToStubSecretProvider).toHaveLength(2);
        expect(localFetchMock).toHaveBeenCalledWith(
            url,
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: expect.stringMatching(/^Basic [0-9a-zA-Z]+/),
                    'accept-version': '1.X',
                }),
                method: 'POST',
                body: JSON.stringify({}),
            }),
        );
    });

    it('should generate a fetch function and add Headers', async () => {
        const url = 'aws-opensearch-service';
        const opts = { method: 'POST', body: JSON.stringify({}) };

        const stubResponse: FetchResponseType = { ok: true } as FetchResponseType;
        const localFetchMock: FetchFunction = jest
            .fn<FetchFunction>()
            .mockResolvedValue(stubResponse) as unknown as FetchFunction;
        const fetchFunction = await generateBasicAuthFetch(config, stubSecretProvider, localFetchMock);

        await fetchFunction(url, opts, '1.X', { 'test-header': 'abc' });

        expect(callsToStubSecretProvider).toHaveLength(2);
        expect(callsToStubSecretProvider).toContain('username_ARN');
        expect(callsToStubSecretProvider).toContain('password_ARN');

        expect(localFetchMock).toHaveBeenCalledWith(
            url,
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Basic ${Buffer.from(
                        'stub-secret-value-for-username_ARN:stub-secret-value-for-password_ARN',
                    ).toString('base64')}`,
                    'accept-version': '1.X',
                    'x-correlationid': 'current',
                    'x-rootcorrelationid': 'root',
                    'test-header': 'abc',
                }),
                method: 'POST',
                body: JSON.stringify({}),
            }),
        );
    });

    it('should throw an exception if call failed', async () => {
        const url = 'opensearch-url';
        const opts = { method: 'POST', body: JSON.stringify({}) };

        const stubResponse: FetchResponseType = {
            ok: false,
            status: 404,
            body: 'Not found.',
        } as unknown as FetchResponseType;
        const localFetchMock: FetchFunction = jest
            .fn<FetchFunction>()
            .mockResolvedValue(stubResponse) as unknown as FetchFunction;
        const fetchFunction = await generateBasicAuthFetch(config, stubSecretProvider, localFetchMock);

        await expect(fetchFunction(url, opts, '1.X')).rejects.toThrow();
    });
});
