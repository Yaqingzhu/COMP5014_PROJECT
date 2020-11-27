
const { Given, Then, AfterAll, BeforeAll } = require('cucumber');
const assert = require('assert').strict;
const mysql = require('../../db_util');
const http = require('http');
const util = require('../../general_APIs');
const app = require('../../index');
const session = require('supertest-session');


const req = {
    session: {
        role: '',
        isLogin: false
    }
};

let res;
let testSession;
let server;

BeforeAll(() => {
  server = http.createServer(app);
});

AfterAll(() => {
  server.close(function (e) {
    console.error(e);
  });
  mysql.getDBConnection().destroy();
});

Given('a session role is {string}', function (arg1) {
    req.session.role = arg1;
});

Then('vaildation for admin is {int} for student is {int} for prof is {int}', function (arg1, arg2, arg3) {
    assert.equal(Boolean(arg1), util.validateAdmin(req));
    assert.equal(Boolean(arg2), util.validateStudent(req));
    assert.equal(Boolean(arg3), util.validateProf(req));
});

Given('a session login is {int}', function (arg1) {
    req.session.isLogin = Boolean(arg1);
});

Then('vaildation login is {int}', function (arg1) {
    assert.equal(Boolean(arg1), util.validateLogin(req));
});

Given('a course id {string}', function (arg1) {
    testSession = session(app);
    return testSession
      .post('/login')
      .send({ id: 1, password: 'admin' })
      .expect(200)
      .then(function () {
        return testSession
          .get('/course')
          .send(JSON.parse(arg1))
          .expect(200)
          .then(function (rr) {
            res = rr;
          });
      });
  });

Then('return a payload with course name {string}', function (arg1) {
    const courseName = JSON.parse(res.body.coursePayload);
    assert.equal(arg1, courseName.courseName);
});

Then('return a payload with list of courses {int} and {int}', function (arg1, arg2) {
    const courseName = res.body.coursePayload;
    assert.equal(true, courseName.includes(arg1));
    assert.equal(true, courseName.includes(arg1));
});

