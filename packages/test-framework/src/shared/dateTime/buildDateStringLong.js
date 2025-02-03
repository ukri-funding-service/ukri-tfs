import moment from 'moment';

export const buildDateStringLong = (dateTime) => moment(dateTime).format('dddd D MMMM YYYY');
