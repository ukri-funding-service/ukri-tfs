import winston, { LoggerOptions, format } from 'winston';
import Transport from 'winston-transport';
import { customColours, customLevels } from '../defaults';

export type LogLevel = keyof typeof customLevels;

/**
 * Adds the standard project options to the provided base set.
 *
 * Current options added are:
 * - format of [ level ] timestamp message
 * - (when isLocal=true) colorised messages
 * - adds a Console logger
 * - sets up an additional logging level of 'audit'
 * - sets default logging level to 'audit'
 *
 * @param baseOptions other options to include inaddition to the above
 * @param isLocal whether this is running on a local development server
 * @returns the combined option set including standard project options
 */
export const addProjectWinstonOptions = (baseOptions?: LoggerOptions, isLocal?: boolean): LoggerOptions => {
    const formats = [format.timestamp(), format.printf(info => `[ ${info.level} ] ${info.timestamp}: ${info.message}`)];

    if (isLocal === true) {
        // Must go before other formatters
        formats.unshift(
            format.colorize({
                level: true,
                colors: customColours,
            }),
        );
    }

    return {
        exitOnError: false,
        level: baseOptions?.level || 'audit',
        levels: customLevels,
        transports: buildTransports(baseOptions),
        format: format.combine.apply(baseOptions, formats),
    };
};

export function buildTransports(baseOptions?: winston.LoggerOptions): Transport[] {
    const transports: Transport[] = [];

    // Initialise the transport array from the provided transports
    if (baseOptions?.transports !== undefined) {
        if (Array.isArray(baseOptions.transports)) {
            baseOptions.transports.forEach(transport => transports.push(transport));
        } else {
            transports.push(baseOptions.transports);
        }
    }

    // Always add a console logger at the end
    transports.push(new winston.transports.Console());

    return transports;
}
