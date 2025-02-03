import { randomUUID } from 'crypto';
import { type CorrelationIds } from './correlationIds';

export const generateCorrelationIdsFactory = (idGenerator: () => string) => (): CorrelationIds => {
    const correlationId = idGenerator();

    return {
        root: correlationId,
        parent: correlationId,
        current: correlationId,
    };
};

export const generateCorrelationIds = generateCorrelationIdsFactory(randomUUID);
