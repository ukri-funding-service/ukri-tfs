import { type CorrelationIds } from './correlationIds/correlationIds';

export interface TfsMessage<PayloadType = object> {
    type: string;
    unzippedType?: string;
    data: PayloadType;
    correlationIds?: CorrelationIds;
}
