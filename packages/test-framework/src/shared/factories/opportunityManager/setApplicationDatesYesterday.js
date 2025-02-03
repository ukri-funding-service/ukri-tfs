'use strict';

import { getISODateYesterday, setISODateHour } from '../../dateTime';
import { setApplicationDates } from '.';

export const setApplicationDatesYesterday = async () => {
    let openingDateTime = getISODateYesterday();
    openingDateTime = setISODateHour(openingDateTime, '09');
    let closingDateTime = getISODateYesterday();
    closingDateTime = setISODateHour(closingDateTime, '16');
    await setApplicationDates(openingDateTime, closingDateTime);
};
