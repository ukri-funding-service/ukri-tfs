import { ConsoleLogger, NoopLogger } from '@ukri-tfs/logging';
import { CircuitBreaker, ManagedRequest } from '../src/circuitBreaker';
import { CircuitOpenError } from '../src/circuitOpenError';

describe('packages/circuit-breaker - circuitBreaker', () => {
    const failingRequest: ManagedRequest<void> = () => Promise.reject(new Error('request failed'));
    const succeedingRequest: ManagedRequest<void> = () => Promise.resolve();

    afterAll(() => {
        jest.useRealTimers(); // Safety net since this suite uses fake timers
    });

    it('enters open state on failure', async () => {
        const maxFailures = 1;
        const circuitBreaker = new CircuitBreaker(maxFailures, 20000, new ConsoleLogger(console));

        expect(circuitBreaker.currentState).toBe('CLOSED');

        for (let i = 0; i < maxFailures; i++) {
            await expect(circuitBreaker.executeRequest(failingRequest)).rejects.toThrow(Error('request failed'));
        }

        expect(circuitBreaker.currentState).toBe('OPEN');
    });

    it('enters open state on failure (non-Error rejection)', async () => {
        const maxFailures = 1;
        const circuitBreaker = new CircuitBreaker(maxFailures, 20000, new ConsoleLogger(console));

        expect(circuitBreaker.currentState).toBe('CLOSED');

        for (let i = 0; i < maxFailures; i++) {
            await expect(
                circuitBreaker.executeRequest(() => Promise.reject({ response: 'request failed' })),
            ).rejects.toEqual({ response: 'request failed' }); // using toEqual to workaround https://github.com/jestjs/jest/issues/12024
        }

        expect(circuitBreaker.currentState).toBe('OPEN');
    });

    it('rejects on the next request once the retry limit is reached', async () => {
        const retryLimit = 1;
        const circuitBreaker = new CircuitBreaker(retryLimit, 20000, new NoopLogger());

        for (let i = 0; i < retryLimit; i++) {
            await expect(circuitBreaker.executeRequest(failingRequest)).rejects.toThrow(Error('request failed'));
        }

        // once we have exceeded the retry limit, expect next call to reject with a CircuitOpenError
        await expect(circuitBreaker.executeRequest(failingRequest)).rejects.toThrow(CircuitOpenError);
    });

    it('resets failure history once a successful request is made', async () => {
        // Circuit breaker requires 2 consecutive failures to Open
        const circuitBreaker = new CircuitBreaker(2, 20000, new NoopLogger());

        // Start with a failing request ...
        await expect(circuitBreaker.executeRequest(failingRequest)).rejects.toThrow(Error('request failed'));

        // ... next few requests succeed
        await circuitBreaker.executeRequest(succeedingRequest);
        await circuitBreaker.executeRequest(succeedingRequest);

        // ... next failing request should not trip the breaker as 2 consecutive failures required
        await expect(circuitBreaker.executeRequest(failingRequest)).rejects.toThrow(Error('request failed'));

        expect(circuitBreaker.currentState).toBe('CLOSED');
    });

    it('makes no more requests once the breaker is closed', async () => {
        const retryLimit = 4;
        const circuitBreaker = new CircuitBreaker(retryLimit, 20000, new NoopLogger());

        let requestCount = 0;
        const countingRequest: ManagedRequest<void> = () => {
            return new Promise<void>((_, reject) => {
                requestCount++;
                reject(new Error('failing request'));
            });
        };

        for (let i = 0; i < retryLimit * 1.5; i++) {
            await expect(circuitBreaker.executeRequest(countingRequest)).rejects.toThrow(expect.any(Error));
        }

        expect(requestCount).toBe(retryLimit);
    });

    it('an open circuit permits another retry after the backoff time expires (retry fails)', async () => {
        const retryLimit = 1;
        const backoff = 5000;

        jest.useFakeTimers();

        const circuitBreaker = new CircuitBreaker(retryLimit, backoff, new NoopLogger());

        let requestCount = 0;
        const countingRequest: ManagedRequest<void> = () => {
            return new Promise<void>((_, reject) => {
                requestCount++;
                reject(new Error('failing request'));
            });
        };

        for (let i = 0; i < retryLimit; i++) {
            await expect(circuitBreaker.executeRequest(countingRequest)).rejects.toThrow(expect.any(Error));
        }

        expect(circuitBreaker.currentState).toBe('OPEN');
        expect(requestCount).toBe(retryLimit);

        // Advance time past the backoff limit and retry
        jest.advanceTimersByTime(backoff + 100 /*ms*/);
        await expect(circuitBreaker.executeRequest(countingRequest)).rejects.toThrow(expect.any(Error));
        jest.useRealTimers();

        expect(requestCount).toBe(retryLimit + 1);
    });

    it('an closed circuit permits another retry after the backoff time expires (retry succeeds)', async () => {
        const retryLimit = 1;
        const backoff = 5000;

        jest.useFakeTimers();

        const circuitBreaker = new CircuitBreaker(retryLimit, backoff, new NoopLogger());

        let requestCount = 0;
        const countingRequestWithFailure: ManagedRequest<void> = () => {
            return new Promise<void>((_, reject) => {
                requestCount++;
                reject(new Error('failing request'));
            });
        };
        const countingRequestWithSuccess: ManagedRequest<void> = () => {
            return new Promise<void>((resolve, _) => {
                requestCount++;
                resolve();
            });
        };

        for (let i = 0; i < retryLimit; i++) {
            await expect(circuitBreaker.executeRequest(countingRequestWithFailure)).rejects.toThrow(expect.any(Error));
        }

        expect(circuitBreaker.currentState).toBe('OPEN');
        expect(requestCount).toBe(retryLimit);

        // Advance time past the backoff limit and retry
        jest.advanceTimersByTime(backoff + 100 /*ms*/);
        circuitBreaker.executeRequest(countingRequestWithSuccess);
        jest.useRealTimers();

        expect(requestCount).toBe(retryLimit + 1);
    });
});
