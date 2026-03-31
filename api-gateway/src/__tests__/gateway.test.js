const request = require('supertest');
const app = require('../index.js');

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('monarch-api-gateway');
  });
});

describe('GET /unknown-route', () => {
  it('returns 404 for unregistered routes', async () => {
    const res = await request(app).get('/unknown-route-xyz');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /docs/services', () => {
  it('returns gateway service docs endpoints including orders and notifications', async () => {
    const res = await request(app).get('/docs/services');
    expect(res.status).toBe(200);
    expect(res.body.gateway).toBe('/docs');
    expect(typeof res.body.auth).toBe('string');
    expect(typeof res.body.inventory).toBe('string');
    expect(typeof res.body.orders).toBe('string');
    expect(typeof res.body.notifications).toBe('string');
  });
});
