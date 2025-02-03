import { Logger } from '@ukri-tfs/logging';
import { CircuitOpenError } from './circuitOpenError';

export type BreakerState = 'OPEN' | 'CLOSED' | 'HALF-OPEN';

export type ManagedRequest<T> = () => Promise<T>;

export class CircuitBreaker {
    private state: BreakerState;
    private failureCount: number;
    private resetAfter: number;

    constructor(private maxFailures: number, private timeout: number, private logger: Logger) {
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.logger = logger;
        this.resetAfter = Date.now();
    }

    get currentState(): BreakerState {
        return this.state;
    }

    public async executeRequest<T>(request: ManagedRequest<T>): Promise<T> {
        if (this.state === 'OPEN') {
            if (this.resetAfter <= Date.now()) {
                this.logger.info(`Circuit entering HALF-OPEN state`);
                this.state = 'HALF-OPEN';
            } else {
                this.logger.debug(`REQUEST REJECTED`);
                throw new CircuitOpenError();
            }
        }

        try {
            const result = await request();
            return this.onSuccess(result);
        } catch (error) {
            throw this.onFailure(error);
        }
    }

    private onSuccess<T>(data: T): T {
        this.failureCount = 0;

        if (this.state === 'HALF-OPEN') {
            this.logger.info('Circuit entering CLOSED state');
            this.state = 'CLOSED';
        }

        return data;
    }

    private onFailure(cause: unknown): unknown {
        this.failureCount += 1;
        this.logger.debug(`REQUEST FAILED ${this.failureCount}`);

        if (this.state === 'HALF-OPEN' || this.failureCount >= this.maxFailures) {
            this.logger.warn('Circuit entering OPEN state');
            this.state = 'OPEN';
            this.resetAfter = Date.now() + this.timeout;
        }

        return cause;
    }
}
