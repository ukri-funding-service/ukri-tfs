// Dummy channel code provided as an optional placeholder for a working channel.

import { ChannelWriter, OutboundChannel } from '../../channel';
import { DummyChannelWriterDEADCODE } from './dummyChannelWriter';

export class DummyOutboundChannelDEADCODE implements OutboundChannel<string> {
    constructor(public readonly channelId: string, private readonly theWriter?: ChannelWriter<string>) {}

    writer(): ChannelWriter<string> {
        if (this.theWriter) {
            return this.theWriter;
        }

        return new DummyChannelWriterDEADCODE();
    }
}
