import { IncomingMessage } from 'http';

type SendFlash = (request: IncomingMessage, category: string, message: string) => void;
type GetFlash = (request: IncomingMessage, category: string) => string[];

export type FlashServiceInterface = {
    getFlash: GetFlash;
    sendFlash: SendFlash;
};

export abstract class FlashStore<T extends object> {
    public data: Readonly<Partial<T>> = {} as Partial<T>;

    constructor(
        private req: IncomingMessage,
        private flashService: FlashServiceInterface,
        private uniqueIdentifier: string = '',
    ) {
        // load the data from the flash and then resend so it can be used on page refresh.
        this.load();
        this.save({});
    }

    private load = (): void => {
        const flashes = this.flashService.getFlash(this.req, this.uniqueIdentifier);
        if (flashes.length === 0) {
            this.data = {} as Partial<T>;
            return;
        }

        // It is possible for the flash to have multiple entries. The most recent is stored in the last position
        const raw = JSON.parse(flashes[flashes.length - 1]);
        this.data = raw;
    };

    public save = (updates: Partial<T>): void => {
        const nextState = { ...this.data, ...updates };
        this.data = nextState;
        this.flashService.sendFlash(this.req, this.uniqueIdentifier, JSON.stringify(nextState));
    };

    public clear = (): void => {
        this.data = {} as Partial<T>;
        this.flashService.sendFlash(this.req, this.uniqueIdentifier, JSON.stringify(this.data));
    };
}
