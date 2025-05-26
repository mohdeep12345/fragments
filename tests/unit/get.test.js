const request = require('supertest');
const app = require('../../src/app');

describe('404 Handler', () => {
  test('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/this/route/does/not/exist');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');      // keep this
    expect(res.body.code).toBe(404);            // changed from error to code
    expect(res.body.message).toBe('not found'); // changed from error to message
  });
});
