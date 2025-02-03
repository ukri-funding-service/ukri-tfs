import { CorrelationIds } from '@ukri-tfs/tfs-request';
import { ApiLogFormatter } from './apiLogFormatter';

export class DbLogFormatter extends ApiLogFormatter {
    constructor(serviceName: string, correlationIds: CorrelationIds, user: string) {
        super(serviceName, correlationIds, user);
        this.layer = 'ORM';
    }
}
