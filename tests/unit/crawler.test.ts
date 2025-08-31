import { describe, it, expect, vi } from 'vitest';
import { crawl } from '../../lib/crawler';

describe('crawler', () => {
  it('logs depth for each crawl level', async () => {
    const logger = vi.fn();
    await crawl({ baseUrl: 'http://example.com', maxDepth: 2, log: logger });
    expect(logger.mock.calls).toEqual([[0], [1], [2]]);
  });
});
