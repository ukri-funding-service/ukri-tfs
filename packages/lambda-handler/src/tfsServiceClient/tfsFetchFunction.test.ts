import { describe, expect, it, jest } from '@jest/globals';
import { generateAuthorizedTfsFetchFunction, FetchFunction } from './tfsFetchFunction';
// eslint-disable-next-line deprecate/import
import { CorrelationIds } from '../correlationIds/correlationIds';
import { Logger, NoopLogger } from '@ukri-tfs/logging';
import fetch from 'node-fetch';
import { AgentProvider } from '../agent/agentProvider';
import { Agent } from 'https';
import { type AuthorizationProvider, AuthorizationProviderStub } from '../authorization';

const UUIDv4Matcher = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

const validUUID = '7683b7e8-6ca8-4ce3-b80f-cae6e96780a8';

const stubCorrelationIds: CorrelationIds = {
    current: validUUID,
    parent: validUUID,
    root: validUUID,
};

class MockAuthorizationProvider implements AuthorizationProvider {
    getAuthorization = async (): Promise<string> => Promise.resolve('Bearer mock-token-for-testing');
}

class StubAgentProvider implements AgentProvider {
    private stubAgent = new Agent();
    getAgent = async (): Promise<Agent> => Promise.resolve(this.stubAgent);
}

const agentProviderStub = new StubAgentProvider();
const authorizationProviderStub = new MockAuthorizationProvider();

type FetchResponseType = Awaited<ReturnType<FetchFunction>>;

const stubLogger = new NoopLogger();

