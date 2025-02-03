export interface ChannelWriter<T> {
    write(data: T): Promise<void>;
}
