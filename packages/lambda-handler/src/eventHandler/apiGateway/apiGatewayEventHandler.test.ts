import { describe, expect, it, jest } from '@jest/globals';
import { Logger, NoopLogger } from '@ukri-tfs/logging';
import { APIGatewayEventRequestContext, APIGatewayProxyEvent } from 'aws-lambda';
import * as tfsFetch from '../../tfsServiceClient/tfsFetchFunction';
import * as basicAuthFetch from '../../basicAuthClient/basicAuthFetch';
import {
    extractCorrelationIdsFromEventOrGenerate,
    handleApiGatewayEvent,
    ApiGatewayEventHandlerFunction,
} from './apiGatewayEventHandler';
import { SecretProvider } from '@ukri-tfs/secrets';
import { CorrelationIds } from '../../correlationIds/correlationIds';
import { Mock } from 'jest-mock';
import { AgentProvider } from '../../agent/agentProvider';
import { Agent } from 'https';
import { EventHandlerConfig } from '../config/eventHandlerConfig';
import { type AuthorizationProvider } from '../../authorization';

const UUIDv4Matcher = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
const stubLogger = new NoopLogger();

const stubSecretProvider: SecretProvider = {
    getSecret: (id: string): Promise<string> => Promise.resolve(`stub-secret-value-for-${id}`),
};

const stubAuthorizationProvider: AuthorizationProvider = {
    getAuthorization: (): Promise<string> => {
        return Promise.resolve(`Bearer stub-token`);
    },
};

const stubAgent = new Agent();
const stubAgentProvider: AgentProvider = {
    getAgent: (): Promise<Agent> => Promise.resolve(stubAgent),
};

const stubEventHandlerConfig: EventHandlerConfig = {
    secretProvider: stubSecretProvider,
    agentProvider: stubAgentProvider,
    authorizationProvider: stubAuthorizationProvider,
};

