/**
 * A common structure returned by endpoints to indicate the reason for a given
 * failure.
 */
export type ErrorResponse = {
    /**
     * The HTTP status code
     */
    statusCode: number;

    /**
     * The symbolic name for the error.
     */
    error: string;

    /**
     * The human-readable description of the reason for the error.
     */
    message: string;
};
