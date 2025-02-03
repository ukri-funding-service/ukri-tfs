import { beforeEach, describe, expect, it } from '@jest/globals';
import { ServiceLifecycleRunnable } from '../src';

export class MockServiceLifecycle {
    constructor() {}

    public configureCount = 0;
    public bootstrapCount = 0;
    public startupCount = 0;
    public shutdownCount = 0;

    configure(): Promise<void> {
        this.configureCount += 1;
        return Promise.resolve();
    }

    bootstrap(): Promise<void> {
        this.bootstrapCount += 1;
        return Promise.resolve();
    }

    startup(): Promise<void> {
        this.startupCount += 1;
        return Promise.resolve();
    }

    shutdown(): Promise<void> {
        this.shutdownCount += 1;
        return Promise.resolve();
    }

    reset(): void {
        this.configureCount = 0;
        this.bootstrapCount = 0;
        this.startupCount = 0;
        this.shutdownCount = 0;
    }
}

describe('serviceLifecycle - serviceLifecycleRunnable', () => {
    it('can be instantiated with a service lifecycle argument', () => {
        expect(new ServiceLifecycleRunnable(new MockServiceLifecycle())).toBeDefined();
    });

    it('can access the state', () => {
        const runner = new ServiceLifecycleRunnable(new MockServiceLifecycle());

        expect(runner.runnerState).toBe('stopped');
    });

    describe('lifecycle commands', () => {
        let mockServiceLifecycle: MockServiceLifecycle;

        beforeEach(() => {
            mockServiceLifecycle = new MockServiceLifecycle();
        });

        it('run causes state to be running', async () => {
            const serviceRunner = new ServiceLifecycleRunnable(mockServiceLifecycle);

            await serviceRunner.run();

            expect(serviceRunner.runnerState).toBe('running');
        });

        it('run causes configure, bootstrap and startup only to be run', async () => {
            const serviceRunner = new ServiceLifecycleRunnable(mockServiceLifecycle);

            await serviceRunner.run();

            expect(serviceRunner.runnerState).toBe('running');
            expect(mockServiceLifecycle.configureCount).toBe(1);
            expect(mockServiceLifecycle.bootstrapCount).toBe(1);
            expect(mockServiceLifecycle.startupCount).toBe(1);
            expect(mockServiceLifecycle.shutdownCount).toBe(0);
        });

        it('can run repeatedly', async () => {
            const serviceRunner = new ServiceLifecycleRunnable(mockServiceLifecycle);

            await serviceRunner.run();
            await serviceRunner.run();
        });

        it('running repeatedly only causes one set of startup', async () => {
            const serviceRunner = new ServiceLifecycleRunnable(mockServiceLifecycle);

            await serviceRunner.run();
            await serviceRunner.run();
            await serviceRunner.run();

            expect(mockServiceLifecycle.configureCount).toBe(1);
            expect(mockServiceLifecycle.bootstrapCount).toBe(1);
            expect(mockServiceLifecycle.startupCount).toBe(1);
        });

        it('can rerun after run', async () => {
            const serviceRunner = new ServiceLifecycleRunnable(mockServiceLifecycle);

            await serviceRunner.run();
            await serviceRunner.rerun();
        });

        it('rerun leaves state as running', async () => {
            const serviceRunner = new ServiceLifecycleRunnable(mockServiceLifecycle);

            await serviceRunner.run();
            await serviceRunner.rerun();

            expect(serviceRunner.runnerState).toBe('running');
        });

        it('rerun causes bootstrap and startup to be run again', async () => {
            const serviceRunner = new ServiceLifecycleRunnable(mockServiceLifecycle);

            await serviceRunner.run();
            await serviceRunner.rerun();

            expect(mockServiceLifecycle.bootstrapCount).toBe(2);
            expect(mockServiceLifecycle.startupCount).toBe(2);
        });

        it('rerun causes shutdown to be called once', async () => {
            const serviceRunner = new ServiceLifecycleRunnable(mockServiceLifecycle);

            await serviceRunner.run();
            await serviceRunner.rerun();

            expect(mockServiceLifecycle.shutdownCount).toBe(1);
        });

        it('rerun does not call configure', async () => {
            const serviceRunner = new ServiceLifecycleRunnable(mockServiceLifecycle);
            await serviceRunner.run();

            mockServiceLifecycle.reset();

            await serviceRunner.rerun();

            expect(mockServiceLifecycle.configureCount).toBe(0);
        });

        it('stop on a running runner causes shutdown to be called', async () => {
            const serviceRunner = new ServiceLifecycleRunnable(mockServiceLifecycle);

            await serviceRunner.run();
            await serviceRunner.stop();

            expect(mockServiceLifecycle.shutdownCount).toBe(1);
        });

        it('stop on a running runner causes state to become stopped', async () => {
            const serviceRunner = new ServiceLifecycleRunnable(mockServiceLifecycle);

            await serviceRunner.run();
            await serviceRunner.stop();

            expect(serviceRunner.runnerState).toBe('stopped');
        });

        it('stop can be called repeatedly', async () => {
            const serviceRunner = new ServiceLifecycleRunnable(mockServiceLifecycle);

            await serviceRunner.run();
            await serviceRunner.stop();
            await serviceRunner.stop();
        });

        it('stopping repeatedly does not call shutdown multiple times', async () => {
            const serviceRunner = new ServiceLifecycleRunnable(mockServiceLifecycle);

            await serviceRunner.run();
            await serviceRunner.stop();
            await serviceRunner.stop();
            await serviceRunner.stop();

            expect(mockServiceLifecycle.shutdownCount).toBe(1);
        });
    });
});
