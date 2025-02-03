import { TfsMessage } from './message';
import { IsValidPayload } from '../pollMessages';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Channel {}

export interface InboundChannel extends Channel {
    receive<T>(isValidPayload?: IsValidPayload): Promise<T[]>;
}

export interface OutboundChannel extends Channel {
    publish(message: TfsMessage): Promise<void>;
    publishRaw(payload: string): Promise<void>;
}
