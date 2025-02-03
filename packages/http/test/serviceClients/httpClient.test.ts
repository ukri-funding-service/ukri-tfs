import { AccessTokenProvider } from '@ukri-tfs/auth';
import * as FormData from 'form-data';
import jwt from 'jsonwebtoken';
import fetch, { Headers } from 'node-fetch';
import { TfsHttpClient } from '../../src/serviceClients';
import { ConsoleLogger, Logger } from '@ukri-tfs/logging';

describe('TFS HTTP client', () => {
    const fetchStub = jest.fn();
    let httpClient: TfsHttpClient;

    const logger: Logger = new ConsoleLogger(console);

    beforeEach(() => {
        const accessTokenProviderMock = {
            getCurrentAccessToken: jest.fn().mockResolvedValue('token'),
            refreshAccessToken: jest.fn(),
        } as unknown as AccessTokenProvider;
        const fetchImpl = fetchStub as unknown as typeof fetch;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        httpClient = new TfsHttpClient(accessTokenProviderMock, { maxRetries: 1 }, logger, fetchImpl);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should refresh access token if the token will expire within the next 30 seconds', async () => {
        fetchStub.mockReturnValue({ status: 200, url: 'http://127.0.0.1/applications' });

        const anExpiringToken = jwt.sign({}, 'secret', { expiresIn: 20 });

        const accessTokenProviderMock = {
            getCurrentAccessToken: jest.fn().mockResolvedValue(anExpiringToken),
        } as unknown as AccessTokenProvider;

        httpClient = new TfsHttpClient(
            accessTokenProviderMock,
            { maxRetries: 1 },
            logger,
            fetchStub as unknown as typeof fetch,
        );
        await httpClient.get(
            'user',
            'http://127.0.0.1/applications',
            { root: 'foo', parent: 'bar', current: 'baz' },
            new Headers(),
        );

        expect(accessTokenProviderMock.getCurrentAccessToken).toHaveBeenCalledTimes(1);
    });

    it('should fetch with a body as string if type of body is string', async () => {
        fetchStub.mockReturnValue({ status: 200, url: 'http://127.0.0.1/applications' });
        const expectedBody = 'myBody';

        await httpClient.post('user', 'http://127.0.0.1/applications', expectedBody);

        expect(fetchStub).toHaveBeenCalledWith(
            'http://127.0.0.1/applications',
            expect.objectContaining({ body: expectedBody }),
        );
    });

    it('should fetch with a body as FormData if type of body is FormData', async () => {
        fetchStub.mockReturnValue({ status: 200, url: 'http://127.0.0.1/applications' });
        const expectedBody = {} as unknown as FormData;

        await httpClient.post('user', 'http://127.0.0.1/applications', expectedBody);

        expect(fetchStub).toHaveBeenCalledWith(
            'http://127.0.0.1/applications',
            expect.objectContaining({ body: expectedBody }),
        );
    });

    it('should fetch with a body as FormData if type of body is FormData', async () => {
        fetchStub.mockReturnValue({ status: 200, url: 'http://127.0.0.1/applications' });

        const expectedBody = {} as unknown as FormData;
        await httpClient.patch('user', 'http://127.0.0.1/applications', expectedBody);

        expect(fetchStub).toHaveBeenCalledWith(
            'http://127.0.0.1/applications',
            expect.objectContaining({ body: expectedBody }),
        );
    });
});
