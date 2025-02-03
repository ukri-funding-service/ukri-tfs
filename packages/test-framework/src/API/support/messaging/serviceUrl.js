'use strict';

const isLoopbackHost = (url) => {
    // eslint-disable-next-line no-restricted-syntax
    return url.includes('localhost') || url.includes('127.0.0.1');
};
const getServiceUrl = (port, service) => {
    if (!port) {
        throw new Error('Port is required');
    }

    if (!service) {
        throw new Error('Service is required');
    }

    const serviceUrl = process.env.SERVICE_URL || '';
    return isLoopbackHost(serviceUrl) ? `http://127.0.0.1:${port}` : `http://${service}:${port}`;
};

module.exports = { getServiceUrl };
