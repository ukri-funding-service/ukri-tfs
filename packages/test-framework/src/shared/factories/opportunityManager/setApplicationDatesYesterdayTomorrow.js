'use strict';

import { getISODateTomorrow, getISODateYesterday, setISODateHour } from '../../dateTime';
import { setApplicationDates } from '.';

export const setApplicationDatesYesterdayTomorrow = async () => {
    let openingDateTime = getISODateYesterday();
    openingDateTime = setISODateHour(openingDateTime, '09');
    let closingDateTime = getISODateTomorrow();
    closingDateTime = setISODateHour(closingDateTime, '16');
    await setApplicationDates(openingDateTime, closingDateTime);
};
