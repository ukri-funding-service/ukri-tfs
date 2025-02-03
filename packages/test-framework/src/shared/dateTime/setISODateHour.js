export const setISODateHour = (isoDate, hour) => {
    const isoDateSplit = isoDate.split('T');
    return `${isoDateSplit[0]}T${hour}:00:00.000Z`;
};
