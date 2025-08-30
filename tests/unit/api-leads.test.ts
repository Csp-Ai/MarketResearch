import { describe, it, expect, beforeEach } from 'vitest';
import { POST } from '../../app/api/leads2/route';

describe('leads api', () => {
  beforeEach(() => {
    delete process.env.LEADS_API_KEY;
  });

  it('rejects missing fields', async () => {
    const req = new Request('http://localhost/api/leads2', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('requires api key when configured', async () => {
    process.env.LEADS_API_KEY = 'secret';
    const req = new Request('http://localhost/api/leads2', {
      method: 'POST',
      body: JSON.stringify({ email: 'a@b.com', company: 'c', size: '1', vertical: 'v' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('accepts valid lead with key', async () => {
    process.env.LEADS_API_KEY = 'secret';
    const req = new Request('http://localhost/api/leads2', {
      method: 'POST',
      headers: { 'x-api-key': 'secret' },
      body: JSON.stringify({ email: 'a@b.com', company: 'c', size: '1', vertical: 'v' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });
});
