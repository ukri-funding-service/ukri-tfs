export class NullOrEmptyException extends Error {
    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, NullOrEmptyException.prototype);
    }
}

export function throwIfNullOrEmpty(...args: unknown[]): void | never {
    for (const value of args) {
        throwIfUndefinedOrNull(value);
        throwIfEmptyString(value);
        throwIfEmptyArray(value);
    }
}

export function throwIfEmptyArray(value: unknown): void {
    if (valueIsEmptyArray(value)) {
        throw new NullOrEmptyException('value is empty array');
    }
}

export function throwIfEmptyString(value: unknown): void {
    if (valueIsEmptyString(value)) {
        throw new NullOrEmptyException('value is empty string');
    }
}

export function throwIfUndefined(value: unknown): void {
    if (value === undefined) {
        throw new NullOrEmptyException(`value is undefined`);
    }
}

export function throwIfNull(value: unknown): void {
    if (value === null) {
        throw new NullOrEmptyException(`value is null`);
    }
}

export function throwIfUndefinedOrNull(value: unknown): void {
    try {
        throwIfUndefined(value);
        throwIfNull(value);
    } catch (err) {
        const type = value === undefined ? 'undefined' : 'null';
        throw new NullOrEmptyException(`value is ${type}`);
    }
}

export function valueIsEmptyArray(value: unknown): boolean {
    return Array.isArray(value) && value.length === 0;
}

export function valueIsEmptyString(value: unknown): boolean {
    return typeof value === 'string' && value.length === 0;
}

export function valueIsUndefinedOrNull(value: unknown): boolean {
    return valueIsUndefined(value) || valueIsNull(value);
}

export function valueIsUndefined(value: unknown): boolean {
    return value === undefined;
}

export function valueIsNull(value: unknown): boolean {
    return value === null;
}
