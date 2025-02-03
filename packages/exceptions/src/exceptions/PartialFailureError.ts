export class PartialFailureError<ResponseType> extends Error {
    public errors: string[];
    public response: ResponseType | undefined;
    /**
     * Will allow a tolerance of errors to be decided.
     */
    public failurePercent: number;

    constructor(message: string, errors: string[], possibleTotalErrors?: number, response?: ResponseType) {
        super(message);
        this.name = 'PartialFailureError';
        this.errors = errors;
        this.failurePercent = possibleTotalErrors ? errors.length / possibleTotalErrors : NaN;
        this.response = response;
    }
}