describe('packages/lambda-handler - eventHandling/apiGatewayEventHandler', () => {
    const mockLogger: Logger = {
        audit: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
    };

    const mockRequestContext: APIGatewayEventRequestContext = {} as APIGatewayEventRequestContext;

    const fakeEvent: APIGatewayProxyEvent = {
        body: '{}',
        headers: {},
        httpMethod: 'GET',
        path: '/',
        queryStringParameters: {},
        multiValueHeaders: {},
        isBase64Encoded: false,
        pathParameters: {},
        multiValueQueryStringParameters: {},
        requestContext: mockRequestContext,
        resource: '',
        stageVariables: null,
    };

    const regexStringMatch = expect.stringMatching(
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );

    const expectCorrelationIds = {
        root: regexStringMatch,
        parent: regexStringMatch,
        current: regexStringMatch,
    };

    afterAll(jest.restoreAllMocks);

    describe('handleApiGatewayEvent', () => {
        let mockFetch: jest.Mock<tfsFetch.TfsFetchFunction>;
        let generateAuthorizedFetchFunctionSpy: jest.SpiedFunction<
            typeof tfsFetch['generateAuthorizedTfsFetchFunction']
        >;
        let generateBaseAuthFunctionSpy: jest.SpiedFunction<typeof basicAuthFetch['generateBasicAuthFetch']>;

        beforeEach(() => {
            mockFetch = jest.fn<tfsFetch.TfsFetchFunction>();

            generateAuthorizedFetchFunctionSpy = jest
                .spyOn(tfsFetch, 'generateAuthorizedTfsFetchFunction')
                .mockResolvedValue(mockFetch);

            generateBaseAuthFunctionSpy = jest
                .spyOn(basicAuthFetch, 'generateBasicAuthFetch')
                .mockResolvedValue(mockFetch);
        });

        afterEach(jest.resetAllMocks);

        describe('happy path - handler reports success', () => {
            const mockHandler = jest.fn<ApiGatewayEventHandlerFunction>().mockResolvedValue({
                statusCode: 200,
                body: 'OK',
            });

            afterEach(jest.resetAllMocks);

            it('should return 200 status', async () => {
                const response = await handleApiGatewayEvent(
                    'mylambda',
                    fakeEvent,
                    mockHandler,
                    stubEventHandlerConfig,
                    new NoopLogger(),
                );

                expect(response).toEqual({ statusCode: 200, body: 'OK' });
            });

            it('should call event handler with expected parameters', async () => {
                await handleApiGatewayEvent('mylambda', fakeEvent, mockHandler, stubEventHandlerConfig, stubLogger);

                expect(mockHandler).toHaveBeenCalledWith(
                    expect.objectContaining({
                        eventBody: fakeEvent,
                    }),
                );
            });

            it('should generate an authorized fetch function with correlation ids', async () => {
                await handleApiGatewayEvent('mylambda', fakeEvent, mockHandler, stubEventHandlerConfig, stubLogger);

                expect(generateAuthorizedFetchFunctionSpy).toHaveBeenCalledWith(
                    expect.anything(),
                    expect.anything(),
                    expect.anything(),
                    expect.objectContaining(expectCorrelationIds),
                    expect.anything(),
                );
            });

            it('should generate an basic Auth Fetch function with correlation ids', async () => {
                const baseAuthConfig = { usernameARN: 'some_username', passwordARN: 'some_password' };
                await handleApiGatewayEvent(
                    'mylambda',
                    fakeEvent,
                    mockHandler,
                    stubEventHandlerConfig,
                    stubLogger,
                    baseAuthConfig,
                );

                expect(generateBaseAuthFunctionSpy).toHaveBeenCalledWith(
                    {
                        usernameARN: 'some_username',
                        passwordARN: 'some_password',
                        correlationIds: expectCorrelationIds,
                    },
                    stubEventHandlerConfig.secretProvider,
                );
            });
        });

        describe('dealing with an error in the handler', () => {
            let mockHandler: Mock<ApiGatewayEventHandlerFunction>;

            beforeEach(() => {
                mockHandler = jest.fn<ApiGatewayEventHandlerFunction>().mockRejectedValue(new Error('Testing error'));
            });

            afterEach(jest.resetAllMocks);

            it('should return 500 status code', async () => {
                const response = await handleApiGatewayEvent(
                    'mylambda',
                    fakeEvent,
                    mockHandler,
                    stubEventHandlerConfig,
                    mockLogger,
                );

                expect(response).toEqual({ statusCode: 500, body: '{"message":"Internal Server Error"}' });
            });

            it('should call event handler', async () => {
                await handleApiGatewayEvent('mylambda', fakeEvent, mockHandler, stubEventHandlerConfig, mockLogger);

                expect(mockHandler).toHaveBeenCalledWith(
                    expect.objectContaining({
                        eventBody: fakeEvent,
                    }),
                );
            });

            it('should generate authorized fetch function with correlation ids', async () => {
                await handleApiGatewayEvent('mylambda', fakeEvent, mockHandler, stubEventHandlerConfig, mockLogger);

                expect(generateAuthorizedFetchFunctionSpy).toHaveBeenCalledWith(
                    expect.anything(),
                    expect.anything(),
                    expect.anything(),
                    expect.objectContaining(expectCorrelationIds),
                    expect.anything(),
                );
            });

            it('should report an error', async () => {
                await handleApiGatewayEvent('mylambda', fakeEvent, mockHandler, stubEventHandlerConfig, mockLogger);

                expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Testing error'));
            });
        });

        describe('dealing with an irregularly typed exception in the handler', () => {
            let mockHandler: Mock<ApiGatewayEventHandlerFunction>;

            beforeEach(() => {
                // NOTE: The following is intentionally NOT an Error object - hence 'irregularly typed'
                mockHandler = jest.fn<ApiGatewayEventHandlerFunction>().mockRejectedValue('Testing error');
            });

            afterEach(jest.resetAllMocks);

            it('should return 500', async () => {
                const response = await handleApiGatewayEvent(
                    'mylambda',
                    fakeEvent,
                    mockHandler,
                    stubEventHandlerConfig,
                    mockLogger,
                );

                expect(response).toEqual({ statusCode: 500, body: '{"message":"Internal Server Error"}' });
            });

            it('should call event handler', async () => {
                await handleApiGatewayEvent('mylambda', fakeEvent, mockHandler, stubEventHandlerConfig, mockLogger);

                expect(mockHandler).toHaveBeenCalledWith(
                    expect.objectContaining({
                        eventBody: fakeEvent,
                    }),
                );
            });

            it('should generate authorized fetch function with correlation ids', async () => {
                await handleApiGatewayEvent('mylambda', fakeEvent, mockHandler, stubEventHandlerConfig, mockLogger);

                expect(generateAuthorizedFetchFunctionSpy).toHaveBeenCalledWith(
                    expect.anything(),
                    expect.anything(),
                    expect.anything(),
                    expect.objectContaining(expectCorrelationIds),
                    expect.anything(),
                );
            });

            it('should log an error', async () => {
                await handleApiGatewayEvent('mylambda', fakeEvent, mockHandler, stubEventHandlerConfig, mockLogger);

                expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Testing error'));
            });
        });
    });

    describe('extractCorrelationIdsFromEventOrGenerate', () => {
        it('pulls correlation ids from the event body when present', () => {
            const correlationIds: CorrelationIds = {
                root: 'root',
                current: 'current',
                parent: 'parent',
            };

            const bodyData = {
                correlationIds,
            };

            const mockEvent = {
                ...fakeEvent,
                body: JSON.stringify(bodyData),
            };

            expect(extractCorrelationIdsFromEventOrGenerate(mockEvent)).toMatchObject({
                root: 'root',
                current: 'current',
                parent: 'parent',
            });
        });

        it('generates correlation ids when they are not present in the event body', () => {
            const bodyData = {
                noCorrelationIds: 'here',
            };

            const mockEvent = {
                ...fakeEvent,
                body: JSON.stringify(bodyData),
            };

            expect(extractCorrelationIdsFromEventOrGenerate(mockEvent)).toMatchObject({
                root: expect.stringMatching(UUIDv4Matcher),
                current: expect.stringMatching(UUIDv4Matcher),
                parent: expect.stringMatching(UUIDv4Matcher),
            });
        });

        it('generates correlation ids from the event when the event is not an object', () => {
            const mockEvent = {
                ...fakeEvent,
                body: 'just a plain string, not an object',
            };

            expect(extractCorrelationIdsFromEventOrGenerate(mockEvent)).toMatchObject({
                root: expect.stringMatching(UUIDv4Matcher),
                current: expect.stringMatching(UUIDv4Matcher),
                parent: expect.stringMatching(UUIDv4Matcher),
            });
        });
    });
});
