import { Logger } from '../../logger';

export class DummyLogger implements Logger {
    error(..._args: unknown[]): void {
        /* Intentionally blank */
    }
    warn(..._args: unknown[]): void {
        /* Intentionally blank */
    }
    info(..._args: unknown[]): void {
        /* Intentionally blank */
    }
    debug(..._args: unknown[]): void {
        /* Intentionally blank */
    }
}
