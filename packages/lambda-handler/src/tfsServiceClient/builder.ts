import { type Logger } from '@ukri-tfs/logging';
import { type CorrelationIds } from '../correlationIds';
import { type EventHandlerConfig } from '../eventHandler';
import { type FetchFunction, generateAuthorizedTfsFetchFunction, type TfsFetchFunction } from './tfsFetchFunction';
import fetch from 'node-fetch';

export class Builder {
    private fetchImpl: FetchFunction | undefined;
    private eventHandlerConfig: EventHandlerConfig | undefined;
    private correlationIds: CorrelationIds | undefined;

    constructor(private readonly logger: Logger) {}

    withEventHandlerConfig(config: EventHandlerConfig): Builder {
        this.eventHandlerConfig = config;
        return this;
    }

    withFetchFunction(fetchFunction: FetchFunction): Builder {
        this.fetchImpl = fetchFunction;
        return this;
    }

    withCorrelationIds(correlationIds: CorrelationIds): Builder {
        this.correlationIds = correlationIds;
        return this;
    }

    async build(): Promise<TfsFetchFunction> {
        if (this.correlationIds === undefined) {
            throw new Error('correlationIds is a required parameter');
        }

        /* istanbul ignore next */
        if (this.fetchImpl === undefined) {
            this.logger.debug('No FetchFunction provided, using built-in fetch');
            this.fetchImpl = fetch;
        } else {
            this.logger.debug('Using client-provided FetchFunction');
        }

        if (this.eventHandlerConfig === undefined) {
            throw new Error('eventHandlerConfig is a required parameter');
        }

        return generateAuthorizedTfsFetchFunction(
            this.fetchImpl,
            this.eventHandlerConfig.agentProvider,
            this.eventHandlerConfig.authorizationProvider,
            this.correlationIds,
            this.logger,
        );
    }
}
