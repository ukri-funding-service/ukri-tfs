import { Logger } from '../logger';

/**
 * Logger which uses console.log to output. Parameters are prefixed
 * with a severity label and a timestamp, and then concatenated with space
 * as a term separator.
 *
 * NOTE: all severities are output using the log() function, NOT via
 * error(), etc, on the console object.
 */
export class ConsoleLogger implements Logger {
    constructor(private readonly logger: Console) {}

    warn(...messages: string[]): void {
        this.logger.log(`[ warning ] ${new Date().toJSON()}: ${messages.join(' ')}`);
    }
    info(...messages: string[]): void {
        this.logger.log(`[ info ] ${new Date().toJSON()}: ${messages.join(' ')}`);
    }
    audit(...messages: string[]): void {
        this.logger.log(`[ audit ] ${new Date().toJSON()}: ${messages.join(' ')}`);
    }
    debug(...messages: string[]): void {
        this.logger.log(`[ debug ] ${new Date().toJSON()}: ${messages.join(' ')}`);
    }
    error(...messages: string[]): void {
        this.logger.log(`[ error ] ${new Date().toJSON()}: ${messages.join(' ')}`);
    }
}
