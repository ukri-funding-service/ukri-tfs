import moment from 'moment';

export const isIsoDateTime = (maybeIsoDateTime: unknown): maybeIsoDateTime is string => {
    if (!maybeIsoDateTime) return false;
    if (typeof maybeIsoDateTime !== 'string') return false;

    return moment(maybeIsoDateTime, moment.ISO_8601).isValid();
};
