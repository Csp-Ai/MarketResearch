import { describe, it, expect } from 'vitest';
import { crawlSite, Fetcher } from '../../lib/url-scout';

describe('URL Scout crawler', () => {
  it('stops crawling when max depth reached', async () => {
    const pages: Record<string, string> = {
      'http://example.com': '<a href="http://example.com/a">A</a><a href="http://example.com/b">B</a>',
      'http://example.com/a': '<a href="http://example.com/c">C</a>',
      'http://example.com/b': '<a href="http://example.com/d">D</a>',
      'http://example.com/c': '',
      'http://example.com/d': ''
    };

    const called: string[] = [];
    const fetcher: Fetcher = async (url: string) => {
      called.push(url);
      return pages[url] || '';
    };

    const result = await crawlSite('http://example.com', 1, fetcher);

    expect(result.discoveredUrls).toEqual([
      'http://example.com',
      'http://example.com/a',
      'http://example.com/b'
    ]);
    expect(called).toEqual(['http://example.com']);
  });
});
