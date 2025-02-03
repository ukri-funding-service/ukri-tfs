import moment from 'moment';
import 'moment-timezone';

// Please take care adding new DateTimeFormats.  It's likely we've already captured all the GDS compliant ones.
export enum DateTimeFormat {
    LongDateTimeNoWeekday = 'D MMMM YYYY, h:mma',
    LongDateTimeNoWeekdayAtTime = 'D MMMM YYYY [at] h:mma',
    LongDateTimeNoWeekdayOnDateAtTime = '[on] D MMMM YYYY [at] h:mm a',
    LongDateTimeNoWeekdayShortMonth = 'D MMM YYYY, h:mma',
    LongDateTime = 'dddd D MMMM YYYY, h:mma',
    LongDate = 'dddd D MMMM YYYY',
    DateWithMonthName = 'D MMMM YYYY',
    DateWithShortMonthName = 'D MMM YYYY',
    DateWithShortMonthAndYear = 'D MMM YY',
    DateWithDayOfWeekAndShortMonthName = 'ddd D MMM YYYY',
    DayMonthYear = 'DD/MM/YYYY',
    ShortTime = 'hh:mm',
    TimeWithAmPm = 'h:mma',
    Meridian = 'a',
    LongMonthYear = 'MMMM YYYY',
    ShortMonthYear = 'MMM YYYY',
    MonthYear = 'MM/YYYY',
}

const timezone = 'Europe/London';
const utcTimezone = 'Etc/UTC';
export const localMoment = (date?: string | Date): moment.Moment => {
    return moment(date).tz(timezone);
};

export const formatMoment = (momentValue: moment.Moment, format: DateTimeFormat): string => {
    return momentValue.tz(timezone).format(format);
};

export const utcMoment = (momentValue: moment.Moment, format: DateTimeFormat): string => {
    return momentValue.tz('UTC').format(format);
};

export const formatIsoDateTimeString = (iso8601timestamp: string, format: DateTimeFormat): string => {
    return formatMoment(moment(iso8601timestamp), format);
};

export interface Time {
    time: string;
    ampm: MeridianValue;
}
export enum MeridianValue {
    'am' = 'am',
    'pm' = 'pm',
}
export const toMeridianValue = (ampm: string): MeridianValue => (ampm === 'pm' ? MeridianValue.pm : MeridianValue.am);

export function timeComponentFieldsToTime(time: string, ampm: string): Time {
    return {
        time: time,
        ampm: toMeridianValue(ampm),
    };
}

export function momentToTime(date: moment.Moment): Time {
    return timeComponentFieldsToTime(
        formatMoment(date, DateTimeFormat.ShortTime),
        formatMoment(date, DateTimeFormat.Meridian),
    );
}

const dateFieldSeparator = '/';
const timeFieldSeparator = ':';
const pm = 'pm';

export function dateComponentFieldToMoment(date: string): moment.Moment {
    const dateParts = date.split(dateFieldSeparator).map(datePart => parseInt(datePart));
    return localMoment()
        .year(dateParts[2])
        .month(dateParts[1] - 1)
        .date(dateParts[0])
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);
}

export function dateStringFieldToDate(dateString: string): Date {
    const dateParts: number[] = dateString.split(dateFieldSeparator).map(datePart => parseInt(datePart));
    const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    return date;
}

export function dateTimeComponentFieldsToMoment(date: string, time: string, meridianValue: string): moment.Moment {
    const dateParts = date.split(dateFieldSeparator).map(datePart => parseInt(datePart));
    const timeParts = time.split(timeFieldSeparator).map(timePart => parseInt(timePart));
    if (timeParts[0] === 12) timeParts[0] = 0;
    if (meridianValue === pm) timeParts[0] += 12;
    const momentValue: moment.Moment = localMoment();
    momentValue.year(dateParts[2]);
    momentValue.month(dateParts[1] - 1);
    momentValue.date(dateParts[0]);
    momentValue.hour(timeParts[0]);
    momentValue.minute(timeParts[1]);
    momentValue.second(0);
    momentValue.millisecond(0);
    return momentValue;
}

export function getHumanisedDate(date: Date | string, format?: DateTimeFormat, relativeMode = true): string {
    if (relativeMode) {
        const momentTime = localMoment(date).format(DateTimeFormat.TimeWithAmPm);
        const momentDate = localMoment(date).startOf('day');
        const today = localMoment().startOf('day');
        if (momentDate.diff(today, 'days') === 0) return `today at ${momentTime}`;
        else if (momentDate.diff(today, 'days') === 1) return `tomorrow at ${momentTime}`;
    }

    return formatMoment(moment(date).tz(timezone), format || DateTimeFormat.LongDateTime);
}

