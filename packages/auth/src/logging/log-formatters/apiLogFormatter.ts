import { CorrelationIds } from '@ukri-tfs/tfs-request';
import { doFormatCorrelationIds } from '../formats';
import { ServiceLogFormatter } from './serviceLogFormatter';

export class ApiLogFormatter extends ServiceLogFormatter {
    constructor(
        serviceName: string,
        private correlationIds: CorrelationIds,
        private user: string,
        private operation?: string,
    ) {
        super(serviceName, 'API');
    }

    callSite(): string {
        if (this.operation !== undefined) {
            return `${this.layer}:${this.operation}`;
        } else {
            return `${this.layer}`;
        }
    }

    protected messagePrefix(): string {
        return `${super.messagePrefix()} CorrelationID ${doFormatCorrelationIds(
            this.correlationIds,
        )}: call to ${this.callSite()} by user ${this.user} - `;
    }
}
