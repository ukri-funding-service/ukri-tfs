import { describe, expect, it, jest } from '@jest/globals';
import { Logger } from '@ukri-tfs/logging';
import * as tfsFetch from '../../tfsServiceClient/tfsFetchFunction';
import { EventHandlerFunction } from '../eventHandler';
import { handleRestEvent } from './restEventHandler';
import { SecretProvider } from '@ukri-tfs/secrets';
import { AgentProvider } from '../../agent/agentProvider';
import { Agent } from 'https';
import { EventHandlerConfig } from '../config/eventHandlerConfig';
import { type AuthorizationProvider } from '../../authorization';

const UUIDv4Matcher = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

const stubSecretProvider: SecretProvider = {
    getSecret: (id: string): Promise<string> => Promise.resolve(`stub-secret-value-for-${id}`),
};

const stubAuthorizationProvider: AuthorizationProvider = {
    getAuthorization: (): Promise<string> => {
        return Promise.resolve(`Bearer stub-token`);
    },
};

const stubAgent = new Agent({});
const stubAgentProvider: AgentProvider = {
    getAgent: (): Promise<Agent> => Promise.resolve(stubAgent),
};

const stubEventHandlerConfig: EventHandlerConfig = {
    secretProvider: stubSecretProvider,
    agentProvider: stubAgentProvider,
    authorizationProvider: stubAuthorizationProvider,
};

describe('packages/lambda-handler - eventHandling/restEventHandler', () => {
    let mockLogger: Logger;
    let mockFetch: jest.Mock<tfsFetch.TfsFetchFunction>;

    // define a type to more correctly simulate how this will really work. The tests will work
    // with any old object, but this is more real-world
    type TestEvent = { type: string; data: { decision: 'Successful' } };
    const fakeEvent: TestEvent = { type: 'decision-event', data: { decision: 'Successful' } };

    let generateAuthorizedFetchFunctionSpy: jest.SpiedFunction<typeof tfsFetch['generateAuthorizedTfsFetchFunction']>;

    beforeEach(() => {
        mockFetch = jest.fn<tfsFetch.TfsFetchFunction>();

        generateAuthorizedFetchFunctionSpy = jest
            .spyOn(tfsFetch, 'generateAuthorizedTfsFetchFunction')
            .mockResolvedValue(mockFetch);

        mockLogger = {
            audit: () => {},
            error: jest.fn<Logger['error']>(), // mock this so error logging can be validated
            debug: () => {},
            info: () => {},
            warn: () => {},
        };
    });

    afterEach(jest.resetAllMocks);

    afterAll(jest.restoreAllMocks);

    it('should call event handler', async () => {
        const mockHandler: EventHandlerFunction<TestEvent> = jest
            .fn<EventHandlerFunction<TestEvent>>()
            .mockResolvedValue();

        await handleRestEvent('mylambda', fakeEvent, mockHandler, stubEventHandlerConfig, mockLogger);

        expect(mockHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                eventBody: expect.objectContaining({ type: 'decision-event', data: { decision: 'Successful' } }),
                tfsFetch: expect.anything(),
                logger: expect.anything(),
            }),
        );

        expect(generateAuthorizedFetchFunctionSpy).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.objectContaining({
                current: expect.stringMatching(UUIDv4Matcher),
                root: expect.stringMatching(UUIDv4Matcher),
            }),
            expect.anything(),
        );
    });

    it('should call event handler and log exception', async () => {
        const mockHandler: EventHandlerFunction<TestEvent> = jest
            .fn<EventHandlerFunction<TestEvent>>()
            .mockRejectedValue(new Error('Testing error'));

        await expect(
            handleRestEvent('mylambda', fakeEvent, mockHandler, stubEventHandlerConfig, mockLogger),
        ).rejects.toThrow('Handler error: Testing error');

        expect(mockHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                eventBody: expect.objectContaining({ type: 'decision-event', data: { decision: 'Successful' } }),
                tfsFetch: mockFetch,
                // intentionally ignoring logger as irrelevant
            }),
        );

        expect(generateAuthorizedFetchFunctionSpy).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.objectContaining({
                current: expect.stringMatching(UUIDv4Matcher),
                root: expect.stringMatching(UUIDv4Matcher),
            }),
            expect.anything(),
        );

        expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Testing error'));
    });

    it('should call event handler and log on irregularly typed exception', async () => {
        const mockHandler: EventHandlerFunction<TestEvent> = jest
            .fn<EventHandlerFunction<TestEvent>>()
            .mockRejectedValue(
                'Testing error', //NOSONAR
            );

        await expect(
            handleRestEvent('mylambda', fakeEvent, mockHandler, stubEventHandlerConfig, mockLogger),
        ).rejects.toThrow(`Handler error: "Testing error"`);

        expect(mockHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                eventBody: expect.objectContaining({ type: 'decision-event', data: { decision: 'Successful' } }),
                tfsFetch: expect.anything(),
                logger: expect.anything(),
            }),
        );

        expect(generateAuthorizedFetchFunctionSpy).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.objectContaining({
                current: expect.stringMatching(UUIDv4Matcher),
                root: expect.stringMatching(UUIDv4Matcher),
            }),
            expect.anything(),
        );

        expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Testing error'));
    });
});
