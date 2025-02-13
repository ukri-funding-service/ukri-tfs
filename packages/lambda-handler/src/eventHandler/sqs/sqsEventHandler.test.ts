import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Logger, NoopLogger } from '@ukri-tfs/logging';
import { SQSEvent, SQSRecord } from 'aws-lambda';
import * as basicAuthFetchStub from '../../basicAuthClient/basicAuthFetch';
import { BasicAuthFetchConfigBase } from '../../basicAuthClient/basicAuthFetch';
import * as tfsFetch from '../../tfsServiceClient/tfsFetchFunction';
import { EventHandlerFunction } from '../eventHandler';
import { handleSqsEvent } from './sqsEventHandler';
import { SecretProvider } from '@ukri-tfs/secrets';
import { AgentProvider } from '../../agent/agentProvider';
import { Agent } from 'https';
import { EventHandlerConfig } from '../config/eventHandlerConfig';
import { type AuthorizationProvider } from '../../authorization';

const stubLogger = new NoopLogger();

const validSingleRecordSQSEvent: SQSEvent = {
    Records: [
        {
            messageId: '1234',
            body: JSON.stringify({
                Message: JSON.stringify({
                    type: 'https://some-schema/some-event-gz',
                    unzippedType: 'https://some-schema/some-event',
                    data: 'H4sIAAAAAAAAE6tWykjNyclXslIqzy/KSVGqBQDRQQnYEQAAAA==',
                    correlationIds: {
                        root: 'root',
                        parent: 'parent',
                        current: 'current',
                    },
                }),
            }),
        } as SQSRecord,
    ],
};

