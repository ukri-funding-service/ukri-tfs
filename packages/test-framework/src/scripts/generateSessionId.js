const generateSessionId = () => {
    const startString = '000000000000';
    const sessionId = startString.replace(/0/g, () => {
        return ((Math.random() * 16) | 0).toString(16);
    });

    // eslint-disable-next-line no-console
    console.info(`Session UID is: ${sessionId}`);
    return sessionId;
};

module.exports = generateSessionId;
