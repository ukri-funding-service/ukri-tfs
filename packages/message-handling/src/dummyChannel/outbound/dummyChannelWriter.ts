// Dummy channel code provided as an optional placeholder for a working channel.

import { ChannelWriter } from '../../channel/outbound';

export class DummyChannelWriterDEADCODE implements ChannelWriter<string> {
    public writtenData: string[];

    constructor() {
        this.writtenData = [];
    }

    async write(data: string): Promise<void> {
        this.writtenData.push(data);
    }
}
