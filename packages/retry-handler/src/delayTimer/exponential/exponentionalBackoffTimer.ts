import { IDelayTimer, IDelayTimerBuilder } from '../delayTimer';
import { getExponentialBackoffInMilliseconds } from './getExponentialBackoffInMilliseconds';

export const exponentionalBackoffTimerBuilder: IDelayTimerBuilder = (
    durationInSeconds: number,
    timeoutFunction = setTimeout,
): IDelayTimer => {
    const delayTimer: IDelayTimer = async iteration => {
        const durationInMilliseconds = getExponentialBackoffInMilliseconds(iteration, durationInSeconds);

        return new Promise<void>(resolve => timeoutFunction(resolve, durationInMilliseconds));
    };

    return delayTimer;
};
