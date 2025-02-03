import { errorFormat } from '../errors/errorFormat';
import { ValidationResult } from './validationResult';

export class ValidationResults<T> {
    public model: T;
    private errors: ValidationResult[];

    // Not sure why these are class members, or public?
    public static readonly dateFieldPattern = /^\d{1,2}[\/]\d{1,2}[\/]\d{4}$/;
    public static readonly dateFieldSeparator = '/';

    constructor(model: T, private _showValidationErrors: boolean) {
        this.model = model || ({} as T);
        this.errors = [];
    }

    public isValid(): boolean {
        return this.errors.length === 0;
    }

    public showValidationErrors(): boolean {
        return this._showValidationErrors;
    }

    public add(result: ValidationResult): void {
        if (!result.isValid()) {
            this.errors.push(result);
        }
    }

    public errorList(): ValidationResult[] {
        return this.errors.filter((x: { errorMessage: string }): boolean => !!x.errorMessage);
    }

    public mapErrors(): errorFormat[] {
        return this.errorList().map(err => ({
            fieldName: err.fieldName || '',
            message: err.errorMessage,
            summary: err.errorSummary,
        }));
    }

    public matches(value: string, pattern: RegExp): boolean {
        return !!value.match(pattern);
    }

    private isValidDayMonthYear(dateParts: number[]): boolean {
        const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        return !!date && date.getMonth() === dateParts[1] - 1;
    }

    public isValidDate(date: string): boolean {
        return (
            !!date &&
            date.length >= 8 &&
            date.length <= 10 &&
            !!this.matches(date, ValidationResults.dateFieldPattern) &&
            this.isValidDayMonthYear(
                date.split(ValidationResults.dateFieldSeparator).map(datePart => parseInt(datePart)),
            )
        );
    }
}
