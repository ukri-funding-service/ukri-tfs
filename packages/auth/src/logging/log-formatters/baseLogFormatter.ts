import { LogFormatter } from '@ukri-tfs/logging';

export abstract class BaseLogFormatter implements LogFormatter {
    protected abstract messagePrefix(): string;

    format(...args: unknown[]): string {
        return `${this.messagePrefix()}${args.join(' ')}.`;
    }
}
