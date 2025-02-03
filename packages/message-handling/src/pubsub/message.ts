import { CorrelationIds } from '@ukri-tfs/tfs-request';

export interface Header {
    key: string;
    value: string;
}

export type TfsMessage<BodyType = object> = {
    type: string;
    unzippedType?: string;
    data: BodyType;
    correlationIds?: CorrelationIds;
};

export type Message = TfsMessage | string;

export type TypeGuard<T> = (payload: unknown) => payload is T;

export const isTfsMessageObject = (payload: unknown): payload is TfsMessage => {
    return typeof payload === 'object' && 'type' in payload! && 'data' in payload;
};
