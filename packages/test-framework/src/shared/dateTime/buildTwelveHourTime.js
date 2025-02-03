import { DateTime, Settings as DateTimeSettings } from 'luxon';
import { calculateLuxonTimeZone } from '.';

DateTimeSettings.defaultLocale = 'en-GB';

export const buildTwelveHourTime = (dateTime) => {
    let luxonDateTime = DateTime.fromISO(dateTime);
    const offsetNameShort = luxonDateTime.offsetNameShort;
    const luxonTimeZone = offsetNameShort === 'GMT+1' || offsetNameShort === 'BST' ? 'BST' : 'GMT';
    const calculatedTimeZone = calculateLuxonTimeZone(dateTime);

    // Line below adjusts luxonDateTime by plus one hour so as tests pass in the pipeline.
    // This is because the pipeline does not make adjustments for British Summer Time.
    if (luxonTimeZone !== calculatedTimeZone) luxonDateTime = luxonDateTime.plus({ hour: 1 });

    let ampm = 'am';
    let hour = luxonDateTime.hour;
    if (hour >= 12) ampm = 'pm';
    if (hour === 0) hour = 12;
    if (hour >= 13) hour -= 12;
    const minute = luxonDateTime.minute;
    return `${hour.toString()}:${minute.toString().padStart(2, '0')}${ampm}`;
};
