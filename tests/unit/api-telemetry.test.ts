import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { POST } from '../../app/api/telemetry2/route';

describe('telemetry api', () => {
  const dir = path.join(process.cwd(), '.data', 'telemetry');
  const file = path.join(dir, 'events.ndjson');
  beforeEach(async () => {
    delete process.env.TELEMETRY_API_KEY;
    await fs.promises.rm(dir, { recursive: true, force: true });
  });

  it('rejects invalid payload', async () => {
    const req = new Request('http://localhost/api/telemetry2', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('requires api key when configured', async () => {
    process.env.TELEMETRY_API_KEY = 'k';
    const req = new Request('http://localhost/api/telemetry2', {
      method: 'POST',
      body: JSON.stringify({ event: 'a' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('accepts valid event with key', async () => {
    process.env.TELEMETRY_API_KEY = 'k';
    const req = new Request('http://localhost/api/telemetry2', {
      method: 'POST',
      headers: { 'x-api-key': 'k' },
      body: JSON.stringify({ event: 'a', props: { b: 1 }, ts: 1 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const content = await fs.promises.readFile(file, 'utf-8');
    expect(content.trim()).toContain('"event":"a"');
  });
});
