/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Logger {
    audit(...args: any[]): void;
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
}
