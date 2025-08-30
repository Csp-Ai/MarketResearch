import { describe, it, expect, beforeEach, vi } from 'vitest';
import { track, flush } from '../../lib/telemetry/client';
import { POST } from '../../app/api/telemetry2/route';
import fs from 'fs';
import path from 'path';

describe('telemetry client', () => {
  const store: Record<string, string> = {};
  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    globalThis.localStorage = {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
      clear: () => {
        Object.keys(store).forEach((k) => delete store[k]);
      },
    } as any;
    globalThis.fetch = vi.fn();
    Object.defineProperty(globalThis, 'navigator', {
      value: { onLine: true },
      configurable: true,
    });
  });

  it('buffers events when offline', async () => {
    navigator.onLine = false;
    await track('test');
    const buf = JSON.parse(localStorage.getItem('telemetry_buffer') || '[]');
    expect(buf.length).toBe(1);
  });

  it('flush sends buffered events', async () => {
    navigator.onLine = false;
    await track('test2');
    navigator.onLine = true;
    (fetch as any).mockResolvedValue({ ok: true });
    await flush();
    const buf = JSON.parse(localStorage.getItem('telemetry_buffer') || '[]');
    expect(buf.length).toBe(0);
    expect((fetch as any).mock.calls.length).toBe(1);
  });

  it('includes api key header when configured', async () => {
    process.env.NEXT_PUBLIC_TELEMETRY_API_KEY = 'secret';
    (fetch as any).mockResolvedValue({ ok: true });
    await track('key-test');
    expect((fetch as any).mock.calls[0][1].headers['x-api-key']).toBe('secret');
    delete process.env.NEXT_PUBLIC_TELEMETRY_API_KEY;
  });
});

describe('telemetry route', () => {
  const dir = path.join(process.cwd(), '.data', 'telemetry');
  const file = path.join(dir, 'events.ndjson');
  beforeEach(async () => {
    await fs.promises.rm(dir, { recursive: true, force: true });
  });

  it('writes events to ndjson', async () => {
    const req = new Request('http://localhost/api/telemetry2', {
      method: 'POST',
      body: JSON.stringify({ event: 'api', props: { a: 1 }, ts: 1 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it('requires api key when configured', async () => {
    process.env.TELEMETRY_API_KEY = 'secret';
    const req = new Request('http://localhost/api/telemetry2', {
      method: 'POST',
      body: JSON.stringify({ event: 'api', props: { a: 1 }, ts: 1 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
    delete process.env.TELEMETRY_API_KEY;
  });

  it('accepts matching api key', async () => {
    process.env.TELEMETRY_API_KEY = 'secret';
    const req = new Request('http://localhost/api/telemetry2', {
      method: 'POST',
      headers: { 'x-api-key': 'secret' },
      body: JSON.stringify({ event: 'api', props: { a: 1 }, ts: 1 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    delete process.env.TELEMETRY_API_KEY;
  });
});
