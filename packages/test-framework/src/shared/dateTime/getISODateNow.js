export const getISODateNow = () => {
    const timeStamp = new Date().getTime();
    return new Date(timeStamp).toISOString();
};
