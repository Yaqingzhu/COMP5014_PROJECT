const { Given, Then, AfterAll, BeforeAll } = require('cucumber');
const assert = require('assert').strict;
const mysql = require('../../db_util');
const http = require('http');
const app = require('../../index');
const session = require('supertest-session');

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

Given('a deadline json file {string}', function (arg1) {
    testSession = session(app);
    return testSession
      .post('/login')
      .send({ id: 1, password: 'admin' })
      .expect(200)
      .then(function () {
        return testSession
          .post('/updateacademicline')
          .send(JSON.parse(arg1))
          .expect(200)
          .then(function (rr) {
            res = rr;
          });
      });
  });

  Given('a request to get deadlines', function () {
    return testSession
        .get('/academicline')
        .send()
        .expect(200)
        .then(function (rr) {
        res = rr;
        });
    });

Then('deadline get a response with responseCode {int}', function (arg1) {
    assert.equal(arg1, res.body.responseCode);
});

Then('get a response with registrationDeadline {string}, dropDeadline {string}', function (arg1, arg2) {
    assert.equal(true, res.body.registrationDeadline.includes(arg1));
    assert.equal(true, res.body.dropDeadline.includes(arg2));
});
