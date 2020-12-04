/* eslint-disable no-lone-blocks */
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
  server.close();
  mysql.getDBConnection().destroy();
});

Given('{string} a deliverable with this payload {string}', function (arg1, arg2) {
  let url;

  switch (arg1) {
    case 'create': url = '/createdeliverable';
      break;
    case 'update': url = '/modifydeliverable';
      break;
    case 'delete': url = '/deletedeliverable';
      break;
  }

  testSession = session(app);
  return testSession
    .post('/login')
    .send({ id: 1, password: 'admin' })
    .expect(200)
    .then(function () {
      return testSession
        .post(url)
        .send(JSON.parse(arg2))
        .expect(200)
        .then(function (rr) {
          res = rr;
        });
    });
});

Given('a request to fetch a deliverable with this payload {string}', function (arg1) {
  testSession = session(app);
  return testSession
    .post('/login')
    .send({ id: 1, password: 'admin' })
    .expect(200)
    .then(function () {
      return testSession
        .get('/deliverable')
        .query(JSON.parse(arg1))
        .expect(200)
        .then(function (rr) {
          res = rr;
        });
    });
});

Given('a request to fetch deliverables for a course with this payload {string}', function (arg1) {
  testSession = session(app);
  return testSession
    .post('/login')
    .send({ id: 1, password: 'admin' })
    .expect(200)
    .then(function () {
      return testSession
        .get('/coursedeliverable')
        .query(JSON.parse(arg1))
        .expect(200)
        .then(function (rr) {
          res = rr;
        });
    });
});

Then('return a json with response code equals to {int}', function (arg1) {
  const jres = res.body;
  assert.equal(arg1, jres.responseCode);
});
