export const getISODateNowPlusTwentySeconds = () => {
    const timeStamp = new Date().getTime() + 20000;
    const isoDate = new Date(timeStamp).toISOString();
    return `${isoDate.slice(0, -5)}.000Z`;
};
