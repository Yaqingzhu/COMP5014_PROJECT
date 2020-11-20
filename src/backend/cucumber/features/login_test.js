const { Given, Then, BeforeAll, AfterAll } = require('cucumber');
const assert = require('assert').strict;
const mysql = require('../../db_util');
const http = require('http');
const app = require('../../index');
const request = require('supertest');

let res;
let err;
let error;
let server;

BeforeAll(() => {
  server = http.createServer(app);
});

AfterAll(() => {
  server.close(function (e) {
    error = e;
  });
  console.log('server closed');
  mysql.getDBConnection().destroy();
  console.log(mysql.getDBConnection().state);
});

Given('start server', function () {
    err = server.listen();
});

Then('no error', function () {
    assert.notEqual(err, undefined);
});

Given('a user id set to {int} and password set to {string}', async (arg1, arg2) => {
    res = await request(app).post('/login').send({ id: arg1, password: arg2 });
});

Then('return a json with {string} equals to {int}', async (arg1, arg2) => {
    assert.equal(arg2, res.body.loginStatus);
});

Then('re-try this for 4 times a user id set to {int} and password set to {string}', async (arg1, arg2) => {
    for (let i = 0; i < 4; i++) {
        res = await request(app).post('/login').send({ id: arg1, password: arg2 });
    }
});

Then('no error occurred', function () {
    assert.equal(error, undefined);
});
