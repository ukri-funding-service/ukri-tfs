'use strict';

const { expect } = require('chai');
import { file as tmpFile } from 'tmp-promise';
import fs from 'fs';
import { promisify } from 'util';
import fetch from 'node-fetch';

const get = require('lodash.get');

const Ajv = require('ajv');

const SwaggerParser = require('@apidevtools/swagger-parser');

const openApi = require('ajv-openapi');

const ajvOptions = {
    schemaId: 'auto',
    format: 'full',
    coerceTypes: true,
    unknownFormats: 'ignore',
    useDefaults: true,
    nullable: true,
};

const openApiOptions = {
    useDraft04: true,
};

const fsClose = promisify(fs.close);
const fsWrite = promisify(fs.write);

const ajv = openApi(new Ajv(ajvOptions), openApiOptions);

// We use an extended JSON schema which includes the data-type of 'file'.  Strip it so that the default SwaggerParser can handle it.
const sanitiseSchema = (yaml) =>
    yaml
        .split('\n')
        .map((line) => (line.trim() === 'type: file' ? line.replace('type: file', 'type: string') : line))
        .join('\n');

// The whole purpose of this function is to be able to 'sanitise' the schema between getting it and SwaggerParser.
// Otherwise SwaggerParser.validate could do this in a single step.
const getAndParseSchema = async (serviceUrl) => {
    const response = await fetch(`${serviceUrl}/documentation/yaml`);
    const yaml = sanitiseSchema(await response.text());
    const { fd, path, cleanup } = await tmpFile();
    let openAPI;
    try {
        await fsWrite(fd, yaml);
        await fsClose(fd);
        openAPI = await SwaggerParser.validate(`file://${path}`);
    } finally {
        cleanup();
    }
    return openAPI;
};

const schemaCache = {};

const getAndParseSchemaCached = async (serviceUrl) => {
    if (!schemaCache[serviceUrl]) {
        schemaCache[serviceUrl] = await getAndParseSchema(serviceUrl);
    }

    return schemaCache[serviceUrl];
};

export const validateAgainstSchema = async (body, schemaName) => {
    /*
    Test Framework version 149 was updated so as the schema check uses the environment variable REST_SERVICE_URL instead of SERVICE_URL if it is present.
    This is because in Application Manager and Admin Manager SERVICE_URL points to the REST API.
    Whereas in Opportunity Manager SERVICE_URL points to the GraphQL API and REST_SERVICE_URL points to the REST API.
    Since implementing this, it has been discovered that the build pipeline uses a dummy value in REST_SERVICE_URL which includes the server name but no port.
    This code has been updated to exclude these variables by checking that the last character is not a colon.
     */
    let serviceUrl = process.env.SERVICE_URL;
    // TODO: Improve below check so as the port is properly extracted.
    if (typeof process.env.REST_SERVICE_URL !== 'undefined' && process.env.REST_SERVICE_URL.slice(-1) !== ':') {
        serviceUrl = process.env.REST_SERVICE_URL;
    }
    const openAPI = await getAndParseSchemaCached(serviceUrl);
    const schema = get(openAPI.paths, schemaName);
    const result = ajv.validate(schema, body);
    return expect(result, 'Response does not match schema : ' + JSON.stringify(ajv.errors)).to.be.true;
};
