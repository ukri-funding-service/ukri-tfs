import * as schedule from 'node-schedule';
import { InboundChannel } from './pubsub';
import { Logger } from '.';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageHandler = (message: any) => Promise<void>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IsValidPayload = (payload: any) => boolean;

export interface ChannelHandler {
    channel: InboundChannel;
    handle: MessageHandler;
    isValidPayload?: IsValidPayload;
}

export const handleMessages = async (handler: ChannelHandler, logger: Logger): Promise<void> => {
    const messages = await handler.channel.receive(handler.isValidPayload);
    messages.forEach(async message => {
        try {
            await handler.handle(message);
        } catch (err) {
            logger.error('Error handling message', err);
        }
    });
};

export const pollMessages = (channels: Array<ChannelHandler>, logger: Logger): schedule.Job => {
    // 6 stars for one poll per second forever
    return schedule.scheduleJob('* * * * * *', async () => {
        channels.forEach(async channel => {
            await handleMessages(channel, logger);
        });
    });
};
