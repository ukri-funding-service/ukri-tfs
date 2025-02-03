export function getLowerBoundary(value: number, lowerBoundary: number): number {
    return Math.max(value, lowerBoundary);
}

export function getUpperBoundary(value: number, upperBoundary: number): number {
    return Math.min(value, upperBoundary);
}

export function getUpperAndLowerBoundaries(value: number, lowerBoundary: number, upperBoundary: number): number {
    if (lowerBoundary > upperBoundary) {
        throw new Error('Lower boundary must not be greater than upper boundary');
    }
    return getUpperBoundary(getLowerBoundary(value, lowerBoundary), upperBoundary);
}
