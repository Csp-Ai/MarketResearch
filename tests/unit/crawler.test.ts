import { describe, it, expect } from 'vitest';
import { crawl, FetchPage, Page } from '../../lib/crawler';

describe('crawler', () => {
  it('stops when page count exceeds limit', async () => {
    const fetchHistory: string[] = [];
    const fetchPage: FetchPage = async (url: string): Promise<Page> => {
      fetchHistory.push(url);
      const id = Number(url.replace('page', ''));
      return { url, links: [`page${id + 1}`] };
    };

    const pages = await crawl('page1', fetchPage, 3);

    expect(pages.map((p) => p.url)).toEqual(['page1', 'page2', 'page3']);
    expect(fetchHistory).toEqual(['page1', 'page2', 'page3']);
  });
});
