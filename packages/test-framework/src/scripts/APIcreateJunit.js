'use strict';

const cucumberJunitConvert = require('cucumber-junit-convert');

const { createPaths } = require('../shared/lib/createPaths');

const paths = createPaths();

const options = {
    inputJsonFile: `${paths.test.api.output.reports}/cucumber-report.json`,
    outputXmlFile: `${paths.test.api.output.reports}/cucumber-report_junit.xml`,
};

cucumberJunitConvert.convert(options);
