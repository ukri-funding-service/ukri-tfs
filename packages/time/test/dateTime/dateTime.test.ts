import { describe, expect, it, jest } from '@jest/globals';
import moment from 'moment';
import {
    addDays,
    addMonths,
    addYears,
    dateComponentFieldToMoment,
    dateTimeComponentFieldsToMoment,
    DateTimeFormat,
    daysRemaining,
    formatIsoDateTimeString,
    formatMoment,
    getHumanisedDate,
    getHumanisedDateFromIsoString,
    getRelativeHumanisedDate,
    memberDateToString,
    memberStringToDate,
    MeridianValue,
    momentToTime,
    monthsRemaining,
    setLocalTime,
    createDateForLocalInstant,
    timeComponentFieldsToTime,
    utcMoment,
    dateStringFieldToDate,
    fullDateAndTimeFormat,
    getLastDayOfMonth,
    localMoment,
} from '../../src/dateTime';

const timezone = 'Europe/London';

describe('dateTime - setLocalTime', () => {
    it('should setLocalTime in winter', () => {
        const time = setLocalTime(new Date(Date.UTC(2022, 0, 1)), 5, 0, 0, 0);

        expect(time.toISOString()).toEqual('2022-01-01T05:00:00.000Z');
    });
    it('should setLocalTime in summer', () => {
        const time = setLocalTime(new Date(Date.UTC(2022, 6, 1)), 5, 0, 0, 0);

        expect(time.toISOString()).toEqual('2022-07-01T04:00:00.000Z');
    });
});

describe('dateTime - utcMoment', () => {
    it('all formats of date', () => {
        const keepLocalTime = true;
        const rootMoment = moment(new Date(1995, 2, 3, 6)).tz('Europe/London', keepLocalTime);

        expect(utcMoment(rootMoment, DateTimeFormat.LongDateTimeNoWeekday)).toEqual('3 March 1995, 6:00am');
        expect(utcMoment(rootMoment, DateTimeFormat.LongDateTimeNoWeekdayAtTime)).toEqual('3 March 1995 at 6:00am');
        expect(utcMoment(rootMoment, DateTimeFormat.LongDateTimeNoWeekdayOnDateAtTime)).toEqual(
            'on 3 March 1995 at 6:00 am',
        );
        expect(utcMoment(rootMoment, DateTimeFormat.LongDateTimeNoWeekdayShortMonth)).toEqual('3 Mar 1995, 6:00am');
        expect(utcMoment(rootMoment, DateTimeFormat.LongDateTime)).toEqual('Friday 3 March 1995, 6:00am');
        expect(utcMoment(rootMoment, DateTimeFormat.LongDate)).toEqual('Friday 3 March 1995');
        expect(utcMoment(rootMoment, DateTimeFormat.DateWithMonthName)).toEqual('3 March 1995');
        expect(utcMoment(rootMoment, DateTimeFormat.DateWithShortMonthName)).toEqual('3 Mar 1995');
        expect(utcMoment(rootMoment, DateTimeFormat.DateWithShortMonthAndYear)).toEqual('3 Mar 95');
        expect(utcMoment(rootMoment, DateTimeFormat.DateWithDayOfWeekAndShortMonthName)).toEqual('Fri 3 Mar 1995');
        expect(utcMoment(rootMoment, DateTimeFormat.DayMonthYear)).toEqual('03/03/1995');
        expect(utcMoment(rootMoment, DateTimeFormat.ShortTime)).toEqual('06:00');
        expect(utcMoment(rootMoment, DateTimeFormat.TimeWithAmPm)).toEqual('6:00am');
        expect(utcMoment(rootMoment, DateTimeFormat.Meridian)).toEqual('am');
        expect(utcMoment(rootMoment, DateTimeFormat.LongMonthYear)).toEqual('March 1995');
        expect(utcMoment(rootMoment, DateTimeFormat.ShortMonthYear)).toEqual('Mar 1995');
        expect(utcMoment(rootMoment, DateTimeFormat.MonthYear)).toEqual('03/1995');
    });
});

