import moment from 'moment';

export const buildDateStringMedium = (dateTime) => moment(dateTime).format('D MMMM YYYY');
