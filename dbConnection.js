const db = require('knex')(require('./knexfile.js').development);

const closeConnection = () => db.destroy();

module.exports = {
  db,
  closeConnection,
};
