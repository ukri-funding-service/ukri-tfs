// Dummy channel code provided as an optional placeholder for a working channel.

import { ChannelReader } from '../../channel/inbound';

export class DummyChannelReaderDEADCODE implements ChannelReader<string> {
    public returnMeOnRead: string[];
    public throwThisOnRead?: Error;

    constructor() {
        this.returnMeOnRead = [];
    }

    async read(): Promise<string[]> {
        if (this.throwThisOnRead) {
            throw this.throwThisOnRead;
        }

        return this.returnMeOnRead;
    }
}
