import { v4 as uuidv4 } from 'uuid';

export type CorrelationId = string;

export interface CorrelationIds {
    root: CorrelationId;
    parent: CorrelationId;
    current: CorrelationId;
}

export const generateCorrelationId = (): CorrelationId => uuidv4();