const stubSecretProvider: SecretProvider = {
    getSecret: (id: string): Promise<string> => {
        return Promise.resolve(`stub-secret-value-for-${id}`);
    },
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

describe('packages/lambda-handler - eventHandling/sqsEventHandler', () => {
    let mockFetch: jest.Mock<tfsFetch.TfsFetchFunction>;

    let mockLogger: Logger;

    describe('authorized requests', () => {
        let generateAuthorizedFetchFunctionSpy: jest.SpiedFunction<
            typeof tfsFetch['generateAuthorizedTfsFetchFunction']
        >;

        let errorLoggerMock: jest.Mock<Logger['error']>;
        let mockHandler: jest.Mock<EventHandlerFunction<object>>;

        beforeEach(() => {
            mockFetch = jest.fn<tfsFetch.TfsFetchFunction>();

            generateAuthorizedFetchFunctionSpy = jest
                .spyOn(tfsFetch, 'generateAuthorizedTfsFetchFunction')
                .mockResolvedValue(mockFetch);

            errorLoggerMock = jest.fn<Logger['error']>();

            mockLogger = {
                audit: jest.fn(),
                error: errorLoggerMock,
                debug: jest.fn(),
                info: jest.fn(),
                warn: jest.fn(),
            };

            mockHandler = jest.fn<EventHandlerFunction<object>>();
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call fetch function builder with expected parameters', async () => {
            await handleSqsEvent(
                'mylambda',
                validSingleRecordSQSEvent,
                mockHandler,
                stubEventHandlerConfig,
                stubLogger,
            );

            expect(generateAuthorizedFetchFunctionSpy).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.objectContaining({
                    root: 'root',
                    current: 'current',
                }),
                expect.anything(),
            );
        });

        it('should not generate fetch function if not needed', async () => {
            await handleSqsEvent(
                'mylambda',
                validSingleRecordSQSEvent,
                mockHandler,
                stubEventHandlerConfig,
                stubLogger,
                undefined,
                false,
            );

            expect(generateAuthorizedFetchFunctionSpy).not.toBeCalled();
        });

        it('should call event handler with individual message', async () => {
            const batchResponse = await handleSqsEvent(
                'mylambda',
                validSingleRecordSQSEvent,
                mockHandler,
                stubEventHandlerConfig,
                stubLogger,
                undefined,
            );

            expect(mockHandler).toHaveBeenCalledWith(
                expect.objectContaining({
                    eventBody: expect.objectContaining({
                        type: 'https://some-schema/some-event-gz',
                        data: { hello: 'world' },
                    }),
                }),
            );

            expect(batchResponse).toEqual({
                batchItemFailures: [],
            });
        });

        it('should handle case when event is not a TFS message', async () => {
            const isTfsMessage = false;

            const validSingleRecordSQSEventNonTFSMessage: SQSEvent = {
                Records: [
                    {
                        messageId: '1234',
                        body: JSON.stringify({
                            Message: JSON.stringify({
                                foo: 'bar',
                            }),
                        }),
                    } as SQSRecord,
                ],
            };

            const batchResponse = await handleSqsEvent(
                'mylambda',
                validSingleRecordSQSEventNonTFSMessage,
                mockHandler,
                stubEventHandlerConfig,
                stubLogger,
                undefined,
                undefined,
                isTfsMessage,
            );

            expect(mockHandler).toHaveBeenCalledWith(
                expect.objectContaining({
                    eventBody: expect.objectContaining({
                        type: 'unknown',
                        data: {
                            foo: 'bar',
                        },
                    }),
                }),
            );

            expect(batchResponse).toEqual({
                batchItemFailures: [],
            });
        });

        it('should call event handler with individual message and basic auth config', async () => {
            const basicAuthConfig: BasicAuthFetchConfigBase = {
                usernameARN: 'username',
                passwordARN: 'password',
            };

            const mockBasicAuthFetch = jest.fn<basicAuthFetchStub.BasicAuthFetch>();
            const generateBasicAuthFetchSpy = jest
                .spyOn(basicAuthFetchStub, 'generateBasicAuthFetch')
                .mockResolvedValue(mockBasicAuthFetch);

            const batchResponse = await handleSqsEvent(
                'mylambda',
                validSingleRecordSQSEvent,
                mockHandler,
                stubEventHandlerConfig,
                stubLogger,
                basicAuthConfig,
            );

            expect(generateBasicAuthFetchSpy).toHaveBeenCalledWith(
                {
                    correlationIds: { root: 'root', parent: 'parent', current: 'current' },
                    usernameARN: 'username',
                    passwordARN: 'password',
                },
                stubSecretProvider,
            );

            expect(mockHandler).toHaveBeenCalledWith(
                expect.objectContaining({
                    eventBody: expect.objectContaining({
                        type: 'https://some-schema/some-event-gz',
                        data: { hello: 'world' },
                    }),
                    basicAuthFetch: mockBasicAuthFetch,
                }),
            );

            expect(batchResponse).toEqual({
                batchItemFailures: [],
            });
        });

        it('should have no processing failures for individual message', async () => {
            const batchResponse = await handleSqsEvent(
                'mylambda',
                validSingleRecordSQSEvent,
                mockHandler,
                stubEventHandlerConfig,
                stubLogger,
                undefined,
            );

            expect(batchResponse).toEqual({
                batchItemFailures: [],
            });
        });

        it('should allow absent correlation ids and call event handler with individual message', async () => {
            const sqsEvent: SQSEvent = {
                Records: [
                    {
                        messageId: '1234',
                        body: JSON.stringify({
                            Message: JSON.stringify({
                                type: 'https://some-schema/some-event',
                                data: { here: 'is some data' },
                            }),
                        }),
                    } as SQSRecord,
                ],
            };

            const batchResponse = await handleSqsEvent(
                'mylambda',
                sqsEvent,
                mockHandler,
                stubEventHandlerConfig,
                stubLogger,
                undefined,
            );

            expect(batchResponse).toEqual({
                batchItemFailures: [],
            });
        });

        it('should call event handler with two messages', async () => {
            const sqsEvent: SQSEvent = {
                Records: [
                    {
                        messageId: '1234',
                        body: JSON.stringify({
                            Message: JSON.stringify({
                                type: 'https://some-schema/some-event',
                                data: { here: 'is some data' },
                                correlationIds: {
                                    root: 'root',
                                    parent: 'parent',
                                    current: 'current',
                                },
                            }),
                        }),
                    },
                    {
                        messageId: '5678',
                        body: JSON.stringify({
                            Message: JSON.stringify({
                                type: 'https://some-schema/some-event',
                                data: { here: 'is some other data' },
                                correlationIds: {
                                    root: 'root',
                                    parent: 'parent',
                                    current: 'current',
                                },
                            }),
                        }),
                    },
                ] as SQSRecord[],
            };

            await handleSqsEvent('mylambda', sqsEvent, mockHandler, stubEventHandlerConfig, stubLogger, undefined);

            expect(mockHandler).toHaveBeenCalledWith(
                expect.objectContaining({
                    eventBody: expect.objectContaining({
                        type: 'https://some-schema/some-event',
                        data: { here: 'is some data' },
                    }),
                }),
            );

            expect(mockHandler).toHaveBeenCalledWith(
                expect.objectContaining({
                    eventBody: expect.objectContaining({
                        type: 'https://some-schema/some-event',
                        data: { here: 'is some other data' },
                    }),
                }),
            );
        });

        it('should respond with a failed batch item if handler throws an exception', async () => {
            const sqsEvent: SQSEvent = {
                Records: [
                    {
                        messageId: '1234',
                        body: JSON.stringify({
                            Message: JSON.stringify({
                                type: 'https://some-schema/some-event',
                                data: { here: 'is some data' },
                                correlationIds: {
                                    root: 'root',
                                    parent: 'parent',
                                    current: 'current',
                                },
                            }),
                        }),
                    } as SQSRecord,
                ],
            };

            mockHandler.mockRejectedValue(new Error('Failed as service is down'));

            const batchResponse = await handleSqsEvent(
                'mylambda',
                sqsEvent,
                mockHandler,
                stubEventHandlerConfig,
                mockLogger,
                undefined,
            );

            expect(mockLogger.error).toHaveBeenCalledTimes(1);
            expect(errorLoggerMock.mock.calls[0][0]).toMatch(
                /.*error when processing record with message id 1234: Failed as service is down.*/,
            );

            expect(batchResponse).toEqual({
                batchItemFailures: [
                    {
                        itemIdentifier: '1234',
                    },
                ],
            });
        });

        it('should respond with a failed batch item if handler throws an exception of irregular type', async () => {
            const sqsEvent: SQSEvent = {
                Records: [
                    {
                        messageId: '1234',
                        body: JSON.stringify({
                            Message: JSON.stringify({
                                type: 'https://some-schema/some-event',
                                data: { here: 'is some data' },
                                correlationIds: {
                                    root: 'root',
                                    parent: 'parent',
                                    current: 'current',
                                },
                            }),
                        }),
                    } as SQSRecord,
                ],
            };

            mockHandler.mockRejectedValue('Failed as service is down');

            const batchResponse = await handleSqsEvent(
                'mylambda',
                sqsEvent,
                mockHandler,
                stubEventHandlerConfig,
                mockLogger,
                undefined,
            );

            expect(mockLogger.error).toHaveBeenCalledTimes(1);
            expect(errorLoggerMock.mock.calls[0][0]).toMatch(
                /.*error when processing record with message id 1234: "Failed as service is down".*/,
            );

            expect(batchResponse).toEqual({
                batchItemFailures: [
                    {
                        itemIdentifier: '1234',
                    },
                ],
            });
        });

        it('should handle case when unable to parse message body', async () => {
            const sqsEvent: SQSEvent = {
                Records: [
                    {
                        messageId: '1234',
                        body: 'this is invalid',
                    } as SQSRecord,
                ],
            };

            const batchResponse = await handleSqsEvent(
                'mylambda',
                sqsEvent,
                mockHandler,
                stubEventHandlerConfig,
                mockLogger,
                undefined,
            );

            expect(mockLogger.error).toHaveBeenCalledTimes(1);
            expect(errorLoggerMock.mock.calls[0][0]).toMatch(
                /.*unable to parse body of record with message id 1234: Unexpected token 'h', \"this is invalid\" is not valid JSON.*/,
            );

            expect(batchResponse).toEqual({
                batchItemFailures: [
                    {
                        itemIdentifier: '1234',
                    },
                ],
            });
        });

        it('should throw an exception given fetch is used without being initialized', async () => {
            const eventHandler: EventHandlerFunction = async ({ tfsFetch: tfsFetchFunction }) => {
                await tfsFetchFunction('url', {}, '');
            };

            await handleSqsEvent(
                'mylambda',
                validSingleRecordSQSEvent,
                eventHandler,
                stubEventHandlerConfig,
                mockLogger,
                undefined,
                false,
            );

            expect(mockLogger.error).toBeCalled();
            expect(mockLogger.error).toBeCalledWith(expect.stringContaining('Fetch function not initialized'));
        });
    });
});
