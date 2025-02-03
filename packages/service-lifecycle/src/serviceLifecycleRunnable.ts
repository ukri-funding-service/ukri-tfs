import { Runnable } from './runnable';
import { ServiceLifecycle } from './serviceLifecycle';

export type RunnerState = 'running' | 'stopped';

/**
 * ServiceRunner which implements basic lifecycle phases to
 * orchestrate startup and shutdown, and implement managed
 * signal handlers for key POSIX signals.
 *
 * run() executes the service by progressing through the following
 * lifecycle stages in sequence:
 * - configure
 * - bootstrap
 * - startup
 *
 * rerun() is similar to run except it does not trigger configure,
 * running in sequence:
 * - shutdown
 * - bootstrap
 * - startup
 *
 * The 'standard' POSIX signals are managed as follows:
 * - INT | TERM | QUIT: stop
 * - HUP: rerun.
 */
export class ServiceLifecycleRunnable implements Runnable {
    constructor(private readonly serviceLifecyle: ServiceLifecycle) {}

    private state: RunnerState = 'stopped';

    registerSignalHandlers(): void {
        for (const eventName in ['SIGINT', 'SIGQUIT', 'SIGTERM']) {
            process.on(eventName, this.stop);
        }

        process.on('SIGHUP', this.rerun);
    }

    unregisterSignalHandlers(): void {
        for (const eventName in ['SIGINT', 'SIGQUIT', 'SIGTERM']) {
            process.removeListener(eventName, this.stop);
        }

        process.removeListener('SIGHUP', this.rerun);
    }

    get runnerState(): RunnerState {
        return this.state;
    }

    async run(): Promise<void> {
        if (this.state === 'running') {
            return;
        }

        this.state = 'running';
        this.registerSignalHandlers();
        await this.serviceLifecyle.configure();
        await this.serviceLifecyle.bootstrap();
        await this.serviceLifecyle.startup();
    }

    async stop(): Promise<void> {
        if (this.state === 'stopped') {
            return;
        }

        try {
            await this.serviceLifecyle.shutdown();
        } finally {
            this.unregisterSignalHandlers();
            this.state = 'stopped';
        }
    }

    async rerun(): Promise<void> {
        await this.stop();

        this.state = 'running';
        await this.serviceLifecyle.bootstrap();
        await this.serviceLifecyle.startup();
    }
}
