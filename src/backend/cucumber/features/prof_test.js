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
let profId;

BeforeAll(() => {
    server = http.createServer(app);
  });

  AfterAll(() => {
    server.close();
    mysql.getDBConnection().destroy();
  });

Given('{string} a prof with this payload {string}', function (arg1, arg2) {
    let url;
    let jreq;

    switch (arg1) {
        case 'create': url = '/createprof';
        break;
        case 'update': url = '/modifyprof';
        break;
        case 'delete': url = '/deleteprof';
        break;
    }

    if (arg1 !== 'delete') {
        jreq = JSON.parse(arg2);
        if (arg1 === 'update') {
            jreq.profId = profId;
        }
    }

    testSession = session(app);
  return testSession
    .post('/login')
    .send({ id: 1, password: 'admin12' })
    .expect(200)
    .then(function () {
      return testSession
        .post(url)
        .send(arg1 !== 'delete' ? jreq : { profId: profId })
        .expect(200)
        .then(function (rr) {
          res = rr;
          if (arg1 === 'create') {
            profId = rr.body.profId;
          }
        });
    });
});

Then('return a json with response equals to {int}', function (arg1) {
    const jres = res.body;
    assert.equal(arg1, jres.responseCode);
});