describe('dateTime - dateStringFieldToDate', () => {
    it('convert date string field to date', () => {
        const dateString = '26/02/1995';

        expect(dateStringFieldToDate(dateString)).toEqual(new Date(1995, 1, 26));
    });
});
describe('dateTime - createDateForLocalInstant', () => {
    it('should create a native (UTC-based) date that corresponds to the specified instant in the Europe/London timezone', () => {
        const time = createDateForLocalInstant(2022, 0, 1, 5, 55, 56, 570);

        expect(time.toISOString()).toEqual('2022-01-01T05:55:56.570Z');
    });

    it('should account for daylight-savings', () => {
        const time = createDateForLocalInstant(2022, 6, 1, 5, 0, 0, 0);

        expect(time.toISOString()).toEqual('2022-07-01T04:00:00.000Z');
    });

    it('should set seconds to zero by default', () => {
        const time = createDateForLocalInstant(2022, 6, 1, 5, 0);

        expect(time.toISOString()).toEqual('2022-07-01T04:00:00.000Z');
    });
});
describe('dateComponentFieldToMoment', () => {
    it('should return a value when the argument is a valid DD/MM/YYYY date string', () => {
        const date: moment.Moment = dateComponentFieldToMoment('31/03/2019');
        expect(date).toBeDefined();
    });

    it('should set the day of the month correctly when the argument is a valid DD/MM/YYYY date string', () => {
        const date: moment.Moment = dateComponentFieldToMoment('31/03/2019');
        expect(date.date()).toEqual(31);
    });

    it('should set the month number correctly when the argument is a valid DD/MM/YYYY date string', () => {
        const date: moment.Moment = dateComponentFieldToMoment('31/03/2019');
        expect(date.month()).toEqual(2); // Months start at zero
    });

    it('should set the year correctly when the argument is a valid DD/MM/YYYY date string', () => {
        const date: moment.Moment = dateComponentFieldToMoment('31/03/2019');
        expect(date.year()).toEqual(2019);
    });

    it('should set the hours to zero when the argument is a valid DD/MM/YYYY date string', () => {
        const date: moment.Moment = dateComponentFieldToMoment('31/03/2019');
        expect(date.hours()).toEqual(0);
    });

    it('should set the minutes to zero when the argument is a valid DD/MM/YYYY date string', () => {
        const date: moment.Moment = dateComponentFieldToMoment('31/03/2019');
        expect(date.minutes()).toEqual(0);
    });

    it('should set the seconds to zero when the argument is a valid DD/MM/YYYY date string', () => {
        const date: moment.Moment = dateComponentFieldToMoment('31/03/2019');
        expect(date.seconds()).toEqual(0);
    });

    it('should set the milliseconds to zero when the argument is a valid DD/MM/YYYY date string', () => {
        const date: moment.Moment = dateComponentFieldToMoment('31/03/2019');
        expect(date.milliseconds()).toEqual(0);
    });
});

