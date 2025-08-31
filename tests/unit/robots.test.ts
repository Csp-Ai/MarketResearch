import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchIfAllowed } from '../../lib/robots';

const makeFetch = (robots: string) => {
  return vi.fn(async (input: any) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.endsWith('/robots.txt')) {
      return new Response(robots, { status: 200 });
    }
    return new Response('ok', { status: 200 });
  });
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchIfAllowed', () => {
  it('skips disallowed paths from robots.txt', async () => {
    const fetchMock = makeFetch('User-agent: *\nDisallow: /private');
    vi.stubGlobal('fetch', fetchMock as any);

    const res = await fetchIfAllowed('https://example.com/private/data');
    expect(res).toBeNull();
    const firstCall = fetchMock.mock.calls[0][0];
    expect(firstCall.toString()).toBe('https://example.com/robots.txt');
  });

  it('allows paths not disallowed', async () => {
    const fetchMock = makeFetch('User-agent: *\nDisallow: /private');
    vi.stubGlobal('fetch', fetchMock as any);

    const res = await fetchIfAllowed('https://example.com/public/info');
    expect(res).not.toBeNull();
  });

  it('honors allow overrides', async () => {
    const fetchMock = makeFetch('User-agent: *\nDisallow: /private\nAllow: /private/open');
    vi.stubGlobal('fetch', fetchMock as any);

    const res = await fetchIfAllowed('https://example.com/private/open/page');
    expect(res).not.toBeNull();
  });
});
