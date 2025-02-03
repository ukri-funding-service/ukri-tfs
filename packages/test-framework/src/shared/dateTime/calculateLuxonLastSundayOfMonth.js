import { Settings as DateTimeSettings } from 'luxon';
import { calculateLuxonLastDayOfMonth } from '.';

DateTimeSettings.defaultLocale = 'en-GB';

export const calculateLuxonLastSundayOfMonth = (dateTime) => {
    const luxonLastDayOfMonth = calculateLuxonLastDayOfMonth(dateTime);
    return luxonLastDayOfMonth.weekday === 7
        ? luxonLastDayOfMonth.startOf('day')
        : luxonLastDayOfMonth.minus({ days: luxonLastDayOfMonth.weekday }).startOf('day');
};
