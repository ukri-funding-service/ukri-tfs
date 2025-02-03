import { gzip } from 'zlib';
import { promisify } from 'util';

import { OutboundChannel } from '../channel';
import { TfsMessage } from '../message';

const gzipp = promisify(gzip);

export class CompressibleOutboundChannel implements OutboundChannel {
    constructor(private baseOutboundChannel: OutboundChannel) {}

    async compress(message: TfsMessage<object | string>): Promise<void> {
        const bufferIn = Buffer.from(JSON.stringify(message.data));
        const bufferOut = await gzipp(bufferIn);
        message.data = bufferOut.toString('base64');
    }

    async publish(originalMessage: TfsMessage): Promise<void> {
        const message = { ...originalMessage }; // Don't mutate the message we were passed

        if (message.unzippedType) {
            await this.compress(message);
        }

        await this.baseOutboundChannel.publish(message);
    }

    async publishRaw(payload: string): Promise<void> {
        await this.baseOutboundChannel.publishRaw(payload);
    }
}
