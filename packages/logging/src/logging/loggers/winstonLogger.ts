import { Logger as WinstonLoggerDelegate, LoggerOptions, createLogger } from 'winston';
import { Logger, addProjectWinstonOptions } from '..';
import { LogLevel } from '../options/winston';

export type WinstonAdaptorOptions = {
    customOptions?: LoggerOptions;
    isLocal?: boolean;
};

/**
 * A logger which is implemented using a Winston Logger instance.
 */
export class WinstonLogger implements Logger {
    private logger: WinstonLoggerDelegate;

    constructor(options: WinstonAdaptorOptions) {
        this.logger = createLogger(addProjectWinstonOptions(options.customOptions, options.isLocal));
    }

    log(level: LogLevel, ...messages: string[]): void {
        this.logger.log(level, messages.join(' '));
    }

    warn(...messages: string[]): void {
        this.log('warn', ...messages);
    }

    info(...messages: string[]): void {
        this.log('info', ...messages);
    }

    audit(...messages: string[]): void {
        this.log('audit', ...messages);
    }

    debug(...messages: string[]): void {
        this.log('debug', ...messages);
    }

    error(...messages: string[]): void {
        this.log('error', ...messages);
    }
}
