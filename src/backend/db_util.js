const mysql = require('mysql');

// Environment variables for the database
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

function getDBConnection() {
  const connec = mysql.createConnection({
    host: DB_HOST || '127.0.0.1',
    user: DB_USERNAME || 'root',
    password: DB_PASSWORD || 'comp4004',
    database: DB_DATABASE || 'comp4004'
  });
  return connec;
}

function checkUserRole(resolve, userId) {
  const connection = getDBConnection();
  connection.connect();
  connection.query('UPDATE login SET failed_time = 0 WHERE id =?', [
    userId
  ]);
  connection.query('SELECT 1 AS result FROM admin WHERE admin_id = ? UNION SELECT 2 AS result FROM prof WHERE prof_id = ? UNION SELECT 2 AS result FROM student WHERE student_id = ?', [
    userId, userId, userId
  ], (error, results) => {
    console.log(error);
    const rest = results[0] ? results[0].result : -1;
    resolve(rest);
  });
  connection.end();
}

function updateFailedTimes(resolve, userId) {
  const connection = getDBConnection();
  connection.connect();
  connection.query('UPDATE login SET failed_time = failed_time + 1  WHERE id =?', [
    userId
  ], (error, results) => {
    if (!error) {
      connection.query('SELECT failed_time AS result FROM login WHERE id =?', [
        userId, userId
      ], (error, results) => {
        if (!error) {
          const rest = results[0] ? results[0].result : -1;
          console.log(results);

          console.log('updateFailedTimes');
          console.log(error);
          resolve(rest);
        }
      });
    }
  });
  connection.end();
}

function insertNewUserLoginInformation(resolve, userId, password) {
  const connection = getDBConnection();
  connection.connect();
  connection.query('INSERT IGNORE INTO login(id, password, failed_time) values(?,?,?)', [
    userId, password, 0
    // eslint-disable-next-line node/handle-callback-err
  ], (error, results) => {
    const rest = results[0] ? results[0].result : -1;
    resolve(rest);
  });
  connection.end();
}

function createAdminUser() {
  const adminUser = {
    id: process.env.ADMIN_USERNAME || '1',
    password: process.env.ADMIN_USERNAME || 'admin',
  };

  const connection = getDBConnection();
  connection.connect();
  connection.query('SELECT 1 AS result FROM login WHERE id = ? AND password = ?', [
    adminUser.id, adminUser.password
  ], error => {
    if (!error) {
      // only insert if the user could not be found
      insertNewUserLoginInformation(function () {
        connection.query('INSERT IGNORE INTO admin(admin_id) values(?)', [
          adminUser.id
        ]);
      }, adminUser.id, adminUser.password);
    }
  });
  connection.end();
}

module.exports = { getDBConnection, checkUserRole, updateFailedTimes, insertNewUserLoginInformation, createAdminUser };
