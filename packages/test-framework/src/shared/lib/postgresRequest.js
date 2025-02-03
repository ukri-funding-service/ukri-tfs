'use strict';

const pgp = require('pg-promise')({
    // Initialization Options
});

import { createPaths } from '.';
const paths = createPaths();

require('dotenv').config({ path: paths.service.api.env });

import { log } from '../../API/support/logging';

export const postgresRequest = async (opportunity_id) => {
    const username = process.env.TYPEORM_USERNAME;
    const password = process.env.TYPEORM_PASSWORD;
    const host = process.env.DB_HOST;
    const port = process.env.TYPEORM_PORT;
    const database = process.env.TYPEORM_DATABASE;

    const db = pgp(`postgres://${username}:${password}@${host}:${port}/${database}`);

    return db
        .any(
            'UPDATE tfs_opportunity_manager.opportunity SET opportunity_status_id = 2 WHERE opportunity_id = $1',
            opportunity_id,
        )
        .then((data) => {
            log.info('postgres Request successful - ' + data);
        })
        .catch((error) => {
            log.info('postgres Request Failed - ' + error);
        });
};