/* istanbul ignore next */
export function formatUtcDateString(date: string, format?: DateTimeFormat): string {
    return utcMoment(moment(date).tz('UTC'), format || DateTimeFormat.DateWithMonthName);
}

export function getHumanisedDateFromIsoString(isoString: string, format?: DateTimeFormat, relativeMode = true): string {
    const inputDate = new Date(isoString);
    return getHumanisedDate(inputDate, format, relativeMode);
}

export const getRelativeHumanisedDate = (date: Date, now: Date): string => {
    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }
    const daysDifference = moment(now).endOf('day').diff(moment(date), 'days');
    const formattedDate = (unformattedDate: Date) =>
        formatIsoDateTimeString(unformattedDate.toISOString(), DateTimeFormat.DateWithDayOfWeekAndShortMonthName);

    const dateStringSuffix = (difference: number) => {
        if (daysDifference === 0) {
            return ' (today)';
        } else if (difference >= 0 && difference < 2) {
            return ' (1 day ago)';
        } else if (difference >= 2 && difference < 100) {
            return ` (${difference} days ago)`;
        }
        return '';
    };

    return formattedDate(date) + dateStringSuffix(daysDifference);
};

export const memberDateToString = <T>(object: T | undefined, key: keyof T): string | undefined => {
    const date = object ? object[key] : undefined;
    return date instanceof Date ? date.toISOString() : undefined;
};

export const memberStringToDate = <T>(object: T | undefined, key: keyof T): Date | undefined => {
    const possibleString = object ? object[key] : undefined;
    if (typeof possibleString === 'string') {
        return new Date(possibleString);
    } else if (possibleString instanceof Date) {
        return possibleString;
    } else {
        return undefined;
    }
};

export const daysRemaining = (deadline: Date, startDate?: Date): number => {
    return localMoment(deadline).startOf('day').diff(localMoment(startDate).startOf('day'), 'd');
};

export const monthsRemaining = (deadline: Date, startDate?: Date, precise?: boolean): number => {
    return localMoment(deadline).diff(localMoment(startDate), 'months', precise);
};

/* istanbul ignore next */
export const fullDateFormat = (date: Date): string => {
    return formatIsoDateTimeString(date.toISOString(), DateTimeFormat.LongDateTimeNoWeekday);
};

export const fullDateAndTimeFormat = (date: Date): string => {
    return formatIsoDateTimeString(date.toISOString(), DateTimeFormat.LongDateTimeNoWeekdayOnDateAtTime);
};

/**
 * @deprecated Prefer {@link createDateForLocalInstant}
 */
export const setLocalTime = (date: Date, hour: number, minute: number, second: number, millisecond: number): Date => {
    const momentDate = localMoment(date);
    momentDate.hour(hour);
    momentDate.minute(minute);
    momentDate.second(second);
    momentDate.millisecond(millisecond);
    return momentDate.toDate();
};

/**
 * Creates a native (UTC-based) date that corresponds to the specified instant in the Europe/London timezone
 * @param month Zero-indexed, as with the native Date type
 * @returns a native (UTC-based) date
 */
export const createDateForLocalInstant = (
    year: number,
    month: number,
    date: number,
    hour: number,
    minute: number,
    second = 0,
    millisecond = 0,
): Date => {
    const momentDate = localMoment();
    momentDate.year(year);
    momentDate.month(month);
    momentDate.date(date);
    momentDate.hour(hour);
    momentDate.minute(minute);
    momentDate.second(second);
    momentDate.millisecond(millisecond);
    return momentDate.toDate();
};

export const addDays = (startingDate: Date, days: number): Date => {
    return moment(startingDate, 'DD-MM-YYYY').tz(utcTimezone).add(days, 'days').toDate();
};

export const addMonths = (startingDate: Date, months: number): Date => {
    return moment(startingDate, 'DD-MM-YYYY').tz(utcTimezone).add(months, 'months').toDate();
};

export const addYears = (startingDate: Date, years: number): Date => {
    return moment(startingDate, 'DD-MM-YYYY').tz(utcTimezone).add(years, 'years').toDate();
};

export const getLastDayOfMonth = (date: Date): number => {
    const nextMonth = date.getMonth() + 1;
    const year = date.getFullYear();

    const withMonthBumpedByOne = new Date(year, nextMonth, 0);

    return withMonthBumpedByOne.getDate();
};
