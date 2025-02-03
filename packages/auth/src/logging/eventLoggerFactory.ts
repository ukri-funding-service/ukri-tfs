import { Logger, FormatDecorator } from '@ukri-tfs/logging';
import { CorrelationIds } from '@ukri-tfs/tfs-request';
import { RequestContext } from '../auth/context';
import { buildEventLogFormatter } from './log-formatters';
import { buildRequestContextEventLogger } from './requestContextEventLogger';

export interface EventLoggerFactory {
    build(eventId: string): Logger;
}

export class RequestContextEventLoggerFactory implements EventLoggerFactory {
    constructor(readonly requestContext: RequestContext) {}

    build(eventId: string): Logger {
        return buildRequestContextEventLogger(this.requestContext, eventId);
    }
}

export class EventLoggerFactoryImpl implements EventLoggerFactory {
    constructor(
        private logger: Logger,
        private user: string | undefined,
        private service: string,
        private correlationIds: CorrelationIds,
    ) {}

    build(eventId: string): Logger {
        const eventLogFormatter = buildEventLogFormatter(this.user, this.service, this.correlationIds, eventId);

        return new FormatDecorator(eventLogFormatter).decorate(this.logger);
    }
}
