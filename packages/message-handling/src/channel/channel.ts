import { ChannelReader } from './inbound/channelReader';
import { ChannelWriter } from './outbound/channelWriter';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Channel {}

export interface InboundChannel<T> extends Channel {
    reader(): ChannelReader<T>;
}

export interface OutboundChannel<T> extends Channel {
    writer(): ChannelWriter<T>;
}