describe('dateTimeComponentFieldsToMoment tests', () => {
    it('should return a value when the arguments are valid', () => {
        const date: moment.Moment = dateTimeComponentFieldsToMoment('31/03/2019', '06:43', 'pm');
        expect(date).toBeDefined();
    });

    it('should set the day of the month correctly when the arguments are valid', () => {
        const date: moment.Moment = dateTimeComponentFieldsToMoment('31/03/2019', '06:43', 'pm');
        expect(date.date()).toEqual(31);
    });

    it('should set the month number correctly when the arguments are valid', () => {
        const date: moment.Moment = dateTimeComponentFieldsToMoment('31/03/2019', '06:43', 'pm');
        expect(date.month()).toEqual(2); // Months start at zero
    });

    it('should set the year correctly when the arguments are valid', () => {
        const date: moment.Moment = dateTimeComponentFieldsToMoment('31/03/2019', '06:43', 'pm');
        expect(date.year()).toEqual(2019);
    });

    it('should set the hours correctly when the arguments are valid', () => {
        const date: moment.Moment = dateTimeComponentFieldsToMoment('31/03/2019', '06:43', 'pm');
        expect(date.hours()).toEqual(18);
    });

    it('should set the hours correctly when the time is set to 12:00 am', () => {
        const date: moment.Moment = dateTimeComponentFieldsToMoment('31/03/2019', '12:00', 'am');
        expect(date.hours()).toEqual(0);
    });

    it('should set the hours correctly when the hour is set to 12:00 pm', () => {
        const date: moment.Moment = dateTimeComponentFieldsToMoment('31/03/2019', '12:00', 'pm');
        expect(date.hours()).toEqual(12);
    });

    it('should set the minutes correctly when the arguments are valid', () => {
        const date: moment.Moment = dateTimeComponentFieldsToMoment('31/03/2019', '06:43', 'pm');
        expect(date.minutes()).toEqual(43);
    });

    it('should set the seconds to zero when the arguments are valid', () => {
        const date: moment.Moment = dateTimeComponentFieldsToMoment('31/03/2019', '06:43', 'pm');
        expect(date.seconds()).toEqual(0);
    });

    it('should set the milliseconds to zero when the arguments are valid', () => {
        const date: moment.Moment = dateTimeComponentFieldsToMoment('31/03/2019', '06:43', 'pm');
        expect(date.milliseconds()).toEqual(0);
    });
});

describe('formatIsoDateTimeString tests', () => {
    it('should return a formatted date/time string in the correct local time when the argument is a valid ISO 8601 string in January', () => {
        const date: string = formatIsoDateTimeString('2020-01-31T18:43:00.000+00:00', DateTimeFormat.LongDateTime);
        expect(date).toEqual('Friday 31 January 2020, 6:43pm');
    });

    it('should return a formatted date/time string in the correct local timewhen the argument is a valid ISO 8601 string in April', () => {
        const date: string = formatIsoDateTimeString('2020-04-30T18:43:00.000+01:00', DateTimeFormat.LongDateTime);
        expect(date).toEqual('Thursday 30 April 2020, 6:43pm');
    });

    it('should return a formatted date/time string for LongMonthYear', () => {
        const date: string = formatIsoDateTimeString('2020-04-30T18:43:00.000+01:00', DateTimeFormat.LongMonthYear);
        expect(date).toEqual('April 2020');
    });

    it('should return a formatted date/time string for ShortMonthYear', () => {
        const date: string = formatIsoDateTimeString('2020-04-30T18:43:00.000+01:00', DateTimeFormat.ShortMonthYear);
        expect(date).toEqual('Apr 2020');
    });

    it('should return a formatted date/time string for ShortMonthYear', () => {
        const date: string = formatIsoDateTimeString(
            '2020-04-30T18:43:00.000+01:00',
            DateTimeFormat.LongDateTimeNoWeekdayAtTime,
        );
        expect(date).toEqual('30 April 2020 at 6:43pm');
    });
});

describe('formatMoment tests', () => {
    it('should return a formatted date/time string when the argument is a valid Moment object', () => {
        const momentValue: moment.Moment = moment('2019-03-31T18:43:00.000+01:00');
        const date: string = formatMoment(momentValue, DateTimeFormat.LongDateTime);
        expect(date).toEqual('Sunday 31 March 2019, 6:43pm');
    });
});

describe('momentToTime tests', () => {
    it('should return a formatted time value when the argument is a valid Moment object in January', () => {
        const momentValue: moment.Moment = moment('2020-01-31T18:43:00.000+00:00');
        const time = momentToTime(momentValue);
        expect(time).toHaveProperty('time', '06:43');
    });

    it('should return a formatted meridian value when the argument is a valid Moment object in January', () => {
        const momentValue: moment.Moment = moment('2020-01-31T18:43:00.000+00:00');
        const time = momentToTime(momentValue);
        expect(time).toHaveProperty('ampm', MeridianValue.pm);
    });

    it('should return a formatted time value when the argument is a valid Moment object in April', () => {
        const momentValue: moment.Moment = moment('2020-04-30T18:43:00.000+01:00');
        const time = momentToTime(momentValue);
        expect(time).toHaveProperty('time', '06:43');
    });

    it('should return a formatted meridian value when the argument is a valid Moment object in April', () => {
        const momentValue: moment.Moment = moment('2020-04-30T18:43:00.000+01:00');
        const time = momentToTime(momentValue);
        expect(time).toHaveProperty('ampm', MeridianValue.pm);
    });
});

