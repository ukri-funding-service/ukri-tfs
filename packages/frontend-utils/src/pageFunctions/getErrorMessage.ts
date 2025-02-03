import { errorFormat } from '@ukri-tfs/validation';

/**
 * Extracts error messages relevant for a specified field from a list of errors.
 * @param errorList A list of errors with a fieldName, message and summary
 * @param fieldName The name of the field that should show an error messages
 * @returns string[] A list of error messages against the specified field name. Returns an empty array if no errors are in the list.
 */
export const getErrorMessage = (errorList: errorFormat[], fieldName: string): string[] => {
    return errorList.reduce(
        (errorMessages: string[], error) =>
            error.fieldName === fieldName ? [...errorMessages, error.message] : errorMessages,
        [],
    );
};
