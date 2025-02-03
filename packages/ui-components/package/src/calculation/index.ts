export const calculatePercentage = (percentage: number, value: number | null): number => {
    if (!value) {
        return 0;
    }

    return (percentage / 100) * value;
};
