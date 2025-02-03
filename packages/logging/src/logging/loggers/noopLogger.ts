/* instanbul ignore file */
import { Logger } from '..';

/**
 * A Logger implementation which does nothing ('No Op{eration}') with the provided information.
 */
export class NoopLogger implements Logger {
    audit(..._args: unknown[]): void {}
    debug(..._args: unknown[]): void {}
    info(..._args: unknown[]): void {}
    warn(..._args: unknown[]): void {}
    error(..._args: unknown[]): void {}
}
