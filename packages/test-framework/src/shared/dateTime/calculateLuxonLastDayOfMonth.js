import { Settings as DateTimeSettings } from 'luxon';

DateTimeSettings.defaultLocale = 'en-GB';

export const calculateLuxonLastDayOfMonth = (dateTime) => {
    return dateTime.endOf('month').startOf('day');
};
