export const compareBooleans = (a: boolean, b: boolean): number => {
    if (a && !b) {
        return -1;
    } else if (b && !a) {
        return 1;
    }
    return 0;
};
