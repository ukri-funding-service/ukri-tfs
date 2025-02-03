import { IncomingMessage } from 'http';
import { generateCorrelationId, CorrelationIds, CorrelationId } from './correlationIds';
import { firstHeaderValue } from './firstHeaderValue';

/**
 * @deprecated This variable is deprecated. It's only required to allow GraphQL to function normally. Remove once GraphQL is removed.
 */
export const correlationIdNotFoundOnRequest = '[CORRELATION ID NOT FOUND]';

export const parentCorrelationIdHeader = 'x-correlationid';
export const rootCorrelationIdHeader = 'x-rootcorrelationid';

export function getParentCorrelationId(request: IncomingMessage): CorrelationId | undefined {
    return firstHeaderValue(request, parentCorrelationIdHeader);
}

export function getRootCorrelationId(request: IncomingMessage): CorrelationId | undefined {
    return firstHeaderValue(request, rootCorrelationIdHeader);
}

// TODO: Rework part of this function and accompanying tests once all services use correlationIds strategy.
export function getCorrelationIds(request: IncomingMessage): CorrelationIds {
    const root = getRootCorrelationId(request);
    const parent = getParentCorrelationId(request);
    const current = generateCorrelationId();

    if (root && parent) {
        return {
            current,
            parent,
            root,
        };
    }

    if (root && !parent) {
        throw Error(
            `Inbound request contains ${rootCorrelationIdHeader} header but ${parentCorrelationIdHeader} header is missing`,
        );
    }

    if (!root && parent) {
        // This is the legacy format that can be replaced once graphQL is removed.
        return {
            root: correlationIdNotFoundOnRequest,
            parent,
            current,
        };
        // replace with this...
        // throw Error(
        //     `Inbound request contains ${parentCorrelationIdHeader} header but ${rootCorrelationIdHeader} header is missing`
        // );
    }

    // This is the legacy format that can be replaced once graphQL is removed.
    return {
        root: current,
        parent: current,
        current: current,
    };
    // replace with this...
    // throw Error(
    //     `Inbound request is missing the ${rootCorrelationIdHeader} header and the ${parentCorrelationIdHeader} header`
    // );
}