describe('timeComponentFieldsToTime tests', () => {
    it('should populate the time property with the value of the first argument', () => {
        const time = timeComponentFieldsToTime('06:43', 'pm');
        expect(time).toHaveProperty('time', '06:43');
    });

    it.each([
        { input: 'pm', expected: MeridianValue.pm },
        { input: 'am', expected: MeridianValue.am },
    ])('should populate the ampm property with $input', ({ input, expected }) => {
        const time = timeComponentFieldsToTime('06:43', input);
        expect(time).toHaveProperty('ampm', expected);
    });
});

describe('getHumanisedDate tests', () => {
    it('should contain "today" if the date is today', () => {
        const humanisedDate = getHumanisedDate(moment().tz(timezone).startOf('day').toDate());
        expect(humanisedDate).toContain('today');
    });
    it('should not contain "today" if the date is today when relative mode is disabled', () => {
        const humanisedDate = getHumanisedDate(
            moment().tz(timezone).startOf('day').toDate(),
            DateTimeFormat.TimeWithAmPm,
            false,
        );
        expect(humanisedDate).not.toContain('today');
    });

    it('should display the correct time if date is today', () => {
        // Set the timezone to ensure moment understands that hour(15) means 15:00 local time.
        const date = moment().tz(timezone);
        date.hour(15);
        date.minute(0);
        const humanisedDate = getHumanisedDate(date.toDate());
        expect(humanisedDate).toContain('3:00pm');
    });

    it('should display the correct time if date is UTC and UK in BST', () => {
        // Date is in daylight saving time period so local time is BST.
        const date = new Date('2020-04-24T14:00:00.000Z');
        const humanisedDate = getHumanisedDate(date);
        expect(humanisedDate).toContain('3:00pm');
    });

    it('should display the correct time if date is UTC and UK in GMT', () => {
        // Date is outside daylight saving time period so local time is GMT.
        const date = new Date('2020-11-24T14:00:00.000Z');
        const humanisedDate = getHumanisedDate(date);
        expect(humanisedDate).toContain('2:00pm');
    });

    it('should contain "tomorrow" if the date is tomorrow', () => {
        const date = moment().tz(timezone).toDate();
        date.setDate(date.getDate() + 1);
        const humanisedDate = getHumanisedDate(date);
        expect(humanisedDate).toContain('tomorrow');
    });

    it('should display the correct time if date is tomorrow', () => {
        const date = moment().tz(timezone);
        date.hour(8);
        date.minute(0);
        const humanisedDate = getHumanisedDate(date.toDate());
        expect(humanisedDate).toContain('8:00am');
    });

    it('should render the standard long date format if date is yesterday and no format specified', () => {
        const date = moment().tz(timezone).toDate();
        date.setDate(date.getDate() - 1);
        const humanisedDate = getHumanisedDate(date);
        const formattedDate = formatMoment(moment(date), DateTimeFormat.LongDateTime);
        expect(humanisedDate).toEqual(formattedDate);
    });

    it('should render the standard long date format if date is neither today nor tomorrow and no format specified', () => {
        const date = moment().tz(timezone).toDate();
        date.setDate(date.getDate() + 2);
        const humanisedDate = getHumanisedDate(date);
        const formattedDate = formatMoment(moment(date), DateTimeFormat.LongDateTime);
        expect(humanisedDate).toEqual(formattedDate);
    });

    it('should use the correct date format if one is specified', () => {
        const date = moment().tz(timezone).toDate();
        date.setDate(date.getDate() + 2);
        const humanisedDate = getHumanisedDate(date, DateTimeFormat.DayMonthYear);
        const formattedDate = formatMoment(moment(date), DateTimeFormat.DayMonthYear);
        expect(humanisedDate).toEqual(formattedDate);
    });
});

