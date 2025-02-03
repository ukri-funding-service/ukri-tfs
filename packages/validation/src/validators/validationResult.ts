import { ValidationResults } from './validationResults';

export class ValidationResult {
    constructor(
        results: ValidationResults<{}> | null,
        private _showValidationErrors: boolean,
        private _isValid: boolean,
        public errorMessage: string,
        public errorSummary: string,
        private _isRequired: boolean,
        public fieldName?: string,
    ) {
        // Cast so that the internal methods can be private on the public interface.
        const internalResults = results;

        if (!errorSummary) errorSummary = errorMessage;

        if (internalResults) {
            internalResults.add(this);
        }
    }

    public isRequired(): boolean {
        return this._isRequired;
    }

    public isValid(): boolean {
        return this._isValid;
    }

    public showValidationErrors(): boolean {
        return this._showValidationErrors;
    }
}
