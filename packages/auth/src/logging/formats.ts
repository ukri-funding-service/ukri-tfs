import { CorrelationIds } from '@ukri-tfs/tfs-request';
import { RequestContext } from '../auth/context';

export type LogWithRequestAndDescription = (context: RequestContext, description: string) => Promise<void>;
export type LogWithRequestAndError = (context: RequestContext, error: Error) => Promise<void>;

export type LogWithDescription = (description: string) => void;
export type LogWithError = (error: Error) => void;

export const serviceFormat = (service: string, layer: 'RESTAPI' | 'API' | 'ORM'): string => {
    return `${service}:${layer}`;
};

export const formatCorrelationIds = (context: RequestContext): string => {
    return doFormatCorrelationIds(context.correlationIds);
};

export const doFormatCorrelationIds = (correlationIds: CorrelationIds): string => {
    const ids = correlationIds ? correlationIds : ({} as CorrelationIds);
    return `Root:${ids.root} Parent:${ids.parent} Current:${ids.current}`;
};

const noUserDefault = '[NO USER AUTHENTICATED]';

export const getUserFromContext = (context: RequestContext): string | undefined => {
    if (context.userData && context.userData.userId) {
        return context.userData.userId;
    } else {
        return noUserDefault;
    }
};
