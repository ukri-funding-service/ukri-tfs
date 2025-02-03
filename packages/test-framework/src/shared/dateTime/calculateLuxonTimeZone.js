import { DateTime, Settings as DateTimeSettings } from 'luxon';
import { calculateLuxonLastSundayOfMonth } from '.';

DateTimeSettings.defaultLocale = 'en-GB';

export const calculateLuxonTimeZone = (dateTime) => {
    const currentDate = DateTime.fromISO(dateTime);
    const firstOfMarch = DateTime.utc(currentDate.year, 3);
    const firstOfOctober = DateTime.utc(currentDate.year, 10);
    const bstStartDate = calculateLuxonLastSundayOfMonth(firstOfMarch);
    const bstEndDate = calculateLuxonLastSundayOfMonth(firstOfOctober);
    return currentDate >= bstStartDate && currentDate < bstEndDate ? 'BST' : 'GMT';
};
