/**
 * Something that can be executed, stopped and restarted.
 *
 * Lifecycle commands:
 * - run:   setup and execute
 * - stop:  terminate execution
 * - rerun: stop running execution and run again
 */
export interface Runnable {
    run(): Promise<void>;
    stop(): Promise<void>;
    rerun(): Promise<void>;
}
