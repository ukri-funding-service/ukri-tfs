import { describe, expect, it, jest } from '@jest/globals';
import { NoopLogger } from '@ukri-tfs/logging';
import { FetchFunction } from '../tfsServiceClient/tfsFetchFunction';
import { ClientCredentialsFlowFetchImpl, getErrorMessageFrom } from './clientCredentialsFlowFetchImpl';
import { SecretProvider } from '@ukri-tfs/secrets';
import { type ClientCredentialsServerConfig } from './clientCredentialsServerConfig';

type FetchResponseType = Awaited<ReturnType<FetchFunction>>;

describe('packages/lambda-handler - oauth/clientCredentialsFlowFetchImpl', () => {
    beforeEach(() => {
        calls = new Array<string>(); // reset record of calls made to secret provider
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const fetchConfig: ClientCredentialsServerConfig = {
        clientCredentialsUrl: 'http://some-url',
        clientCredentialsId: '123',
        clientCredentialsSecretName: 'secret-name',
    };

    // This is what the token response looks like from an OAuth service.
    // It is returned as Content-Type: application/json;charset=UTF-8 from Cognito.
    // Intentionally using double quotes (") because that is the response
    // format from Cognito. Indentation and multiline formatting is intentional as well.
    // PLEASE DONT MODIFY FORMAT without retaining the 2 leading spaces and the newlines
    // otherwise the tests will be less representative.
    const fakeAccessTokenResponse = `{
  "access_token": "fake-access-token-for-testing",
  "expires_in": 3600,
  "token_type": "Bearer"
}`;

    const stubFetchResponse: FetchResponseType = {
        ok: true,
        json() {
            return Promise.resolve(JSON.parse(fakeAccessTokenResponse));
        },
    } as FetchResponseType;

    const stubLogger = new NoopLogger();

    // stack of calls made to the stupSecretProvider
    let calls: string[] = new Array<string>();

    const stubSecretProvider: SecretProvider = {
        getSecret: (_id: string): Promise<string> => {
            calls.push(_id);
            return Promise.resolve('some-secret-for-testing');
        },
    };

    describe('getAccessToken', () => {
        it(`should return a token response when the fetch config is valid,
                the secret provider returns the client secret,
                and the oauth handshake succeeds`, async () => {
            const localFetchMock = jest.fn<FetchFunction>().mockResolvedValue(stubFetchResponse);

            const uut = new ClientCredentialsFlowFetchImpl(
                fetchConfig,
                stubSecretProvider,
                stubLogger,
                localFetchMock as unknown as FetchFunction,
            );

            const result = await uut.getAccessToken('scope');

            expect(result).toEqual({
                access_token: 'fake-access-token-for-testing',
                expires_in: 3600,
                token_type: 'Bearer',
            });
        });

        it('should acquire secret from secrets provider', async () => {
            const localFetchMock = jest.fn<FetchFunction>().mockResolvedValue(stubFetchResponse);

            const uut = new ClientCredentialsFlowFetchImpl(
                fetchConfig,
                stubSecretProvider,
                stubLogger,
                localFetchMock as unknown as FetchFunction,
            );

            await uut.getAccessToken('scope');

            expect(calls).toHaveLength(1);
        });

        it('should request expected secret from secrets provider', async () => {
            const localFetchMock = jest.fn<FetchFunction>().mockResolvedValue(stubFetchResponse);

            const uut = new ClientCredentialsFlowFetchImpl(
                fetchConfig,
                stubSecretProvider,
                stubLogger,
                localFetchMock as unknown as FetchFunction,
            );

            await uut.getAccessToken('scope');

            expect(calls[0]).toEqual('secret-name');
        });

        it('should request the token from the OAuth client credentials endpoint using the required POST syntax', async () => {
            const localFetchMock = jest.fn<FetchFunction>().mockResolvedValue(stubFetchResponse);

            const uut = new ClientCredentialsFlowFetchImpl(
                fetchConfig,
                stubSecretProvider,
                stubLogger,
                localFetchMock as unknown as FetchFunction,
            );
            await uut.getAccessToken('scope');

            expect(localFetchMock).toHaveBeenCalledWith(
                'http://some-url/oauth2/token',
                expect.objectContaining({
                    method: 'post',
                    body: 'grant_type=client_credentials&scope=scope',
                    headers: expect.objectContaining({
                        authorization: 'Basic MTIzOnNvbWUtc2VjcmV0LWZvci10ZXN0aW5n', //123:some-secret-for-testing in base64
                    }),
                }),
            );
        });

        it('should reject an OAuth handshake response which does not contain a token', async () => {
            const localStubFetchResponse: FetchResponseType = {
                ok: true,
                json() {
                    return Promise.resolve({ not_a_valid_response: 'some-token' });
                },
            } as FetchResponseType;

            const localFetchMock = jest.fn<FetchFunction>().mockResolvedValue(localStubFetchResponse);

            const uut = new ClientCredentialsFlowFetchImpl(
                fetchConfig,
                stubSecretProvider,
                stubLogger,
                localFetchMock as unknown as FetchFunction,
            );

            await expect(uut.getAccessToken('scope')).rejects.toThrowError(/no access_token found/);
        });

        it('should reject an OAuth handshake response which is a non-200 status code', async () => {
            const localStubFetchResponse: FetchResponseType = {
                ok: false,
                status: 404,
            } as FetchResponseType;

            const localFetchMock = jest.fn<FetchFunction>().mockResolvedValue(localStubFetchResponse);

            const uut = new ClientCredentialsFlowFetchImpl(
                fetchConfig,
                stubSecretProvider,
                stubLogger,
                localFetchMock as unknown as FetchFunction,
            );

            await expect(uut.getAccessToken('scope')).rejects.toThrowError(
                /OAuth server rejected request with status 404/,
            );
        });

        it('should reject an OAuth response which throws an error on JSON parse', async () => {
            const localStubFetchResponse: FetchResponseType = {
                ok: true,
                json() {
                    return Promise.reject(new Error('some parsing error'));
                },
            } as FetchResponseType;

            const localFetchMock = jest.fn<FetchFunction>().mockResolvedValue(localStubFetchResponse);

            const uut = new ClientCredentialsFlowFetchImpl(
                fetchConfig,
                stubSecretProvider,
                stubLogger,
                localFetchMock as unknown as FetchFunction,
            );

            await expect(uut.getAccessToken('scope')).rejects.toThrowError(/some parsing error/);
        });

        it('should reject if the SecretProvider rejects', async () => {
            const throwingSecretProvider: SecretProvider = {
                getSecret: (): Promise<string> => Promise.reject(new Error('simulated error in SecretProvider')),
            };

            const uut = new ClientCredentialsFlowFetchImpl(fetchConfig, throwingSecretProvider, stubLogger);

            await expect(uut.getAccessToken('scope')).rejects.toThrow('simulated error in SecretProvider');
        });

        it('should reject if the OAuth POST to acquire access token rejects', async () => {
            const localFetchMock = jest.fn<FetchFunction>().mockRejectedValue(new Error('simulated error in fetch'));

            const uut = new ClientCredentialsFlowFetchImpl(
                fetchConfig,
                stubSecretProvider,
                stubLogger,
                localFetchMock as unknown as FetchFunction,
            );

            await expect(uut.getAccessToken('scope')).rejects.toThrow('simulated error in fetch');
        });
    });

    describe('getErrorMessageFrom', () => {
        it('returns the message from an Error', () => {
            expect(getErrorMessageFrom(new Error('this is the message'))).toEqual('this is the message');
        });

        it('returns the message from an Error subtype', () => {
            class MyError extends Error {
                constructor(msg: string) {
                    super(msg);
                }
            }

            expect(getErrorMessageFrom(new MyError('this is the message'))).toEqual('this is the message');
        });

        it('returns the stringified form of an object', () => {
            expect(getErrorMessageFrom({ some: 'object' })).toEqual('{"some":"object"}');
        });

        it('returns the plain form of a string', () => {
            expect(getErrorMessageFrom('this is a plain error string')).toEqual('this is a plain error string');
        });
    });
});
