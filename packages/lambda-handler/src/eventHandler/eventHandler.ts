import { type Logger } from '@ukri-tfs/logging';
import { type BasicAuthFetch } from '../basicAuthClient/basicAuthFetch';
import { type TfsFetchFunction } from '../tfsServiceClient/tfsFetchFunction';

export interface EventInfo<EventType = object> {
    eventBody: EventType;
    tfsFetch: TfsFetchFunction;
    logger: Logger;
    basicAuthFetch?: BasicAuthFetch;
}

export type EventHandlerFunction<EventType = unknown, ResultType = void> = (
    eventInfo: EventInfo<EventType>,
) => Promise<ResultType>;
