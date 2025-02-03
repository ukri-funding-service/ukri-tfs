export interface ChannelReader<T> {
    read(): Promise<T[]>;
}
