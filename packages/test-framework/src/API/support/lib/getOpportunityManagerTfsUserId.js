'use strict';

const getGetMockedTfsUserId = function () {
    return require('../../../shared/data/tfsUsers.json').users[0].tfsId;
};

export const getOpportunityManagerTfsUserId = function () {
    return process.env['TEST_TFS_USER_ID'] || getGetMockedTfsUserId();
};
