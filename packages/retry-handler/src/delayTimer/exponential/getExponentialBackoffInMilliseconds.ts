export const getExponentialBackoffInMilliseconds = (iteration: number, durationInSeconds: number): number => {
    const squared = Math.pow(2, iteration - 1);
    const durationInMilliseconds = durationInSeconds * 1000;
    return squared * durationInMilliseconds;
};
