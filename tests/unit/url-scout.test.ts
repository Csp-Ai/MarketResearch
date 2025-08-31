import { describe, expect, it } from 'vitest';
import { urlScout } from '../../lib/url-scout';

describe('urlScout', () => {
  it('stops crawling at depth 3', async () => {
    const pages: Record<string, string> = {
      'http://example.com/': '<a href="/1">1</a>',
      'http://example.com/1': '<a href="/2">2</a>',
      'http://example.com/2': '<a href="/3">3</a>',
      'http://example.com/3': '<a href="/4">4</a>',
      'http://example.com/4': '<a href="/5">5</a>',
    };

    const fetched: string[] = [];
    const fetchStub = async (url: string) => {
      fetched.push(url);
      return {
        text: async () => pages[url] ?? '',
      } as any;
    };

    const result = await urlScout('http://example.com/', 3, fetchStub);

    expect(fetched).not.toContain('http://example.com/4');
    expect(result.discoveredUrls).not.toContain('http://example.com/4');
    expect(result.discoveredUrls).toHaveLength(4);
  });
});
