'use strict';

import { getISODateTomorrow, setISODateHour } from '../../dateTime';
import { setApplicationDates } from '.';

export const setApplicationDatesTomorrow = async () => {
    let openingDateTime = getISODateTomorrow();
    openingDateTime = setISODateHour(openingDateTime, '09');
    let closingDateTime = getISODateTomorrow();
    closingDateTime = setISODateHour(closingDateTime, '16');
    await setApplicationDates(openingDateTime, closingDateTime);
};
