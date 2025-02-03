export class EventHandlerError extends Error {
    constructor(m: string) {
        super(m) /* istanbul ignore next */; // coverage bug

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
