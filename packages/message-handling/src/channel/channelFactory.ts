import { Channel } from './channel';

export interface BaseChannelConfig {
    channelId: string;
}

export interface ChannelFactory<T extends Channel> {
    create(config: unknown): T;
}
