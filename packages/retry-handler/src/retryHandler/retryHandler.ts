import { Logger } from '@ukri-tfs/logging';
import { IDelayTimer } from '../delayTimer/delayTimer';
import { singleValueDelayTimerBuilder } from '../delayTimer/linear/singleValueDelayTimer';

export const alwaysRetry = async (): Promise<boolean> => true;
export const noDelayTimer = singleValueDelayTimerBuilder(0);

export async function retryFunctionHandler<T>(
    fn: () => T,
    logger: Logger,
    times: number,
    delayTimer: IDelayTimer = noDelayTimer,
    retryPredicate: (err: unknown) => Promise<boolean> = alwaysRetry,
): Promise<T> {
    if (times < 1) throw new Error(`Bad argument: 'times' must be greater than 0, but ${times} was received.`);
    let attemptCount = 0;

    const incrementTries = (error: unknown) => {
        logger.debug(
            `Failed to execute with error ${JSON.stringify(
                error,
                Object.getOwnPropertyNames(error),
            )} on attempt ${attemptCount} of ${times}`,
        );
        if (++attemptCount >= times) throw error;
    };

    while (true) {
        try {
            return await fn();
        } catch (error) {
            const errorShouldBeRetried = await retryPredicate(error);
            if (errorShouldBeRetried) {
                incrementTries(error);
            } else {
                throw error;
            }
        }

        await delayTimer(attemptCount + 1);
    }
}
