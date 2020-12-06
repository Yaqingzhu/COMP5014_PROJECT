/* eslint-disable no-lone-blocks */
const { Given, When, Then, AfterAll, BeforeAll } = require('cucumber');
const assert = require('assert').strict;
const mysql = require('../../db_util');
const http = require('http');
const app = require('../../index');
const session = require('supertest-session');

let res;
let studentId;
let registrationId;
let deliverableId;
let testSession;
let server;

BeforeAll(() => {
  server = http.createServer(app);
});

AfterAll(() => {
  server.close();
  mysql.getDBConnection().destroy();
});

Given('a student with this payload {string} exists', function (arg1) {
  testSession = session(app);
  return testSession
    .post('/applycreatestudent')
    .send(JSON.parse(arg1))
    .expect(200)
    .then(function (rr) {
      studentId = rr.body.studentId;

      const body = JSON.parse(arg1);
      return testSession
        .post('/login')
        .send({ id: 1, password: 'admin' })
        .expect(200)
        .then(function () {
          return testSession
            .post('/modifystudent')
            .send({
              ...body,
              studentName: body.name,
              studentEmail: body.email,
              studentId: studentId,
              admitted: true,
            })
            .expect(200);
        });
    });
});

Given('the student is registered in course {int}', function (arg1) {
  testSession = session(app);
  return testSession
    .post('/login')
    .send({ id: studentId, password: 'test' })
    .expect(200)
    .then(function () {
      return testSession
        .post('/registercourse')
        .send({
          studentId,
          courseId: arg1,
        })
        .expect(200)
        .then(function (rr) {
          registrationId = rr.body.registrationId;
        });
    });
});

Given('a deliverable with this payload {string} exists', function (arg1) {
  testSession = session(app);
  return testSession
    .post('/login')
    .send({ id: 1, password: 'admin' })
    .expect(200)
    .then(function () {
      return testSession
        .post('/createdeliverable')
        .send(JSON.parse(arg1))
        .expect(200)
        .then(function (rr) {
          deliverableId = rr.body.deliverableId;
        });
    });
});

When('the student submits a file for the deliverable', function () {
  testSession = session(app);
  return testSession
    .post('/login')
    .send({ id: studentId, password: 'test' })
    .expect(200)
    .then(function () {
      return testSession
        .post('/submitdeliverable')
        .attach('submission', Buffer.from('some data'), 'custom_file_name.txt')
        .field('registrationId', registrationId)
        .field('deliverableId', deliverableId)
        .expect(200)
        .then(function (rr) {
          res = rr;
        });
    });
});

When('the student requests a submission', function () {
  testSession = session(app);
  return testSession
    .post('/login')
    .send({ id: studentId, password: 'test' })
    .expect(200)
    .then(function () {
      return testSession
        .get('/submission')
        .send({
          registrationId,
          deliverableId,
        })
        .expect(200)
        .then(function (rr) {
          res = rr;
        });
    });
});

When('the student requests all submissions', function () {
  testSession = session(app);
  return testSession
    .post('/login')
    .send({ id: studentId, password: 'test' })
    .expect(200)
    .then(function () {
      return testSession
        .get('/submissions')
        .send({
          registrationId,
          deliverableId,
        })
        .expect(200)
        .then(function (rr) {
          res = rr;
        });
    });
});

Then('the submission return a json with responseCode equals to {int}', function (arg1) {
  const jres = res.body;
  assert.equal(arg1, jres.responseCode);
});
