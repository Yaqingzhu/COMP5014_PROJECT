const { Given, Then, AfterAll, BeforeAll } = require('cucumber');
const assert = require('assert').strict;
const mysql = require('../../db_util');
const http = require('http');
const app = require('../../index');
const session = require('supertest-session');

let res;
let cookie;
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

Given('a student want to apply for creation with this payload {string}', function (arg1) {
    testSession = session(app);
    return testSession
      .post('/applycreatestudent')
      .send(JSON.parse(arg1))
      .expect(200)
      .then(function (rr) {
        res = rr;
      });
});

Then('return a json with admitted equals to {int}', function (arg1) {
    const jres = res.body;
    assert.equal(Boolean(arg1), jres.admitted);
});
