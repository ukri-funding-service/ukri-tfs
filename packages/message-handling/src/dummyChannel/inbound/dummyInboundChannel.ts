// Dummy channel code provided as an optional placeholder for a working channel.

import { ChannelReader, InboundChannel } from '../../channel';
import { DummyChannelReaderDEADCODE } from './dummyChannelReader';

export class DummyInboundChannelDEADCODE implements InboundChannel<string> {
    constructor(public readonly channelId: string) {}

    reader(): ChannelReader<string> {
        return new DummyChannelReaderDEADCODE();
    }
}
