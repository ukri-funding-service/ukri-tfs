import { IDelayTimer, IDelayTimerBuilder } from '../delayTimer';

export const linearlyIncreasingValueDelayTimerBuilder: IDelayTimerBuilder = (
    durationInSeconds: number,
    timeoutFunction = setTimeout,
): IDelayTimer => {
    const delayTimer: IDelayTimer = async iteration => {
        return new Promise<void>(resolve => timeoutFunction(resolve, durationInSeconds * 1000 * iteration));
    };

    return delayTimer;
};