describe('packages/lambda-handler - tfsServiceClient/tfsFetch', () => {
    describe('generateAuthorizedTfsFetchFunction', () => {
        it('should generate a fetch function', async () => {
            expect(
                await generateAuthorizedTfsFetchFunction(
                    fetch,
                    agentProviderStub,
                    authorizationProviderStub,
                    stubCorrelationIds,
                    stubLogger,
                ),
            ).toBeDefined;
        });

        it('should generate a fetch function with an injected implementation', async () => {
            const localFetchMock = jest
                .fn<FetchFunction>()
                .mockResolvedValue({ ok: true } as FetchResponseType) as unknown as FetchFunction;

            expect(
                await generateAuthorizedTfsFetchFunction(
                    localFetchMock,
                    agentProviderStub,
                    authorizationProviderStub,
                    stubCorrelationIds,
                    stubLogger,
                ),
            ).toBeDefined;
        });

        it('generated fetch function should call fetch implementation with expected params', async () => {
            const url = 'url/some-endpoint';
            const opts = { method: 'POST', body: JSON.stringify({}) };

            const stubResponse: FetchResponseType = { ok: true } as FetchResponseType;
            const localFetchMock = jest.fn<FetchFunction>().mockResolvedValue(stubResponse) as unknown as FetchFunction;

            const fetchFunction = await generateAuthorizedTfsFetchFunction(
                localFetchMock,
                agentProviderStub,
                authorizationProviderStub,
                stubCorrelationIds,
                stubLogger,
            );
            await fetchFunction(url, opts, '1.X');

            expect(localFetchMock).toHaveBeenCalledWith(
                url,
                expect.objectContaining({
                    headers: {
                        Authorization: 'Bearer mock-token-for-testing',
                        'accept-version': '1.X',
                        'x-tfsuserid': 'anon',
                        'x-correlationid': expect.stringMatching(UUIDv4Matcher),
                        'x-rootcorrelationid': expect.stringMatching(UUIDv4Matcher),
                    },
                    method: 'POST',
                    body: JSON.stringify({}),
                }),
            );
        });

        it('should generate a fetch function and add Headers', async () => {
            const url = 'url/some-endpoint';
            const opts = { method: 'POST', body: JSON.stringify({}) };

            const stubResponse: FetchResponseType = { ok: true } as FetchResponseType;
            const localFetchMock = jest.fn<FetchFunction>().mockResolvedValue(stubResponse) as unknown as FetchFunction;

            const fetchFunction = await generateAuthorizedTfsFetchFunction(
                localFetchMock,
                agentProviderStub,
                authorizationProviderStub,
                stubCorrelationIds,
                stubLogger,
            );
            await fetchFunction(url, opts, '1.X', { 'test-header': 'abc' });

            expect(localFetchMock).toHaveBeenCalledWith(
                url,
                expect.objectContaining({
                    headers: {
                        Authorization: 'Bearer mock-token-for-testing',
                        'accept-version': '1.X',
                        'x-correlationid': expect.stringMatching(UUIDv4Matcher),
                        'x-rootcorrelationid': expect.stringMatching(UUIDv4Matcher),
                        'x-tfsuserid': 'anon',
                        'test-header': 'abc',
                    },
                    method: 'POST',
                    body: JSON.stringify({}),
                }),
            );
        });

        it(`should generate a fetch function which adds generated correlations ids
            when not provided with an event containing them`, async () => {
            const url = 'url/some-endpoint';
            const opts = { method: 'POST', body: JSON.stringify({}) };

            const stubResponse: FetchResponseType = { ok: true } as FetchResponseType;
            const localFetchMock = jest.fn<FetchFunction>().mockResolvedValue(stubResponse) as unknown as FetchFunction;

            const fetchFunction = await generateAuthorizedTfsFetchFunction(
                localFetchMock,
                agentProviderStub,
                authorizationProviderStub,
                stubCorrelationIds,
                stubLogger,
            );
            await fetchFunction(url, opts, '1.X');

            expect(localFetchMock).toHaveBeenCalledWith(
                'url/some-endpoint',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'x-correlationid': expect.stringMatching(UUIDv4Matcher),
                        'x-rootcorrelationid': expect.stringMatching(UUIDv4Matcher),
                    }),
                    method: 'POST',
                }),
            );
        });

        it('should generate a fetch function, overriding a header', async () => {
            const url = 'url/some-endpoint';
            const opts = { method: 'POST', body: JSON.stringify({}) };

            const stubResponse: FetchResponseType = { ok: true } as FetchResponseType;
            const localFetchMock = jest.fn<FetchFunction>().mockResolvedValue(stubResponse) as unknown as FetchFunction;

            const fetchFunction = await generateAuthorizedTfsFetchFunction(
                localFetchMock,
                agentProviderStub,
                authorizationProviderStub,
                stubCorrelationIds,
                stubLogger,
            );

            await fetchFunction(url, opts, '1.X', { 'x-tfsuserid': '12345' });

            expect(localFetchMock).toHaveBeenCalledWith(
                url,
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: 'Bearer mock-token-for-testing',
                        'accept-version': '1.X',
                        'x-correlationid': expect.stringMatching(UUIDv4Matcher),
                        'x-rootcorrelationid': expect.stringMatching(UUIDv4Matcher),
                        'x-tfsuserid': '12345',
                    }),
                    method: 'POST',
                    body: JSON.stringify({}),
                }),
            );
        });

        it('should throw an exception if call failed', async () => {
            const url = 'url/some-endpoint';
            const opts = { method: 'POST', body: JSON.stringify({}) };

            const stubResponse: FetchResponseType = {
                status: 404,
                ok: false,
                body: 'Not found.',
                text: () => Promise.resolve('Body: Not found.'),
            } as unknown as FetchResponseType;

            const localFetchMock = jest.fn<FetchFunction>().mockResolvedValue(stubResponse) as unknown as FetchFunction;

            const fetchFunction = await generateAuthorizedTfsFetchFunction(
                localFetchMock,
                agentProviderStub,
                authorizationProviderStub,
                stubCorrelationIds,
                stubLogger,
            );

            await expect(fetchFunction(url, opts, '1.X')).rejects.toThrow();
        });

        it('should throw an exception if AuthorizationProvider rejects', async () => {
            const stubResponse: FetchResponseType = { ok: true } as FetchResponseType;
            const localFetchMock = jest.fn<FetchFunction>().mockResolvedValue(stubResponse) as unknown as FetchFunction;

            const authorizationProviderErrorStub: AuthorizationProvider = {
                getAuthorization: (): Promise<string> => Promise.reject(new Error('TESTING ERROR HANDLER')),
            };

            await expect(
                generateAuthorizedTfsFetchFunction(
                    localFetchMock,
                    agentProviderStub,
                    authorizationProviderErrorStub,
                    stubCorrelationIds,
                    stubLogger,
                ),
            ).rejects.toThrow(Error('TESTING ERROR HANDLER'));
        });

        it('should log at debug level if access_token is zero-length', async () => {
            const stubResponse: FetchResponseType = { ok: true } as FetchResponseType;
            const localFetchMock = jest.fn<FetchFunction>().mockResolvedValue(stubResponse) as unknown as FetchFunction;

            const calls = new Array<string>();

            const loggerMock: Logger = {
                audit: (...args: []) => {
                    calls.push(`audit ${args.join('|')}`);
                },
                debug: (...args: []) => {
                    calls.push(`debug ${args.join('|')}`);
                },
                info: (...args: []) => {
                    calls.push(`info ${args.join('|')}`);
                },
                warn: (...args: []) => {
                    calls.push(`warn ${args.join('|')}`);
                },
                error: (...args: []) => {
                    calls.push(`error ${args.join('|')}`);
                },
            };

            await generateAuthorizedTfsFetchFunction(
                localFetchMock,
                agentProviderStub,
                new AuthorizationProviderStub(stubLogger),
                stubCorrelationIds,
                loggerMock,
            );

            expect(calls).toContain('debug Authorization was zero-length, Authentication header will be omitted');
        });
    });
});
