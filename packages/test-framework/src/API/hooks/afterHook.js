import { createPaths } from '../../shared/lib';
const paths = createPaths();

const variables = require(paths.framework.api.serviceVariables);

const afterFunction = function () {
    variables.body = '';

    if (process.env.SERVICE === 'application-manager') {
        variables.userId = '';
        variables.personId = '';
        variables.queryName = '';
    }
};

export { afterFunction as afterHook };
