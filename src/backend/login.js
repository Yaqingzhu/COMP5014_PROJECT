const mysql = require('./db_util');

const connection = mysql.getDBConnection();

async function loginRequestProcess(req, res) {
  checkDB(req.body.id, req.body.password, req, res);
}

function checkDB(id, password, req, res) {
  connection.query('SELECT 1 AS result FROM login WHERE id = ? AND password = ? AND failed_time < 4', [
    id, password
  ], (error, results) => {
    setLoginStatus(error, results, req, res, id);
  });
}

function setLoginStatus(error, results, req, res, id) {
  if (error) throw error;
  const rest = results[0] ? results[0].result : -1;

  if (rest === 1) {
    if (req.session && !req.session.isLogin) {
      req.session.isLogin = true;
    }
    setUserRole(req.session, id, res);
  } else {
    setErrorMessage(res, id);
  }
}

function setErrorMessage(res, id) {
  new Promise((resolve, reject) => {
    mysql.updateFailedTimes(resolve, id);
  }).catch(function () {
    res.status(500).json({
      loginStatus: -5,
      message: 'login failed due to server issue',
      loginRole: 'none',
      loginName: ''
    });
  }).then(result => {
    if (result) {
      if (result > 4) {
        res.status(403).json({
          loginStatus: -2,
          message: 'login failed. You tried more than 4 times and your account is locked. Please talk to admin to unlock your account.',
          loginRole: 'none',
          loginName: ''
        });
      } else {
        res.status(403).json({
          loginStatus: -1,
          message: 'login failed. Please check your password and user id.',
          loginRole: 'none',
          loginName: ''
        });
      }
    }
  });
}

function setUserRole(session, id, res) {
  new Promise((resolve, reject) => {
    mysql.checkUserRole(resolve, reject, id);
  }).then(result => {
    if (session) {
      switch (result.result) {
        case 1:
          session.role = 'admin';
          break;
        case 2:
          session.role = 'prof';
          break;
        case 3:
          session.role = 'student';
          break;
        default:
          session.role = 'none';
      }
    }
    res.status(200).json({
      loginStatus: 0,
      message: 'none',
      loginRole: session.role || 'none',
      loginId: id,
      loginName: result.name
    });
  });
}

function setLogout(req, res) {
  if (req.session && req.session.isLogin) {
    req.session.isLogin = false;
    res.status(200).json({
      loginStatus: -1,
      message: 'you are logout!',
    });
  } else {
    res.status(403).json({
      loginStatus: -2,
      message: 'logout failed. Please login before logout',
    });
  }
}

module.exports = { loginRequestProcess, setLogout };
