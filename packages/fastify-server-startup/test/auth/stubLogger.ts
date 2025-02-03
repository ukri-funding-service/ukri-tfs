import { Logger } from '@ukri-tfs/logging';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class StubLogger implements Logger {
    public auditLogEntries: string[] = [];
    public errorLogEntries: string[] = [];
    public warnLogEntries: string[] = [];

    audit(...args: any[]): void {
        this.auditLogEntries.push(JSON.stringify(args));
    }
    error(...args: any[]): void {
        this.errorLogEntries.push(JSON.stringify(args));
    }
    warn(...args: any[]): void {
        this.warnLogEntries.push(JSON.stringify(args));
    }
    info(..._args: any[]): void {
        /* ignore */
    }
    debug(..._args: any[]): void {
        /* ignore */
    }

    reset(): void {
        this.auditLogEntries.slice(0);
        this.errorLogEntries.slice(0);
        this.warnLogEntries.slice(0);
    }
}
