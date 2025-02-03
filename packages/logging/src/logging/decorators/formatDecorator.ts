import { LogFormatter, Logger, LoggerDecorator } from '..';

/**
 * A FormatDecorator is a class which can augment a Logger
 * with a LogFormatter to mutate the log data.
 */
export class FormatDecorator implements LoggerDecorator {
    constructor(private readonly formatter: LogFormatter) {}

    /**
     * Create a new instance of Logger which augments the
     * log parameters using the LogFormatter.
     *
     * @param logger the logger to decorate
     * @returns a new Logger which formats the log parameter
     */
    decorate(logger: Logger): Logger {
        return {
            audit: (...args: unknown[]): void => {
                logger.audit(this.formatter.format(...args));
            },
            debug: (...args: unknown[]): void => {
                logger.debug(this.formatter.format(...args));
            },
            info: (...args: unknown[]): void => {
                logger.info(this.formatter.format(...args));
            },
            warn: (...args: unknown[]): void => {
                logger.warn(this.formatter.format(...args));
            },
            error: (...args: unknown[]): void => {
                logger.error(this.formatter.format(...args));
            },
        };
    }
}