describe('fullDateAndTimeFormat', () => {
    it('should return the correct date with on date at time am/pm/', () => {
        const keepLocalTime = true;
        const date = moment(new Date(2023, 3, 24, 14)).tz('Europe/London', keepLocalTime).toDate();
        const readableFullDateAndTimeFormat = fullDateAndTimeFormat(date);
        expect(readableFullDateAndTimeFormat).toEqual('on 24 April 2023 at 2:00 pm');
    });
});

describe('getHumanisedDateFromIsoString tests', () => {
    it('should contain "today" if the date is today', () => {
        const humanisedDate = getHumanisedDateFromIsoString(
            moment().tz(timezone).startOf('day').toDate().toISOString(),
        );
        expect(humanisedDate).toContain('today');
    });

    it('should display the correct time if date is today', () => {
        // Set the timezone to ensure moment understands that hour(15) means 15:00 local time.
        const date = moment().tz(timezone);
        date.hour(15);
        date.minute(0);
        const humanisedDate = getHumanisedDateFromIsoString(date.toDate().toISOString());
        expect(humanisedDate).toContain('3:00pm');
    });

    it('should display the correct time if date is UTC and UK in BST', () => {
        // Date is in daylight saving time period so local time is BST.
        const humanisedDate = getHumanisedDateFromIsoString('2020-04-24T14:00:00.000Z');
        expect(humanisedDate).toContain('3:00pm');
    });

    it('should display the correct time if date is UTC and UK in GMT', () => {
        // Date is outside daylight saving time period so local time is GMT.
        const humanisedDate = getHumanisedDateFromIsoString('2020-11-24T14:00:00.000Z');
        expect(humanisedDate).toContain('2:00pm');
    });

    it('should contain "tomorrow" if the date is tomorrow', () => {
        const date = moment().tz(timezone).toDate();
        date.setDate(date.getDate() + 1);
        const humanisedDate = getHumanisedDate(date);
        expect(humanisedDate).toContain('tomorrow');
    });

    it('should display the correct time if date is tomorrow', () => {
        const date = moment().tz(timezone);
        date.hour(8);
        date.minute(0);
        const humanisedDate = getHumanisedDate(date.toDate());
        expect(humanisedDate).toContain('8:00am');
    });

    it('should render the standard long date format if date is yesterday and no format specified', () => {
        const date = moment().tz(timezone).add(-1, 'day').toDate();
        const humanisedDate = getHumanisedDateFromIsoString(date.toISOString());
        const formattedDate = formatMoment(moment(date), DateTimeFormat.LongDateTime);
        expect(humanisedDate).toEqual(formattedDate);
    });

    it('should render the standard long date format if date is neither today nor tomorrow and no format specified', () => {
        const date = moment().tz(timezone).toDate();
        date.setDate(date.getDate() + 2);
        const humanisedDate = getHumanisedDate(date);
        const formattedDate = formatMoment(moment(date), DateTimeFormat.LongDateTime);
        expect(humanisedDate).toEqual(formattedDate);
    });

    it('should use the correct date format if one is specified', () => {
        const date = moment().tz(timezone).toDate();
        date.setDate(date.getDate() + 2);
        const humanisedDate = getHumanisedDateFromIsoString(date.toISOString(), DateTimeFormat.DayMonthYear);
        const formattedDate = formatMoment(moment(date), DateTimeFormat.DayMonthYear);
        expect(humanisedDate).toEqual(formattedDate);
    });
});

describe(`memberDateToString`, () => {
    it(`returns a string where there is a date`, () => {
        const result = memberDateToString({ greeting: 'hello', date: new Date('2022-01-26T09:22:24.129Z') }, 'date');
        expect(result).toEqual('2022-01-26T09:22:24.129Z');
    });

    it(`returns a undefined where there isn't a date`, () => {
        const result = memberDateToString({ greeting: 'hello', date: null }, 'date');
        expect(result).toEqual(undefined);
    });

    it(`returns a undefined where there isn't an obect`, () => {
        const result = memberDateToString(undefined as unknown as { date: string }, 'date');
        expect(result).toEqual(undefined);
    });
});

