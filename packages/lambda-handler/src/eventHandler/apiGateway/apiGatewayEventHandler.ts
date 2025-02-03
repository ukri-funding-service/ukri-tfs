import { Logger } from '@ukri-tfs/logging';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { generateLogger } from '../../logging/logging';
import { Builder as FetchBuilder } from '../../tfsServiceClient/builder';
import { CorrelationIds, getCorrelationIds } from '../../correlationIds/correlationIds';
import { type EventHandlerConfig } from '../config';
import { EventHandlerFunction, EventInfo } from '../eventHandler';
import { BasicAuthFetchConfigBase, generateBasicAuthFetch } from '../../basicAuthClient/basicAuthFetch';

export type ApiGatewayEventHandlerFunction = EventHandlerFunction<APIGatewayProxyEvent, APIGatewayProxyResult>;

export const handleApiGatewayEvent = async (
    lambdaName: string,
    event: APIGatewayProxyEvent,
    handler: ApiGatewayEventHandlerFunction,
    eventHandlerConfig: EventHandlerConfig,
    rootLogger: Logger,
    basicAuthConfig?: BasicAuthFetchConfigBase,
): Promise<APIGatewayProxyResult> => {
    const correlationIds = extractCorrelationIdsFromEventOrGenerate(event);
    const logger = generateLogger(lambdaName, correlationIds, rootLogger);

    try {
        logger.info(`Request: ${JSON.stringify(event)}`);

        const tfsFetch = await new FetchBuilder(logger)
            .withCorrelationIds(correlationIds)
            .withEventHandlerConfig(eventHandlerConfig)
            .build();

        const eventInfo: EventInfo<APIGatewayProxyEvent> = {
            eventBody: event,
            logger,
            tfsFetch,
        };
        if (basicAuthConfig) {
            eventInfo.basicAuthFetch = await generateBasicAuthFetch(
                {
                    ...basicAuthConfig,
                    correlationIds,
                },
                eventHandlerConfig.secretProvider,
            );
        }

        const response = await handler(eventInfo);

        logger.info(`Response: ${JSON.stringify(response)}`);

        return response;
    } catch (err) {
        logger.error(`Handler error: ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};

export const extractCorrelationIdsFromEventOrGenerate = (event: APIGatewayProxyEvent): CorrelationIds => {
    let body: unknown = undefined;

    if (event.body !== null) {
        try {
            body = JSON.parse(event.body);
        } catch {
            /* Intentionally ignored */
        }
    }

    return getCorrelationIds(body);
};
