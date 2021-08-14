var mysql = require('mysql2/promise');
var config = require("./db.mysql.config")
const connection = () => {
  var connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.pass,
    database: config.db,
    timezone: "Z"
  });
  return connection
}

module.exports = {
  connection
};