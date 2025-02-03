'use strict';

import { getISODateNow, getISODateNowPlusSeconds, setISODateHour } from '../../dateTime';
import { setApplicationDates } from '.';

export const setApplicationDatesNow = async (seconds) => {
    let openingDateTime = getISODateNow();
    openingDateTime = setISODateHour(openingDateTime, '00');
    const closingDateTime = getISODateNowPlusSeconds(seconds);
    await setApplicationDates(openingDateTime, closingDateTime);
};
