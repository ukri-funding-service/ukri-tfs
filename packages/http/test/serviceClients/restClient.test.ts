import { AccessTokenProvider } from '@ukri-tfs/auth';
import { Logger } from '@ukri-tfs/logging';
import FormData from 'form-data';
import jwt from 'jsonwebtoken';
import fetch, { Headers, Response } from 'node-fetch';
import { TfsHttpClient, TfsRestClient, getResourceUrl } from '../../src/serviceClients';

export const getStubLogger = (): Logger => {
    return {
        audit: jest.fn(),
        debug: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
    };
};

function fail(message: string) {
    throw new Error(message);
}

describe('packages/http - restClient', () => {
    const logger = getStubLogger();

    let testTokenProvider: AccessTokenProvider;
    const fetchStub = jest.fn();
    let httpClient: TfsHttpClient;

    const errorHandler = async (response: Response) => {
        switch (response.status) {
            case 401:
                throw new Error(`401: Invalid/unspecified authentication credentials for "${response.url}"`);
            default:
                const errorText = await response.text();
                throw new Error(errorText);
        }
    };

    beforeEach(() => {
        testTokenProvider = new AccessTokenProvider(
            {
                url: 'http://127.0.0.1',
                clientId: 'clientId',
                clientSecret: 'secret',
                scope: 'access_scope',
            },
            {
                error(message: string): string {
                    return message;
                },
                warn(message: string): string {
                    return message;
                },
                info(message: string): string {
                    return message;
                },
                debug(message: string): string {
                    return message;
                },
                audit(message: string): string {
                    return message;
                },
            },
        );

        const accessToken = jwt.sign({}, 'secret', { expiresIn: 60 });
        testTokenProvider.getCurrentAccessToken = jest.fn().mockResolvedValue(accessToken);
        testTokenProvider.refreshAccessToken = jest.fn();

        const fetchImpl = fetchStub as unknown as typeof fetch;

        httpClient = new TfsHttpClient(testTokenProvider, { maxRetries: 5 }, logger, fetchImpl);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return resource if base url is empty', () => {
        expect(getResourceUrl('http://127.0.0.1/applications')).toEqual('http://127.0.0.1/applications');
    });

    it('should return base url if resource is empty', () => {
        expect(getResourceUrl('', 'http://127.0.0.1/applications')).toEqual('http://127.0.0.1/applications');
    });

    it('should return base url/resource as resource url', () => {
        expect(getResourceUrl('/applications', 'http://127.0.0.1/api')).toEqual('http://127.0.0.1/api/applications');
    });

    it('should return base url/resource as resource url if resource has no / prefix', () => {
        expect(getResourceUrl('applications', 'http://127.0.0.1/api')).toEqual('http://127.0.0.1/api/applications');
    });

    it('should return base url/resource as resource url if base url has no trailing /', () => {
        expect(getResourceUrl('/applications', 'http://127.0.0.1/api')).toEqual('http://127.0.0.1/api/applications');
    });

    it('should return base url/resource as resource url if base url has no trailing / and resource has no / prefix', () => {
        expect(getResourceUrl('applications', 'http://127.0.0.1/api')).toEqual('http://127.0.0.1/api/applications');
    });

    it('should return the name of the client', () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        expect(restClient.getClientName()).toEqual('Test Client');
    });

    it('should map url parameters to strings', () => {
        type ExampleParams = {
            aBool: boolean;
            aString: string;
            aList: string[];
            aNumber: number;
        };
        const exampleParams: ExampleParams = {
            aBool: true,
            aString: 'a string',
            aList: ['1thing', '2thing', '3thing'],
            aNumber: 4,
        };
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        const queryString = restClient.mapToURLParams<ExampleParams>(exampleParams);

        expect(queryString).toEqual('?aBool=true&aString=a+string&aList=1thing&aList=2thing&aList=3thing&aNumber=4');
    });

    it("should fail to map url parameters that don't implement toString", () => {
        type ExampleParams = {
            aBadObject: {};
        };
        const aBadObject = {
            toString: undefined,
        };
        const exampleParams: ExampleParams = {
            aBadObject,
        };
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        const call = () => restClient.mapToURLParams<ExampleParams>(exampleParams);

        expect(call).toThrow('All parameters must implement toString');
    });

    it("should fail to map url parameters that don't implement toString", () => {
        type ExampleParams = {
            aBadList: {}[];
        };
        const aBadObject = {
            toString: undefined,
        };
        const exampleParams: ExampleParams = {
            aBadList: [aBadObject],
        };
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        const call = () => restClient.mapToURLParams<ExampleParams>(exampleParams);

        expect(call).toThrow('All parameters must implement toString');
    });

    it('should return the JSON value for a GET request when the response status is 200', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({
            status: 200,
            json() {
                return Promise.resolve({ dummy: 'value' });
            },
            url: 'http://127.0.0.1/',
        });

        expect(
            await restClient.get('user', '/', {
                correlationIds: { root: 'foo', parent: 'bar', current: 'baz' },
            }),
        ).toEqual({ dummy: 'value' });
    });

    it('should return the raw response for a GET request when rawResponse is set to true', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({
            status: 200,
            url: 'http://127.0.0.1/',
        });

        expect(
            await restClient.get(
                'user',
                '/',
                {
                    correlationIds: { root: 'foo', parent: 'bar', current: 'baz' },
                },
                true,
            ),
        ).toEqual({ status: 200, url: 'http://127.0.0.1/' });
    });

    it('should return an empty object for a GET request when the response status is 204', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({
            status: 204,
            json() {
                return Promise.resolve('');
            },
            url: 'http://127.0.0.1/',
        });

        expect(
            await restClient.get('user', '/', {
                correlationIds: { root: 'foo', parent: 'bar', current: 'baz' },
            }),
        ).toEqual({});
    });

    it('should return the JSON value for a PUT request when the response status is 200', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({
            status: 200,
            json() {
                return Promise.resolve({ dummy: 'value' });
            },
        });

        expect(
            await restClient.put('user', '/', {}, { correlationIds: { root: 'foo', parent: 'bar', current: 'baz' } }),
        ).toEqual({ dummy: 'value' });
    });

    it('should return nothing for a PUT request when the response status is 204', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({
            status: 204,
        });

        const response = await restClient.put(
            'user',
            '/',
            {},
            { correlationIds: { root: 'foo', parent: 'bar', current: 'baz' } },
        );
        expect(response).toEqual({});
    });

    it('should return the JSON value for a POST request when the response status is 200', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({
            status: 200,
            json() {
                return Promise.resolve({ dummy: 'value' });
            },
            url: 'http://127.0.0.1/',
        });

        expect(
            await restClient.post('user', '/', {}, { correlationIds: { root: 'foo', parent: 'bar', current: 'baz' } }),
        ).toEqual({ dummy: 'value' });
    });

    it('should return nothing for a POST request when the response status is 204', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({
            status: 204,
            url: 'http://127.0.0.1/',
        });

        const response = await restClient.post(
            'user',
            '/',
            {},
            { correlationIds: { root: 'foo', parent: 'bar', current: 'baz' } },
        );

        expect(response).toEqual({});
    });

    it('should return the JSON value for a PATCH request when the response status is 200', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({
            status: 200,
            json() {
                return Promise.resolve({ dummy: 'value' });
            },
            url: 'http://127.0.0.1/',
        });

        expect(
            await restClient.patch('user', '/', {}, { correlationIds: { root: 'foo', parent: 'bar', current: 'baz' } }),
        ).toEqual({ dummy: 'value' });
    });

    it('should return nothing for a PATCH request when the response status is 204', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({
            status: 204,
            url: 'http://127.0.0.1/',
        });

        const response = await restClient.post(
            'user',
            '/',
            {},
            { correlationIds: { root: 'foo', parent: 'bar', current: 'baz' } },
        );

        expect(response).toEqual({});
    });

    it('should retry GET request with new access token when the response status is 401', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({ status: 401, url: 'http://127.0.0.1/' });

        try {
            await restClient.get('user', '/', {});
            fail('Expected error to be thrown');
        } catch (e) {
            expect((e as { message: string }).message).toEqual(
                '401: Invalid/unspecified authentication credentials for "http://127.0.0.1/"',
            );
        }

        expect(fetchStub).toHaveBeenCalledTimes(6);
        expect(testTokenProvider.refreshAccessToken).toHaveBeenCalledTimes(5);
        expect(testTokenProvider.getCurrentAccessToken).toHaveBeenCalledTimes(6);
    });

    it('should retry PUT request with new access token when the response status is 401', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({ status: 401, url: 'http://127.0.0.1/' });

        try {
            await restClient.put('user', '/', {}, {});
            fail('Expected error to be thrown');
        } catch (e) {
            expect((e as { message: string }).message).toEqual(
                '401: Invalid/unspecified authentication credentials for "http://127.0.0.1/"',
            );
        }

        expect(fetchStub).toHaveBeenCalledTimes(6);
        expect(testTokenProvider.refreshAccessToken).toHaveBeenCalledTimes(5);
        expect(testTokenProvider.getCurrentAccessToken).toHaveBeenCalledTimes(6);
    });

    it('should retry POST request with new access token when the response status is 401', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({ status: 401, url: 'http://127.0.0.1/' });

        try {
            await restClient.post('user', '/', {}, {});
            fail('Expected error to be thrown');
        } catch (e) {
            expect((e as { message: string }).message).toEqual(
                '401: Invalid/unspecified authentication credentials for "http://127.0.0.1/"',
            );
        }

        expect(fetchStub).toHaveBeenCalledTimes(6);
        expect(testTokenProvider.refreshAccessToken).toHaveBeenCalledTimes(5);
        expect(testTokenProvider.getCurrentAccessToken).toHaveBeenCalledTimes(6);
    });

    it('should retry PATCH request with new access token when the response status is 401', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({ status: 401, url: 'http://127.0.0.1/' });

        try {
            await restClient.patch('user', '/', {}, {});
            fail('Expected error to be thrown');
        } catch (e) {
            expect((e as { message: string }).message).toEqual(
                '401: Invalid/unspecified authentication credentials for "http://127.0.0.1/"',
            );
        }

        expect(fetchStub).toHaveBeenCalledTimes(6);
        expect(testTokenProvider.refreshAccessToken).toHaveBeenCalledTimes(5);
        expect(testTokenProvider.getCurrentAccessToken).toHaveBeenCalledTimes(6);
    });

    it('should provide expected parameters for a GET request', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({
            status: 200,
            json() {
                return Promise.resolve({ dummy: 'value' });
            },
            url: 'http://127.0.0.1/',
        });

        testTokenProvider.getCurrentAccessToken = jest.fn().mockResolvedValue('access_token');

        await restClient.get('user', '/', {
            correlationIds: { root: 'foo', parent: 'bar', current: 'baz' },
        });

        expect(fetchStub).toHaveBeenCalledWith('http://127.0.0.1/', {
            method: 'GET',
            body: undefined,
            headers: new Headers({
                Accept: ['application/json'],
                'Content-Type': ['application/json; charset=utf-8'],
                Authorization: ['Bearer access_token'],
                'x-tfsuserid': ['user'],
                'x-rootcorrelationid': ['foo'],
                'x-correlationid': ['baz'],
            }),
        });
    });

    it('should provide expected parameters for a PUT request', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({
            status: 200,
            json() {
                return Promise.resolve({ dummy: 'value' });
            },
            url: 'http://127.0.0.1/',
        });

        testTokenProvider.getCurrentAccessToken = jest.fn().mockResolvedValue('access_token');
        const requestHeaders = new Headers({ 'x-entity-version': 'versionNumber' });

        await restClient.put(
            'user',
            '/',
            { dummy: 'value' },
            { correlationIds: { root: 'foo', parent: 'bar', current: 'baz' }, headers: requestHeaders },
        );

        expect(fetchStub).toHaveBeenCalledWith('http://127.0.0.1/', {
            method: 'PUT',
            body: JSON.stringify({ dummy: 'value' }),
            headers: new Headers({
                Accept: ['application/json'],
                'Content-Type': ['application/json; charset=utf-8'],
                Authorization: ['Bearer access_token'],
                'x-tfsuserid': ['user'],
                'x-rootcorrelationid': ['foo'],
                'x-correlationid': ['baz'],
                'x-entity-version': ['versionNumber'],
            }),
        });
    });

    it('should provide expected parameters for a POST request', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({
            status: 200,
            json() {
                return Promise.resolve({ dummy: 'value' });
            },
            url: 'http://127.0.0.1/',
        });

        testTokenProvider.getCurrentAccessToken = jest.fn().mockResolvedValue('access_token');

        await restClient.post(
            'user',
            '/',
            { dummy: 'value' },
            { correlationIds: { root: 'foo', parent: 'bar', current: 'baz' } },
        );

        expect(fetchStub).toHaveBeenCalledWith('http://127.0.0.1/', {
            method: 'POST',
            body: JSON.stringify({ dummy: 'value' }),
            headers: new Headers({
                Accept: ['application/json'],
                'Content-Type': ['application/json; charset=utf-8'],
                Authorization: ['Bearer access_token'],
                'x-tfsuserid': ['user'],
                'x-rootcorrelationid': ['foo'],
                'x-correlationid': ['baz'],
            }),
        });
    });

    it('should provide expected parameters for a PATCH request', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({
            status: 200,
            json() {
                return Promise.resolve({ dummy: 'value' });
            },
            url: 'http://127.0.0.1/',
        });

        testTokenProvider.getCurrentAccessToken = jest.fn().mockResolvedValue('access_token');

        await restClient.patch(
            'user',
            '/',
            { dummy: 'value' },
            { correlationIds: { root: 'foo', parent: 'bar', current: 'baz' } },
        );

        expect(fetchStub).toHaveBeenCalledWith('http://127.0.0.1/', {
            method: 'PATCH',
            body: JSON.stringify({ dummy: 'value' }),
            headers: new Headers({
                Accept: ['application/json'],
                'Content-Type': ['application/json; charset=utf-8'],
                Authorization: ['Bearer access_token'],
                'x-tfsuserid': ['user'],
                'x-rootcorrelationid': ['foo'],
                'x-correlationid': ['baz'],
            }),
        });
    });

    it('should provide expected parameters for a DELETE request', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({
            status: 200,
            json() {
                return Promise.resolve({ dummy: 'value' });
            },
            url: 'http://127.0.0.1/',
        });

        testTokenProvider.getCurrentAccessToken = jest.fn().mockResolvedValue('access_token');

        const requestHeaders = new Headers({ 'x-entity-version': 'versionNumber' });

        await restClient.delete('user', '/', {
            correlationIds: { root: 'foo', parent: 'bar', current: 'baz' },
            headers: requestHeaders,
        });

        expect(fetchStub).toHaveBeenCalledWith('http://127.0.0.1/', {
            method: 'DELETE',
            body: undefined,
            headers: new Headers({
                Accept: ['application/json'],
                'Content-Type': ['application/json; charset=utf-8'],
                Authorization: ['Bearer access_token'],
                'x-tfsuserid': ['user'],
                'x-rootcorrelationid': ['foo'],
                'x-correlationid': ['baz'],
                'x-entity-version': ['versionNumber'],
            }),
        });
    });

    it('should not set both auth headers when there is no token provider and the user string is empty', async () => {
        const fetchImpl = fetchStub as unknown as typeof fetch;
        const httpClientWithNoTokenProvider = new TfsHttpClient(undefined, { maxRetries: 5 }, logger, fetchImpl);

        const restClient = new TfsRestClient(
            'Test Client',
            httpClientWithNoTokenProvider,
            'http://127.0.0.1',
            errorHandler,
        );

        fetchStub.mockReturnValue({
            status: 200,
            json() {
                return Promise.resolve({ dummy: 'value' });
            },
            url: 'http://127.0.0.1/',
        });

        await restClient.get('', '/', { correlationId: '90fc1c00-1f11-448a-9f1b-70092f3e8215' });

        expect(fetchStub).toHaveBeenCalledWith('http://127.0.0.1/', {
            method: 'GET',
            body: undefined,
            headers: new Headers({
                Accept: ['application/json'],
                'Content-Type': ['application/json; charset=utf-8'],
                'x-correlationid': ['90fc1c00-1f11-448a-9f1b-70092f3e8215'],
            }),
        });
    });

    it('should not set Authorization header when there is no token provider but should set x-tfsuserid if user string is not empty', async () => {
        const fetchImpl = fetchStub as unknown as typeof fetch;
        const httpClientWithNoTokenProvider = new TfsHttpClient(undefined, { maxRetries: 5 }, logger, fetchImpl);

        const restClient = new TfsRestClient(
            'Test Client',
            httpClientWithNoTokenProvider,
            'http://127.0.0.1',
            errorHandler,
        );

        fetchStub.mockReturnValue({
            status: 200,
            json() {
                return Promise.resolve({ dummy: 'value' });
            },
            url: 'http://127.0.0.1/',
        });

        await restClient.get('user', '/', {
            correlationIds: { root: 'foo', parent: 'bar', current: 'baz' },
        });

        expect(fetchStub).toHaveBeenCalledWith('http://127.0.0.1/', {
            method: 'GET',
            body: undefined,
            headers: new Headers({
                Accept: ['application/json'],
                'Content-Type': ['application/json; charset=utf-8'],
                'x-tfsuserid': ['user'],
                'x-correlationid': ['baz'],
                'x-rootcorrelationid': ['foo'],
            }),
        });
    });

    it('should not set x-tfsuserid if user string is empty', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({
            status: 200,
            json() {
                return Promise.resolve({ dummy: 'value' });
            },
            url: 'http://127.0.0.1/',
        });

        testTokenProvider.getCurrentAccessToken = jest.fn().mockResolvedValue('access_token');

        await restClient.get('', '/', {
            correlationIds: { root: 'foo', parent: 'bar', current: 'baz' },
        });

        expect(fetchStub).toHaveBeenCalledWith('http://127.0.0.1/', {
            method: 'GET',
            body: undefined,
            headers: new Headers({
                Authorization: ['Bearer access_token'],
                Accept: ['application/json'],
                'Content-Type': ['application/json; charset=utf-8'],
                'x-correlationid': ['baz'],
                'x-rootcorrelationid': ['foo'],
            }),
        });
    });

    it('should not set x-correlationid if no correlation id is passed in', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({
            status: 200,
            json() {
                return Promise.resolve({ dummy: 'value' });
            },
            url: 'http://127.0.0.1/',
        });

        testTokenProvider.getCurrentAccessToken = jest.fn().mockResolvedValue('access_token');

        await restClient.get('', '/', {});

        expect(fetchStub).toHaveBeenCalledWith('http://127.0.0.1/', {
            method: 'GET',
            body: undefined,
            headers: new Headers({
                Authorization: ['Bearer access_token'],
                Accept: ['application/json'],
                'Content-Type': ['application/json; charset=utf-8'],
            }),
        });
    });

    it('should set only a x-correlationid if only a single correlation id string is passed in', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({
            status: 200,
            json() {
                return Promise.resolve({ dummy: 'value' });
            },
            url: 'http://127.0.0.1/',
        });

        testTokenProvider.getCurrentAccessToken = jest.fn().mockResolvedValue('access_token');

        await restClient.get('', '/', { correlationId: '90fc1c00-1f11-448a-9f1b-70092f3e8215' });

        expect(fetchStub).toHaveBeenCalledWith('http://127.0.0.1/', {
            method: 'GET',
            body: undefined,
            headers: new Headers({
                Authorization: ['Bearer access_token'],
                Accept: ['application/json'],
                'Content-Type': ['application/json; charset=utf-8'],
                'x-correlationid': ['90fc1c00-1f11-448a-9f1b-70092f3e8215'],
            }),
        });
    });

    it('should return the JSON value for a POST with formdata request when the response status is 200', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({
            status: 200,
            json() {
                return Promise.resolve({ dummy: 'value' });
            },
            url: 'http://127.0.0.1/',
        });

        expect(
            await restClient.postFormData('user', '/', {} as FormData, {
                correlationIds: { root: 'foo', parent: 'bar', current: 'baz' },
            }),
        ).toEqual({ dummy: 'value' });
    });

    it('should retry POST with formdata request with new access token when the response status is 401', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({ status: 401, url: 'http://127.0.0.1/' });

        try {
            await restClient.postFormData('user', '/', {} as FormData, {});
            fail('Expected error to be thrown');
        } catch (e) {
            expect((e as { message: string }).message).toEqual(
                '401: Invalid/unspecified authentication credentials for "http://127.0.0.1/"',
            );
        }

        expect(fetchStub).toHaveBeenCalledTimes(6);
        expect(testTokenProvider.refreshAccessToken).toHaveBeenCalledTimes(5);
        expect(testTokenProvider.getCurrentAccessToken).toHaveBeenCalledTimes(6);
    });

    it('should provide expected parameters for a POST with formdata request', async () => {
        const restClient = new TfsRestClient('Test Client', httpClient, 'http://127.0.0.1', errorHandler);

        fetchStub.mockReturnValue({
            status: 200,
            json() {
                return Promise.resolve({ dummy: 'value' });
            },
            url: 'http://127.0.0.1/',
        });

        testTokenProvider.getCurrentAccessToken = jest.fn().mockResolvedValue('access_token');
        const formData = { dummy: 'value' } as unknown as FormData;

        await restClient.postFormData('user', '/', formData, {
            correlationIds: { root: 'foo', parent: 'bar', current: 'baz' },
        });

        expect(fetchStub).toHaveBeenCalledWith('http://127.0.0.1/', {
            method: 'POST',
            body: formData,
            headers: new Headers({
                Accept: ['application/json'],
                'Content-Type': ['application/json; charset=utf-8'],
                Authorization: ['Bearer access_token'],
                'x-tfsuserid': ['user'],
                'x-rootcorrelationid': ['foo'],
                'x-correlationid': ['baz'],
            }),
        });
    });
});
