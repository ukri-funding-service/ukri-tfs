const { getEmails } = require('./pollMailosaurMailbox');
const { wipeMailosaurMailbox, wipeMailTo } = require('./wipeMailosaurMailbox');

module.exports = { getEmails, wipeMailosaurMailbox, wipeMailTo };
