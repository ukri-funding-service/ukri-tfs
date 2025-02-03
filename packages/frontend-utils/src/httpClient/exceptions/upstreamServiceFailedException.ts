export const upstreamServiceFailedException = (message: string): Error => {
    return new Error(message);
};
