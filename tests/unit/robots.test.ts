import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'fs';
import { filterAllowedUrls } from '../../lib/robots';

const robotsTxt = readFileSync(new URL('./mock/robots.txt', import.meta.url), 'utf8');

describe('robots.txt disallow rules', () => {
  it('filters out disallowed URLs', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(robotsTxt),
    });

    const base = 'https://example.com';
    const urls = [
      `${base}/`,
      `${base}/public/info`,
      `${base}/private/secret`,
    ];

    const allowed = await filterAllowedUrls(base, urls, mockFetch as any);
    expect(allowed).toEqual([`${base}/`, `${base}/public/info`]);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const calledWith = mockFetch.mock.calls[0][0];
    expect(String(calledWith)).toBe('https://example.com/robots.txt');
  });
});