describe(`memberStringToDate`, () => {
    it(`returns a date where there is a date string`, () => {
        const result = memberStringToDate({ greeting: 'hello', date: '2022-01-26T09:22:24.129Z' }, 'date');
        expect(result).toEqual(new Date('2022-01-26T09:22:24.129Z'));
    });

    it(`returns invalid date where there is a string that isn't valid as a date`, () => {
        const result = memberStringToDate({ greeting: 'hello', date: '2022-01-26T09:22:24.129Z' }, 'greeting');
        expect(result && result.toString()).toEqual('Invalid Date');
    });

    it(`returns a date where there already was one`, () => {
        const result = memberStringToDate({ greeting: 'hello', date: new Date('2022-01-26T09:22:24.129Z') }, 'date');
        expect(result).toEqual(new Date('2022-01-26T09:22:24.129Z'));
    });

    it(`returns a undefined where there isn't a string`, () => {
        const result = memberStringToDate({ greeting: 'hello', date: null }, 'date');
        expect(result).toEqual(undefined);
    });

    it(`returns a undefined where there isn't an obect`, () => {
        const result = memberStringToDate(undefined as unknown as { date: Date }, 'date');
        expect(result).toEqual(undefined);
    });
});

describe('daysRemaining', () => {
    it(`knows there's one day remaining between now and tomorrow`, () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        const remaining = daysRemaining(date);
        expect(remaining).toEqual(1);
    });

    it(`knows there's one day remaining between two and dates with later date before`, () => {
        const remaining = daysRemaining(new Date('2020-03-02'), new Date('2020-03-01'));
        expect(remaining).toEqual(1);
    });

    it(`knows there's one day remaining between two and dates with later date after`, () => {
        const remaining = daysRemaining(new Date('2020-03-02'), new Date('2020-03-03'));
        expect(remaining).toEqual(-1);
    });
});

describe('monthsRemaining', () => {
    it(`knows there's one month remaining between now and next month`, () => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-05-01T00:00:00Z'));
        const date = localMoment().add(1, 'month').toDate();
        const remaining = monthsRemaining(date);
        jest.useRealTimers();
        expect(remaining).toEqual(1);
    });

    it(`knows there's one month remaining between two dates`, () => {
        const fromDate = new Date('01 Jan 2022 00:00:01Z');
        const toDate = new Date('01 Feb 2022 00:00:01Z');
        const remaining = monthsRemaining(toDate, fromDate);
        expect(remaining).toEqual(1);
    });

    it(`knows there's one month remaining between two dates being 1.5 months`, () => {
        const fromDate = new Date('1 Jan 2022 00:00:01Z');
        const toDate = new Date('20 Feb 2022 00:00:01Z');
        const remaining = monthsRemaining(toDate, fromDate);
        expect(remaining).toEqual(1);
    });

    it(`exactly 1 month different timezone`, () => {
        const fromDate = new Date('1 Jan 2022 00:00:01Z');
        const toDate = new Date('2 Feb 2022 00:00:01');
        const remaining = monthsRemaining(toDate, fromDate);
        expect(remaining).toEqual(1);
    });

    it(`return the precise number of months remaining when precise flag is specified`, () => {
        const fromDate = new Date('1 March 2022 00:00:01Z');
        const toDate = new Date('15 March 2022 00:00:01Z');
        const preciseRemaining = monthsRemaining(toDate, fromDate, true);
        expect(preciseRemaining).toEqual(0.5);
    });
});

