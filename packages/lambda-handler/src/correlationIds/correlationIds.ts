import { generateCorrelationIds } from './generateCorrelationIds';

export type CorrelationIds = {
    root: string;
    current: string;
    parent: string;
};

export type ContainsCorrelationIds = {
    correlationIds: CorrelationIds;
};

type WithCorrelationIdsProperties = {
    root: unknown;
    current: unknown;
    parent: unknown;
};

/**
 * Guard function which checks whether the given object is an instance of
 * CorrelationIds
 * @reference CorrelationIds
 * @param obj
 * @returns
 */
export const isCorrelationIds = (obj: unknown): obj is CorrelationIds => {
    if (
        obj !== undefined &&
        obj !== null &&
        typeof obj === 'object' &&
        'root' in obj &&
        'current' in obj &&
        'parent' in obj
    ) {
        const objAsCorrectProperties: WithCorrelationIdsProperties = obj as unknown as WithCorrelationIdsProperties;

        return (
            typeof objAsCorrectProperties.root === 'string' &&
            typeof objAsCorrectProperties.current === 'string' &&
            typeof objAsCorrectProperties.parent === 'string'
        );
    }

    return false;
};

type WithCorrelationIds = { correlationIds: unknown };

/**
 * Guard function which checks whether correlationIds is a top-level property of the
 * given object, and that property has a value which is a CorrelationIds object
 * @param obj
 * @returns
 */
export const isContainsCorrelationIds = (obj: unknown): obj is ContainsCorrelationIds => {
    if (typeof obj === 'object' && obj !== null && 'correlationIds' in obj) {
        const objWithCorrelationIds: WithCorrelationIds = obj as unknown as WithCorrelationIds;

        return (
            typeof objWithCorrelationIds.correlationIds === 'object' &&
            objWithCorrelationIds.correlationIds !== null &&
            isCorrelationIds(objWithCorrelationIds.correlationIds)
        );
    }
    return false;
};

/**
 * Returns either the CorrelationIds from the given object if it contains some,
 * or else generates new ones.
 * @param event
 * @returns
 */
export const getCorrelationIds = (event: unknown): CorrelationIds => {
    if (typeof event === 'object' && event !== null && isContainsCorrelationIds(event)) {
        return event.correlationIds;
    } else {
        return generateCorrelationIds();
    }
};
