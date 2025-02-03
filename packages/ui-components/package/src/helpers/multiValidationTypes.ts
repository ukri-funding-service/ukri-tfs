import { ValidationResult } from '@ukri-tfs/validation';

export interface multiValidationTypesResponse<ErrorMessageType> {
    isValid: boolean;
    showError: boolean;
    errorMessages: ErrorMessageType | string | string[] | null;
    errorSummary: string | null;
}

interface MultiValidationTypesParams<ErrorMessageType> {
    validationResult?: ValidationResult | null;
    showError?: boolean;
    isError?: boolean | null;
    errorMessages?: ErrorMessageType | string | string[] | null;
}

export function multiValidationTypes<ErrorMessageType>( // If using custom error message type use the Generic type
    params: MultiValidationTypesParams<ErrorMessageType>,
): multiValidationTypesResponse<ErrorMessageType> {
    const { showError, validationResult, isError, errorMessages } = params;
    const validationResponse: multiValidationTypesResponse<ErrorMessageType> = {
        isValid: true,
        showError: showError ?? true, // showError defaults to true
        errorMessages: null,
        errorSummary: null,
    };
    if (validationResult) {
        // validation result has lowest priority
        validationResponse.showError = validationResult.showValidationErrors();
        validationResponse.isValid = validationResult.isValid();
        validationResponse.errorMessages = validationResult.errorMessage;
        validationResponse.errorSummary = validationResult.errorSummary;
    }
    if (typeof isError === 'boolean') {
        // explicity isError overrides validation result
        validationResponse.isValid = !isError;
    }
    if (errorMessages) {
        if ((Array.isArray(errorMessages) && errorMessages?.length > 0) || !Array.isArray(errorMessages)) {
            validationResponse.isValid = false;
            validationResponse.errorMessages = errorMessages;
        }
    }

    return validationResponse;
}