describe('Human readable invitation sent status', () => {
    const today = new Date('2021-08-26T14:00:00.000Z');
    const inputsAndResults = [
        {
            date: new Date('2021-08-26T14:00:00.000Z'),
            result: 'Thu 26 Aug 2021 (today)',
        },
        {
            date: new Date('2021-08-26T13:00:00.000Z'),
            result: 'Thu 26 Aug 2021 (today)',
            comment: '1 hour ago',
        },
        {
            date: new Date('2021-08-25T14:00:00.000Z'),
            result: 'Wed 25 Aug 2021 (1 day ago)',
        },
        {
            date: new Date('2021-08-24T14:00:00.000Z'),
            result: 'Tue 24 Aug 2021 (2 days ago)',
        },
        {
            date: new Date('2021-08-24T15:00:00.000Z'),
            result: 'Tue 24 Aug 2021 (2 days ago)',
            comment: '2 days but < 48hrs',
        },
        {
            date: new Date('2021-05-19T14:00:00.000Z'),
            result: 'Wed 19 May 2021 (99 days ago)',
        },
        {
            date: new Date('2021-05-19T13:00:00.000Z'),
            result: 'Wed 19 May 2021 (99 days ago)',
            comment: 'an hour past 99 days',
        },
        {
            date: new Date('2021-05-18T14:00:00.000Z'),
            result: 'Tue 18 May 2021',
            comment: 'over 99 days',
        },
        {
            date: new Date('2022-05-18T14:00:00.000Z'),
            result: 'Wed 18 May 2022',
            comment: 'incorrect date in future',
        },
        {
            date: new Date('Invalid date'),
            result: 'Invalid date',
            comment: 'invalid dates should not throw',
        },
    ];

    inputsAndResults.forEach(({ date, result, comment }) => {
        it(`should return '${result}' given '${date}' and '${today}' ${comment ? comment : ''}`, () => {
            expect(getRelativeHumanisedDate(date, today)).toEqual(result);
        });
    });
});

describe('addDays', () => {
    it('should add the correct number of days', async () => {
        const dateStart = new Date('2021-08-26T14:00:00.000Z');
        const result = addDays(dateStart, 1);
        expect(result).toEqual(new Date('2021-08-27T14:00:00.000Z'));
    });

    it('should add the correct number of days if passing a month', async () => {
        const dateStart = new Date('2021-08-26T14:00:00.000Z');
        const result = addDays(dateStart, 10);
        expect(result).toEqual(new Date('2021-09-05T14:00:00.000Z'));
    });

    it('should add the correct number of days if passing a year', async () => {
        const dateStart = new Date('2021-08-26T14:00:00.000Z');
        const result = addDays(dateStart, 365);
        expect(result).toEqual(new Date('2022-08-26T14:00:00.000Z'));
    });

    it('should add the correct number of days when double negated', async () => {
        const dateStart = new Date('2021-08-26T14:00:00.000Z');
        const days = -2;
        const result = addDays(dateStart, -days);
        expect(result).toEqual(new Date('2021-08-28T14:00:00.000Z'));
    });

    it('should subtract the correct number of days', async () => {
        const dateStart = new Date('2021-08-26T14:00:00.000Z');
        const result = addDays(dateStart, -1);
        expect(result).toEqual(new Date('2021-08-25T14:00:00.000Z'));
    });
});

describe('addMonths', () => {
    it('should add the correct number of months', async () => {
        const dateStart = new Date('2021-08-26T14:00:00.000Z');
        const result = addMonths(dateStart, 1);
        expect(result).toEqual(new Date('2021-09-26T14:00:00.000Z'));
    });

    it('should add the correct number of months if passing a year', async () => {
        const dateStart = new Date('2021-08-26T14:00:00.000Z');
        const result = addMonths(dateStart, 10);
        expect(result).toEqual(new Date('2022-06-26T14:00:00.000Z'));
    });

    it('should add the correct number of months for jan 31 to feb 28', async () => {
        const dateStart = new Date('2021-01-31T00:00:00.000Z');
        const result = addMonths(dateStart, 1);
        expect(result).toEqual(new Date('2021-02-28T00:00:00.000Z'));
    });

    it('should add 12 months', async () => {
        const dateStart = new Date('2021-01-31T00:00:00.000Z');
        const result = addMonths(dateStart, 12);
        expect(result).toEqual(new Date('2022-01-31T00:00:00.000Z'));
    });

    it('should add 13 months', async () => {
        const dateStart = new Date('2021-07-31T00:00:00.000Z');
        const result = addMonths(dateStart, 13);
        expect(result).toEqual(new Date('2022-08-31T00:00:00.000Z'));
    });

    it('should add months past leap years', async () => {
        const dateStart = new Date('2019-01-31T00:00:00.000Z');
        const result = addMonths(dateStart, 12 * 8); // 8 years
        expect(result).toEqual(new Date('2027-01-31T00:00:00.000Z'));
    });

    it('should add negative months', async () => {
        const dateStart = new Date('2019-01-31T00:00:00.000Z');
        const result = addMonths(dateStart, -5);
        expect(result).toEqual(new Date('2018-08-31T00:00:00.000Z'));
    });

    it('should add 0 months', async () => {
        const dateStart = new Date('2019-01-31T00:00:00.000Z');
        const result = addMonths(dateStart, 0);
        expect(result).toEqual(new Date('2019-01-31T00:00:00.000Z'));
    });
});

