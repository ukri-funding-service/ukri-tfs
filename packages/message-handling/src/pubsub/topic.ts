import { Message } from '.';

export interface Topic {
    readonly name: string;

    publish(message: Message): void;
}
