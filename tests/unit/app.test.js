// tests/unit/app.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('404 Handler', () => {
  test('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/this/route/does/not/exist');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error).toBe('not found');
  });
});
