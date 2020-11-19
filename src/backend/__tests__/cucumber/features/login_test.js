const { Given, Then, Before, After } = require('cucumber');
const assert = require('assert').strict;
const mysql = require('../../../db_util');
const http = require('http');
const app = require('../../../index');
const request = require('supertest');

let server;
let res;

Before(function () {
  server = http.createServer(app);
  server.listen();

  new Promise(resolve => {
    mysql.insertNewUserLoginInformation(resolve, 123, 't');
  }).then();
});

After(function () { server.close(); });

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
