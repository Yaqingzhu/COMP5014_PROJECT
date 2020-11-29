/* eslint-disable no-lone-blocks */
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
    server.close();
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

Given('a student {int} want to register course {string}', function (arg1, arg2) {
    testSession = session(app);
  return testSession
    .post('/login')
    .send({ id: arg1, password: 'test' })
    .expect(200)
    .then(function () {
      return testSession
        .post('/registercourse')
        .send(JSON.parse(arg2))
        .expect(200)
        .then(function (rr) {
          res = rr;
        });
    });
});

Given('a pending student want to register course {string}', function (arg1) {
    testSession = session(app);
  return testSession
    .post('/login')
    .send({ id: 223, password: 'test' })
    .expect(200)
    .then(function () {
      return testSession
        .post('/registercourse')
        .send(JSON.parse(arg1))
        .expect(500)
        .then(function (rr) {
          res = rr;
        });
    });
});

Given('a student {int} want to drop course {string}', function (arg1, arg2) {
    testSession = session(app);
  return testSession
    .post('/login')
    .send({ id: arg1, password: 'test' })
    .expect(200)
    .then(function () {
      return testSession
        .post('/dropcourse')
        .send(JSON.parse(arg2))
        .expect(200)
        .then(function (rr) {
          res = rr;
        });
    });
});

Given('a student {int} want to late register course {string}', function (arg1, arg2) {
    return new Promise((resolve, reject) => {
        mysql.updateAcademicForTest(resolve, reject);
    }).then(function () {
        {
            testSession = session(app);
        return testSession
            .post('/login')
            .send({ id: arg1, password: 'test' })
            .expect(200)
            .then(function () {
            return testSession
                .post('/registercourse')
                .send(JSON.parse(arg2))
                .expect(200)
                .then(function (rr) {
                res = rr;
                });
            });
        }
    });
});

Given('a student {int} want to late drop course {string}', function (arg1, arg2) {
    return new Promise((resolve, reject) => {
        mysql.updateAcademicForTest(resolve, reject);
    }).then(function () {
        {
            testSession = session(app);
        return testSession
            .post('/login')
            .send({ id: arg1, password: 'test' })
            .expect(200)
            .then(function () {
            return testSession
                .post('/dropcourse')
                .send(JSON.parse(arg2))
                .expect(200)
                .then(function (rr) {
                res = rr;
                });
            });
        }
    });
});

Given('a student {int} want to list courses {string}', function (arg1, arg2) {
    return new Promise((resolve, reject) => {
        mysql.updateAcademicForTest(resolve, reject);
    }).then(function () {
        testSession = session(app);
        return testSession
            .post('/login')
            .send({ id: arg1, password: 'test' })
            .expect(200)
            .then(function () {
            return testSession
                .get('/listcourses')
                .query(JSON.parse(arg2))
                .expect(200)
                .then(function (rr) {
                  res = rr;
                });
            });
    });
});

Then('course return a json with responseCode equals to {int}', function (arg1) {
    const jres = res.body;
    assert.equal(arg1, jres.responseCode);
});

Then('course return a json with error message contains {string}', function (arg1) {
    const jres = res.body;
    assert.equal(true, String(jres.errorMessage).includes(arg1));
});

Then('course return a json with payload contains course {int}', function (arg1) {
    const jres = res.body;
    assert.equal(arg1, JSON.parse(jres.courses)[0].courseId);
});
