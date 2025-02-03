export const getISODateNowPlusSeconds = (seconds) => {
    const timeStamp = new Date().getTime() + seconds * 1000;
    const isoDate = new Date(timeStamp).toISOString();
    return `${isoDate.slice(0, -5)}.000Z`;
};
