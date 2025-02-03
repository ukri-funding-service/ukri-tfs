import { LogFormatter, Logger, LoggerDecorator } from '@ukri-tfs/logging';

export class StackTraceLogFormatter implements LogFormatter {
    constructor(private delegate: LogFormatter) {}

    format(...args: unknown[]): string {
        if (args.length > 0 && args[0] instanceof Error) {
            const [error, ...others] = args;
            const errorStack = `${error.stack}`;
            return this.delegate.format(others, errorStack);
        }
        return this.delegate.format(...args);
    }
}

export class DebugStackTraceLogFormatDecorator implements LoggerDecorator {
    constructor(private readonly logFormatter: LogFormatter) {}

    decorate(logger: Logger): Logger {
        return {
            audit: (...args: unknown[]): void => {
                logger.audit(this.logFormatter.format(...args));
            },
            debug: (...args: unknown[]): void => {
                logger.debug(new StackTraceLogFormatter(this.logFormatter).format(...args));
            },
            info: (...args: unknown[]): void => {
                logger.info(this.logFormatter.format(...args));
            },
            warn: (...args: unknown[]): void => {
                logger.warn(this.logFormatter.format(...args));
            },
            error: (...args: unknown[]): void => {
                logger.error(this.logFormatter.format(...args));
            },
        };
    }
}
