'use strict';

const fs = require('fs');
const path = require('path');

import { createPaths } from '../../../shared/lib';
const paths = createPaths();

export const getApplicationManagerTfsUserId = () => {
    const filePath = path.join(paths.test.apiMocks + '/mockData/Person/');
    const Person_Files = fs.readdirSync(filePath);
    let users = [];
    if (Person_Files.length !== 0) {
        for (let file = 0; file < Person_Files.length; file++) {
            const fileContent = fs.readFileSync(filePath + Person_Files[file]).toString();
            const fileContentParsed = JSON.parse(fileContent);
            users = users.concat(fileContentParsed);
        }
    }
    return users;
};