describe('addYears', () => {
    [
        {
            years: 1,
            startDate: new Date('2019-01-31T00:00:00.000Z'),
            endDate: new Date('2020-01-31T00:00:00.000Z'),
        },
        {
            years: 2,
            startDate: new Date('2019-01-31T00:00:00.000Z'),
            endDate: new Date('2021-01-31T00:00:00.000Z'),
        },
        {
            years: -3,
            startDate: new Date('2019-01-31T00:00:00.000Z'),
            endDate: new Date('2016-01-31T00:00:00.000Z'),
        },
        {
            years: 0,
            startDate: new Date('2019-01-31T00:00:00.000Z'),
            endDate: new Date('2019-01-31T00:00:00.000Z'),
        },
    ].forEach(testConfig => {
        it(`should add ${testConfig.years} years`, () => {
            const result = addYears(testConfig.startDate, testConfig.years);

            expect(result).toEqual(testConfig.endDate);
        });
    });
});

describe('lastDayOfMonth', () => {
    it('gets last day of each month', () => {
        const lastDayOfJanuary = getLastDayOfMonth(new Date(2023, 0, 1));
        const lastDayOfFebruary = getLastDayOfMonth(new Date(2023, 1, 1));
        const lastDayOfMarch = getLastDayOfMonth(new Date(2023, 2, 1));
        const lastDayOfApril = getLastDayOfMonth(new Date(2023, 3, 1));
        const lastDayOfMay = getLastDayOfMonth(new Date(2023, 4, 1));
        const lastDayOfJune = getLastDayOfMonth(new Date(2023, 5, 1));
        const lastDayOfJuly = getLastDayOfMonth(new Date(2023, 6, 1));
        const lastDayOfAugust = getLastDayOfMonth(new Date(2023, 7, 1));
        const lastDayOfSeptember = getLastDayOfMonth(new Date(2023, 8, 1));
        const lastDayOfOctober = getLastDayOfMonth(new Date(2023, 9, 1));
        const lastDayOfNovember = getLastDayOfMonth(new Date(2023, 10, 1));
        const lastDayOfDecember = getLastDayOfMonth(new Date(2023, 11, 1));

        expect(lastDayOfJanuary).toEqual(31);
        expect(lastDayOfFebruary).toEqual(28);
        expect(lastDayOfMarch).toEqual(31);
        expect(lastDayOfApril).toEqual(30);
        expect(lastDayOfMay).toEqual(31);
        expect(lastDayOfJune).toEqual(30);
        expect(lastDayOfJuly).toEqual(31);
        expect(lastDayOfAugust).toEqual(31);
        expect(lastDayOfSeptember).toEqual(30);
        expect(lastDayOfOctober).toEqual(31);
        expect(lastDayOfNovember).toEqual(30);
        expect(lastDayOfDecember).toEqual(31);
    });

    it('gets last day of each feb in a leap year', () => {
        const lastDayOfFebruary = getLastDayOfMonth(new Date(2024, 1, 1));

        expect(lastDayOfFebruary).toEqual(29);
    });
});
