import { gunzip } from 'zlib';
import { promisify } from 'util';

import { InboundChannel } from '../channel';
import { TfsMessage } from '../message';
import { IsValidPayload } from '../../pollMessages';

const gunzipp = promisify(gunzip);

export class CompressibleInboundChannel implements InboundChannel {
    constructor(private baseInboundChannel: InboundChannel) {}

    async uncompress(data: string): Promise<object> {
        const bufferIn = Buffer.from(data, 'base64');
        const bufferOut = await gunzipp(bufferIn);
        return JSON.parse(bufferOut.toString());
    }

    async receive<T>(isValidPayload?: IsValidPayload | undefined): Promise<T[]> {
        const msgs = await this.baseInboundChannel.receive<T>(isValidPayload);

        return Promise.all(
            msgs.map(async (msg: T): Promise<T> => {
                const tfsMessage = msg as unknown as TfsMessage<string>;

                if (tfsMessage.unzippedType) {
                    return { ...msg, data: await this.uncompress(tfsMessage.data) };
                } else {
                    return msg;
                }
            }),
        );
    }
}
