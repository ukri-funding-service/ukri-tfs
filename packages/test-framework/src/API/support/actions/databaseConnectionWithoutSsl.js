'use strict';

const pgp = require('pg-promise')();

export const databaseConnectionWithoutSsl = async (database) => {
    let conn;
    let response;

    switch (database) {
        case 'Admin Services':
            conn = {
                host: process.env['TEST_ADM_DB_HOST'] || 'db',
                port: (process.env['TEST_ADM_DB_PORT'] && Number(process.env['TEST_ADM_DB_PORT'])) || 5434,
                database: 'postgres',
                user: 'postgres',
                password: 'adm-db',
            };
            break;

        case 'Application Manager':
            conn = {
                host: process.env['TEST_AM_DB_HOST'] || 'db',
                port: (process.env['TEST_AM_DB_PORT'] && Number(process.env['TEST_AM_DB_PORT'])) || 5433,
                database: 'postgres',
                user: 'postgres',
                password: 'am-db',
            };
            break;

        case 'Opportunity Manager':
            conn = {
                host: process.env['TEST_OM_DB_HOST'] || 'db',
                port: (process.env['TEST_OM_DB_PORT'] && Number(process.env['TEST_OM_DB_PORT'])) || 5435,
                database: 'postgres',
                user: 'postgres',
                password: 'om-db',
            };
            break;

        default:
            throw new Error(`Unexpected Service in when.js: ${database}`);
    }

    const db = pgp(conn);

    try {
        await db.any('select 1');
        response = `Connected to ${database} database without using SSL`;
    } catch (err) {
        response = err;
    }

    pgp.end();
    db.$pool.end;

    return response;
};
