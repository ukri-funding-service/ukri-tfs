export const getISODateYesterday = () => {
    const yesterdayTimeStamp = new Date().getTime() - 24 * 60 * 60 * 1000;
    return new Date(yesterdayTimeStamp).toISOString();
};
