import { type Logger } from '@ukri-tfs/logging';
import { SQSBatchItemFailure, SQSBatchResponse, SQSEvent, SQSRecord } from 'aws-lambda';
import { promisify } from 'util';
import { gunzip } from 'zlib';
import {
    type BasicAuthFetch,
    type BasicAuthFetchConfig,
    type BasicAuthFetchConfigBase,
    generateBasicAuthFetch,
} from '../../basicAuthClient/basicAuthFetch';
import { generateLogger } from '../../logging/logging';
import { TfsFetchFunction } from '../../tfsServiceClient/tfsFetchFunction';
import { EventHandlerFunction, EventInfo } from '../eventHandler';
import { TfsMessage } from '../../tfsMessage';
import { type CorrelationIds, getCorrelationIds } from '../../correlationIds/correlationIds';
import { SecretProvider } from '@ukri-tfs/secrets';
import { type EventHandlerConfig } from '../config';
import { Builder as FetchBuilder } from '../../tfsServiceClient/builder';

const gunzipp = promisify(gunzip);

const uncompress = async (data: string): Promise<string> => {
    const bufferIn = Buffer.from(data, 'base64');
    const bufferOut = await gunzipp(bufferIn);
    return bufferOut.toString();
};

const mapRecord = async <PayloadType>(
    lambdaName: string,
    record: SQSRecord,
    handler: EventHandlerFunction<TfsMessage<PayloadType>>,
    eventHandlerConfig: EventHandlerConfig,
    rootLogger: Logger,
    useFetchFunction: boolean,
    basicAuthConfig?: BasicAuthFetchConfigBase,
    eventIsTfsMessage?: boolean,
): Promise<SQSBatchItemFailure | undefined> => {
    let parsedBody: TfsMessage<PayloadType>;

    try {
        const body: unknown = JSON.parse(JSON.parse(record.body)['Message']);

        if (eventIsTfsMessage) {
            parsedBody = body as TfsMessage<PayloadType>;
        } else {
            parsedBody = {
                type: 'unknown',
                data: body as PayloadType,
            };
        }

        if (parsedBody.unzippedType) {
            parsedBody = { ...parsedBody, data: JSON.parse(await uncompress(parsedBody.data as unknown as string)) };
        }
    } catch (e) {
        const logger = generateLogger(lambdaName, {} as CorrelationIds, rootLogger);

        /* istanbul ignore else */
        if (e instanceof Error) {
            logger.error(`unable to parse body of record with message id ${record.messageId}: ${e.message}`);
        } else {
            logger.error(`unable to parse body of record with message id ${record.messageId}: ${JSON.stringify(e)}`);
        }
        return { itemIdentifier: record.messageId };
    }

    const correlationIds = getCorrelationIds(parsedBody);
    const logger = generateLogger(lambdaName, correlationIds, rootLogger);

    try {
        let tfsFetch: TfsFetchFunction;

        if (useFetchFunction) {
            const fetchBuilder = new FetchBuilder(logger)
                .withCorrelationIds(correlationIds)
                .withEventHandlerConfig(eventHandlerConfig);

            tfsFetch = await fetchBuilder.build();
        } else {
            tfsFetch = (() => {
                logger.error('Fetch function not initialized');
            }) as unknown as TfsFetchFunction;
        }

        const eventInfo: EventInfo<TfsMessage<PayloadType>> = {
            eventBody: parsedBody,
            logger,
            tfsFetch,
        };

        if (basicAuthConfig) {
            eventInfo.basicAuthFetch = await getBasicAuthFetch(
                basicAuthConfig,
                correlationIds,
                eventHandlerConfig.secretProvider,
            );
        }

        await handler(eventInfo);

        logger.info(`successfully processed record with message id ${record.messageId}`);
        return undefined;
    } catch (e) {
        if (e instanceof Error) {
            logger.error(`error when processing record with message id ${record.messageId}: ${e.message}`);
        } else {
            logger.error(`error when processing record with message id ${record.messageId}: ${JSON.stringify(e)}`);
        }
        return { itemIdentifier: record.messageId };
    }
};

async function getBasicAuthFetch(
    basicAuthConfig: BasicAuthFetchConfigBase,
    correlationIds: CorrelationIds,
    secretProvider: SecretProvider,
): Promise<BasicAuthFetch | undefined> {
    const basicAuthFetchConfig: BasicAuthFetchConfig = {
        ...basicAuthConfig,
        correlationIds,
    };

    return generateBasicAuthFetch(basicAuthFetchConfig, secretProvider);
}

export const handleSqsEvent = async <PayloadType>(
    lambdaName: string,
    event: SQSEvent,
    handler: EventHandlerFunction<TfsMessage<PayloadType>>,
    eventHandlerConfig: EventHandlerConfig,
    rootLogger: Logger,
    basicAuthConfig?: BasicAuthFetchConfigBase,
    useFetchFunction = true,
    eventIsTfsMessage = true,
): Promise<SQSBatchResponse> => {
    const batchItemFailures = (
        await Promise.all(
            event.Records.map(record =>
                mapRecord(
                    lambdaName,
                    record,
                    handler,
                    eventHandlerConfig,
                    rootLogger,
                    useFetchFunction,
                    basicAuthConfig,
                    eventIsTfsMessage,
                ),
            ),
        )
    ).filter(failure => failure !== undefined) as SQSBatchItemFailure[];

    const response = {
        batchItemFailures,
    };

    rootLogger.debug(
        'response for AWS to interpret for backoff strategy: ',
        JSON.stringify(response, Object.getOwnPropertyNames(response)),
    );
    return response;
};
