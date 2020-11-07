const request = require('supertest');
const http = require('http');

const app = require('../index');

describe('Endpoints', () => {
  let server;

  beforeAll(() => {
    server = http.createServer(app);
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it('should return a Hello world', async () => {
    const res = await request(app).get('/').send();

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Hello World!');
  });
});
