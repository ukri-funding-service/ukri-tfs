import { LogFormatter } from '@ukri-tfs/logging';
import { CorrelationIds } from '@ukri-tfs/tfs-request';
import { anonymousUser } from '../../auth/context';
import { doFormatCorrelationIds } from '../formats';
import { ServiceLogFormatter } from './serviceLogFormatter';

export class EventLogFormatter extends ServiceLogFormatter {
    constructor(
        serviceName: string,
        private eventId: string,
        private correlationIds: CorrelationIds,
        private user: string,
    ) {
        super(serviceName, 'Messaging');
    }

    protected messagePrefix(): string {
        return `${super.messagePrefix()} CorrelationID ${doFormatCorrelationIds(this.correlationIds)}: event-id=${
            this.eventId
        } by user ${this.user} - `;
    }
}

export const buildEventLogFormatter = (
    user: string | undefined,
    service: string,
    correlationIds: CorrelationIds,
    eventId: string,
): LogFormatter => {
    return new EventLogFormatter(service, eventId, correlationIds, user || anonymousUser);
};
