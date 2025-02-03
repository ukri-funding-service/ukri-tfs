import { Logger } from '@ukri-tfs/logging';
import { generateLogger } from '../../logging/logging';
import { Builder as FetchBuilder } from '../../tfsServiceClient/builder';
import { EventHandlerFunction } from '../eventHandler';
import { EventHandlerError } from '../eventHandlingError';
import { getCorrelationIds } from '../../correlationIds/correlationIds';
import { type EventHandlerConfig } from '../config';

export const handleRestEvent = async <EventType>(
    lambdaName: string,
    event: EventType,
    handler: EventHandlerFunction<EventType>,
    eventHandlerConfig: EventHandlerConfig,
    rootLogger: Logger,
): Promise<void> => {
    const correlationIds = getCorrelationIds(event);
    const logger = generateLogger(lambdaName, correlationIds, rootLogger);

    try {
        logger.info(`Request: ${JSON.stringify(event)}`);

        logger.debug('Building ClientCredentialsTokenProvider');

        const tfsFetch = await new FetchBuilder(logger)
            .withCorrelationIds(correlationIds)
            .withEventHandlerConfig(eventHandlerConfig)
            .build();

        const response = await handler({ eventBody: event, logger, tfsFetch });
        logger.info(`Response: ${JSON.stringify(response)}`);
    } catch (err) {
        logger.error(`Handler error: ${err}`);

        if (err instanceof Error) {
            throw new EventHandlerError(`Handler error: ${err.message}`);
        } else {
            throw new EventHandlerError(`Handler error: ${JSON.stringify(err)}`);
        }
    }
};
