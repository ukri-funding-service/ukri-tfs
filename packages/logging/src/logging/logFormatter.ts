/**
 * An object which can convert a list of logging parameters into a
 * single string.
 *
 * A LogFormatter should be additive, ie information should ideally not be
 * removed from the input parameters on conversion. The intent is to
 * apply things like a structured format, or conversion of symbolic
 * values into a human-readable ones.
 */
export interface LogFormatter {
    format(...args: unknown[]): string;
}
