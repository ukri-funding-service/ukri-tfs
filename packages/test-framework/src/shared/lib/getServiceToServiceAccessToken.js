'use strict';

import { createPaths } from '.';
const paths = createPaths();

require('dotenv').config({ path: paths.service.app.env });

/**
 * Get a service to service token
 */

const createAccessTokenProvider = require('@ukri-tfs/auth').createAccessTokenProvider;

const CLIENT_CREDENTIALS_ID = process.env.CLIENT_CREDENTIALS_ID;
const CLIENT_CREDENTIALS_URL = process.env.CLIENT_CREDENTIALS_URL;
const CLIENT_CREDENTIALS_SECRET = process.env.CLIENT_CREDENTIALS_SECRET;
const CLIENT_CREDENTIALS_SCOPE = process.env.CLIENT_CREDENTIALS_SCOPE;

export const getServiceToServiceAccessToken = () => {
    return new Promise((resolve, reject) => {
        if (!CLIENT_CREDENTIALS_ID) reject('CLIENT_CREDENTIALS_ID not set');
        if (!CLIENT_CREDENTIALS_URL) reject('CLIENT_CREDENTIALS_URL not set');
        if (!CLIENT_CREDENTIALS_SECRET) reject('CLIENT_CREDENTIALS_SECRET not set');
        if (!CLIENT_CREDENTIALS_SCOPE) reject('CLIENT_CREDENTIALS_SCOPE not set');
        createAccessTokenProvider(
            CLIENT_CREDENTIALS_SCOPE,
            CLIENT_CREDENTIALS_URL,
            CLIENT_CREDENTIALS_ID,
            CLIENT_CREDENTIALS_SECRET,
        )
            .getCurrentAccessToken()
            .then((id) => {
                return resolve(id);
            });
    });
};
