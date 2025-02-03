import { Logger } from '.';

/**
 * A LoggerDecorator allows a Logger's behaviour to be dynamically
 * modified without defining a new type of Logger.
 */
export interface LoggerDecorator {
    decorate(logger: Logger): Logger;
}
